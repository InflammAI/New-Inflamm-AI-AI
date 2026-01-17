import { NextRequest, NextResponse } from 'next/server';

const OPINION_API_KEY = process.env.OPINION_API_KEY;
const OPINION_API_BASE = 'https://api.opinion.com/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'science';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!OPINION_API_KEY) {
      return NextResponse.json(
        { error: 'Opinion API key not configured' },
        { status: 500 }
      );
    }

    // Fetch markets from Opinion API
    const response = await fetch(
      `${OPINION_API_BASE}/markets?category=${category}&limit=${limit}&active=true`,
      {
        headers: {
          'Authorization': `Bearer ${OPINION_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Opinion API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform Opinion API data to our format
    const markets = data.markets.map((market: any) => ({
      id: `opinion-${market.id}`,
      question: market.question,
      description: market.description,
      yesPrice: Math.round(market.yesPrice * 100),
      noPrice: Math.round(market.noPrice * 100),
      totalStake: market.volume24h || 0,
      endDate: market.resolutionDate,
      category: market.category || 'Science',
      votes: market.traderCount || 0,
      volume24h: market.volume24h || 0,
      source: 'opinion',
      liquidity: market.liquidity || 0,
    }));

    return NextResponse.json({
      success: true,
      markets,
      total: data.total || markets.length,
    });

  } catch (error) {
    console.error('Error fetching Opinion API markets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets from Opinion API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, description, category, endDate } = body;

    if (!OPINION_API_KEY) {
      return NextResponse.json(
        { error: 'Opinion API key not configured' },
        { status: 500 }
      );
    }

    // Create market on Opinion API
    const response = await fetch(`${OPINION_API_BASE}/markets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPINION_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        description,
        category: category.toLowerCase(),
        resolutionDate: endDate,
        type: 'binary',
        initialLiquidity: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Opinion API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      market: {
        id: `opinion-${data.id}`,
        question: data.question,
        description: data.description,
        yesPrice: 50,
        noPrice: 50,
        totalStake: 0,
        endDate: data.resolutionDate,
        category: data.category || 'Science',
        votes: 0,
        volume24h: 0,
        source: 'opinion',
      },
    });

  } catch (error) {
    console.error('Error creating Opinion API market:', error);
    return NextResponse.json(
      { error: 'Failed to create market on Opinion API' },
      { status: 500 }
    );
  }
}
