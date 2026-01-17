import { NextRequest, NextResponse } from 'next/server';

interface OpenAIRequest {
  message: string;
  conversationHistory: Array<{role: string, content: string}>;
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OpenAIRequest = await request.json();
    const { message, conversationHistory } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build conversation history for OpenAI
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are a compassionate and knowledgeable health assistant. Your personality should be:

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
- Be supportive but clear about limitations`
      }
    ];

    // Add conversation history (last 6 messages to stay within token limits)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6);
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.1,
      stream: true
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    // Create a readable stream for streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  
                  if (content) {
                    // Send the content chunk
                    const chunkData = `data: ${JSON.stringify({ content })}\n\n`;
                    controller.enqueue(encoder.encode(chunkData));
                  }
                } catch (e) {
                  // Skip invalid JSON
                  continue;
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
