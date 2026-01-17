import { NextRequest, NextResponse } from 'next/server';

const OPINION_API_KEY = process.env.OPINION_API_KEY;
const OPINION_API_BASE = 'https://api.opinion.com/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: { marketId: string } }
) {
  try {
    const { prediction, stake } = await request.json();
    const marketId = params.marketId.replace('opinion-', '');

    if (!OPINION_API_KEY) {
      return NextResponse.json(
        { error: 'Opinion API key not configured' },
        { status: 500 }
      );
    }

    // Place position on Opinion API
    const response = await fetch(`${OPINION_API_BASE}/markets/${marketId}/positions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPINION_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outcome: prediction,
        amount: stake,
        type: 'market',
      }),
    });

    if (!response.ok) {
      throw new Error(`Opinion API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      position: {
        id: data.id,
        marketId: `opinion-${marketId}`,
        prediction,
        stake,
        price: data.price,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error placing position on Opinion API:', error);
    return NextResponse.json(
      { error: 'Failed to place position on Opinion API' },
      { status: 500 }
    );
  }
}
