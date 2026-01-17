// src/services/openrouterService.ts

export class OpenRouterService {
  private baseUrl: string = '/api/openrouter';
  private apiKey: string = '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';

  async generateHealthResponse(
    userMessage: string, 
    conversationHistory: Array<{role: string, content: string}> = [],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      console.log('Calling OpenRouter API with streaming for message:', userMessage);
      
      const requestBody = {
        model: 'openai/gpt-4o-mini',
        messages: conversationHistory,
        stream: true,
        max_tokens: 800,
        temperature: 0.7
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('OpenRouter API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenRouter API error response:', errorData);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      // Check if response is streaming (text/event-stream) or regular JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('text/event-stream')) {
        // Handle streaming response
        return await this.handleStreamingResponse(response, onChunk);
      } else {
        // Handle regular JSON response (fallback)
        return await this.handleRegularResponse(response);
      }

    } catch (error) {
      console.error('Error generating OpenRouter response:', error);
      throw error;
    }
  }

  private async handleStreamingResponse(
    response: Response, 
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              
              if (content) {
                fullResponse += content;
                // Call onChunk callback for real-time updates
                if (onChunk) {
                  onChunk(fullResponse);
                }
              }
            } catch (e) {
              // Skip invalid JSON
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log('OpenRouter streaming complete, full response length:', fullResponse.length);
    return fullResponse;
  }

  private async handleRegularResponse(response: Response): Promise<string> {
    const data = await response.json();
    console.log('OpenRouter regular response data:', data);
    
    if (data.success && data.response) {
      return data.response;
    }

    throw new Error(data.error || 'No response generated from OpenRouter');
  }

  async isConfigured(): Promise<boolean> {
    try {
      // Test API with a simple request
      const testResponse = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: "Hello, this is a test"
            }
          ],
          stream: false
        })
      });
      
      console.log('OpenRouter API test status:', testResponse.status);
      return testResponse.ok;
    } catch (error) {
      console.error('OpenRouter API configuration check failed:', error);
      return false;
    }
  }
}

export const openrouterService = new OpenRouterService();
