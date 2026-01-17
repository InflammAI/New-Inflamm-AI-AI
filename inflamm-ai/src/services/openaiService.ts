// src/services/openaiService.ts

export class OpenAIService {
  private baseUrl: string = '/api/openai';

  async generateHealthResponse(
    userMessage: string, 
    conversationHistory: Array<{role: string, content: string}>,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      console.log('Calling OpenAI API with streaming for message:', userMessage);
      
      const requestBody = {
        message: userMessage,
        conversationHistory: conversationHistory
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('OpenAI API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error response:', errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error || response.statusText}`);
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
      console.error('Streaming failed, trying fallback:', error);
      return await this.tryFallback(userMessage, conversationHistory, onChunk);
    }
  }

  private async tryFallback(
    userMessage: string, 
    conversationHistory: Array<{role: string, content: string}>,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      console.log('Using fallback non-streaming API');
      
      const requestBody = {
        message: userMessage,
        conversationHistory: conversationHistory
      };

      const response = await fetch('/api/openai-fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fallback API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.response) {
        // Simulate streaming for consistency
        if (onChunk) {
          const words = data.response.split(' ');
          let accumulated = '';
          
          for (const word of words) {
            accumulated += (accumulated ? ' ' : '') + word;
            onChunk(accumulated);
            await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for effect
          }
        }
        
        return data.response;
      }

      throw new Error(data.error || 'No response from fallback');

    } catch (error) {
      console.error('Fallback also failed:', error);
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
              const content = parsed.content || '';
              
              if (content) {
                fullResponse += content;
                // Call the onChunk callback for real-time updates
                if (onChunk) {
                  onChunk(content);
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

    console.log('OpenAI streaming complete, full response length:', fullResponse.length);
    return fullResponse;
  }

  private async handleRegularResponse(response: Response): Promise<string> {
    const data = await response.json();
    console.log('OpenAI regular response data:', data);
    
    if (data.success && data.response) {
      return data.response;
    }

    throw new Error(data.error || 'No response generated from OpenAI');
  }

  async isConfigured(): Promise<boolean> {
    try {
      // Test the API with a simple request
      const testResponse = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Hello, this is a test",
          conversationHistory: []
        })
      });
      
      console.log('OpenAI API test status:', testResponse.status);
      return testResponse.ok;
    } catch (error) {
      console.error('OpenAI API configuration check failed:', error);
      return false;
    }
  }
}

export const openaiService = new OpenAIService();
