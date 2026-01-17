// src/services/botpressService.ts

export class BotpressService {
  private baseUrl: string = '/api/botpress';

  async generateHealthResponse(
    userMessage: string, 
    conversationHistory: Array<{role: string, content: string}> = [],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      console.log('Calling Botpress API for message:', userMessage);
      
      const requestBody = {
        type: 'text',
        text: userMessage,
        userId: 'health-user-' + Date.now(),
        payload: {
          conversationHistory: conversationHistory,
          context: 'health-assistant'
        }
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Botpress API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Botpress API error response:', errorData);
        throw new Error(`Botpress API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Botpress API response data:', data);
      
      if (data.success && data.response) {
        // Simulate streaming for consistency
        if (onChunk) {
          const words = data.response.split(' ');
          let accumulated = '';
          
          for (const word of words) {
            accumulated += (accumulated ? ' ' : '') + word;
            onChunk(accumulated);
            await new Promise(resolve => setTimeout(resolve, 40)); // Small delay for effect
          }
        }
        
        return data.response;
      }

      throw new Error(data.error || 'No response generated from Botpress');

    } catch (error) {
      console.error('Error generating Botpress response:', error);
      throw error;
    }
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
          type: 'text',
          text: "Hello, this is a test",
          userId: 'test-user'
        })
      });
      
      console.log('Botpress API test status:', testResponse.status);
      return testResponse.ok;
    } catch (error) {
      console.error('Botpress API configuration check failed:', error);
      return false;
    }
  }
}

export const botpressService = new BotpressService();
