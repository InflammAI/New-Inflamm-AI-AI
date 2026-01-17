import { NextRequest, NextResponse } from 'next/server';

interface GeminiRequest {
  message: string;
  conversationHistory: Array<{role: string, content: string}>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeminiRequest = await request.json();
    const { message, conversationHistory } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const healthPrompt = `You are a compassionate and knowledgeable health assistant. Your personality should be:

**Tone & Style:**
- Warm, empathetic, and conversational
- Use natural, everyday language (avoid overly clinical terms)
- Be encouraging and supportive
- Ask follow-up questions when appropriate
- Use phrases like "I understand," "That sounds concerning," "Let me help you with that"

**Conversation Flow:**
1. **Acknowledge & Empathize**: Start by showing you understand their concern
2. **Clarify**: Ask relevant follow-up questions if needed
3. **Educate**: Provide helpful information in simple terms
4. **Guide**: Suggest practical steps and when to seek professional help
5. **Support**: End with encouragement and availability

**Response Guidelines:**
- Use "I" and "you" to create personal connection
- Break information into short, digestible paragraphs
- Use emojis occasionally for warmth (💊, 🌡️, 💪, 🏥, etc.)
- Include practical tips they can use immediately
- Always mention when professional medical care is needed
- Be honest about limitations ("I'm not a doctor, but...")

**Important:**
- Never diagnose or prescribe specific treatments
- Always include medical disclaimers
- Encourage professional medical care for serious symptoms
- Be supportive but clear about limitations`;

    // Build conversation context
    let context = "This is the beginning of our conversation. Start with a warm, welcoming tone.";
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-4);
      const contextMessages = recentHistory.map((msg) => {
        const role = msg.role === 'user' ? 'User' : 'Health Assistant';
        return `${role}: ${msg.content}`;
      }).join('\n\n');
      
      context = `Recent conversation:\n${contextMessages}\n\nContinue the conversation naturally, maintaining the warm, supportive tone.`;
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${healthPrompt}\n\n${context}\n\nUser: ${message}\n\nAssistant:`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return NextResponse.json({
          success: true,
          response: candidate.content.parts[0].text
        });
      }
    }

    throw new Error('No response generated from Gemini');

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
