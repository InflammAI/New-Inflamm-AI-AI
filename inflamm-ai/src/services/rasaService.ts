// src/services/rasaService.ts

export class RasaService {
  private baseUrl: string = '/api/rasa';

  async generateHealthResponse(
    userMessage: string, 
    conversationHistory: Array<{role: string, content: string}> = [],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      console.log('Calling Rasa API for message:', userMessage);
      
      const requestBody = {
        sender: 'user',
        message: userMessage
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Rasa API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Rasa API error response:', errorData);
        throw new Error(`Rasa API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Rasa API response data:', data);
      
      if (data.success && data.response) {
        // Simulate streaming for consistency
        if (onChunk) {
          const words = data.response.split(' ');
          let accumulated = '';
          
          for (const word of words) {
            accumulated += (accumulated ? ' ' : '') + word;
            onChunk(accumulated);
            await new Promise(resolve => setTimeout(resolve, 30)); // Small delay for effect
          }
        }
        
        return data.response;
      }

      throw new Error(data.error || 'No response generated from Rasa');

    } catch (error) {
      console.error('Error generating Rasa response:', error);
      throw error;
    }
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
          sender: 'user',
          message: "Hello"
        })
      });
      
      console.log('Rasa API test status:', testResponse.status);
      return testResponse.ok;
    } catch (error) {
      console.error('Rasa API configuration check failed:', error);
      return false;
    }
  }
}

export const rasaService = new RasaService();
