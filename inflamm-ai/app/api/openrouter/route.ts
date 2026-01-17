import { NextRequest, NextResponse } from 'next/server';

interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: OpenRouterRequest = await request.json();
    const { model = 'openai/gpt-4o-mini', messages, stream = true, max_tokens = 800, temperature = 0.7 } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Build conversation history for OpenRouter
    const formattedMessages = [
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
    if (messages && messages.length > 0) {
      const recentHistory = messages.slice(-6);
      recentHistory.forEach((msg) => {
        formattedMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current user message
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        formattedMessages.push({
          role: 'user',
          content: lastMessage.content
        });
      }
    }

    const requestBody = {
      model: model,
      messages: formattedMessages,
      max_tokens: max_tokens,
      temperature: temperature,
      stream: stream
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://inflamm-ai.com',
        'X-Title': 'Inflamm-AI Health Assistant'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    if (stream) {
      // Handle streaming response
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
                      // Send content chunk
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
    } else {
      // Handle non-streaming response
      const data: OpenRouterResponse = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const choice = data.choices[0];
        if (choice.message && choice.message.content) {
          return NextResponse.json({
            success: true,
            response: choice.message.content.trim(),
            usage: data.usage
          });
        }
      }

      throw new Error('No response generated from OpenRouter');
    }

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
