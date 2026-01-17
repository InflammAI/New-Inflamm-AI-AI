// src/services/localHealthAssistantService.ts

export class LocalHealthAssistantService {
  private baseUrl: string = '/api/local-health-assistant';
  private userId: string = 'user_01KE4F8Q827B55F8VZBM5JZQ95';

  async generateHealthResponse(
    userMessage: string, 
    conversationHistory: Array<{role: string, content: string}> = [],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      console.log('Calling local health assistant for message:', userMessage);
      
      const requestBody = {
        message: userMessage,
        context: conversationHistory.map(msg => msg.content).join(' '),
        userId: this.userId
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Local health assistant response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Local health assistant error response:', errorData);
        throw new Error(`Local health assistant error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Local health assistant response data:', data);
      
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

      throw new Error(data.error || 'No response generated from local health assistant');

    } catch (error) {
      console.error('Error generating local health assistant response:', error);
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
          message: "Hello, this is a test",
          userId: this.userId
        })
      });
      
      console.log('Local health assistant test status:', testResponse.status);
      return testResponse.ok;
    } catch (error) {
      console.error('Local health assistant configuration check failed:', error);
      return false;
    }
  }

  getUserId(): string {
    return this.userId;
  }
}

export const localHealthAssistantService = new LocalHealthAssistantService();
