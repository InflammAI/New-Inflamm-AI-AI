// src/services/geminiService.ts

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

export class GeminiService {
  private baseUrl: string = '/api/gemini';

  async generateHealthResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
    try {
      console.log('Calling Gemini API with message:', userMessage);
      
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

      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error response:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API response data:', data);
      
      if (data.success && data.response) {
        return data.response;
      }

      throw new Error(data.error || 'No response generated from Gemini');

    } catch (error) {
      console.error('Error generating Gemini response:', error);
      throw error;
    }
  }

  async isConfigured(): Promise<boolean> {
    try {
      // Test the API with a simple request
      const testResponse = await fetch('/api/test', {
        method: 'GET',
      });
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        console.log('API test result:', data);
        return data.hasApiKey;
      }
      
      return false;
    } catch (error) {
      console.error('Gemini API configuration check failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
