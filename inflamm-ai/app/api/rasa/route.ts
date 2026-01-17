import { NextRequest, NextResponse } from 'next/server';

interface RasaRequest {
  sender: string;
  message: string;
}

interface RasaResponse {
  responses: Array<{
    text: string;
    image?: string;
    buttons?: Array<{
      title: string;
      payload: string;
    }>;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: RasaRequest = await request.json();
    const { sender, message } = body;

    // Rasa server URL (you'll need to run Rasa server)
    const rasaUrl = process.env.RASA_URL || 'http://localhost:5005';

    // Send message to Rasa
    const response = await fetch(`${rasaUrl}/webhooks/rest/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: sender || 'user',
        message: message
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Rasa API error: ${response.status} - ${errorData.error || response.statusText}`);
    }

    const data: RasaResponse = await response.json();
    
    // Combine all response texts
    const combinedResponse = data.responses
      .map(resp => resp.text)
      .join(' ');

    return NextResponse.json({
      success: true,
      response: combinedResponse,
      responses: data.responses
    });

  } catch (error) {
    console.error('Rasa API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
