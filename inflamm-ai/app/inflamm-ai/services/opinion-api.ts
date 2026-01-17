interface OpinionMarket {
  id: string;
  question: string;
  description: string;
  yesPrice: number;
  noPrice: number;
  totalStake: number;
  endDate: string;
  category: string;
  votes: number;
  volume24h: number;
  source: 'opinion' | 'local';
  liquidity?: number;
}

interface OpinionPosition {
  id: string;
  marketId: string;
  prediction: 'yes' | 'no';
  stake: number;
  price: number;
  timestamp: string;
}

class OpinionAPIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPINION_API_KEY || '';
    this.baseUrl = 'https://api.opinion.com/v1';
  }

  async getMarkets(category?: string, limit: number = 10): Promise<OpinionMarket[]> {
    try {
      if (!this.apiKey) {
        console.warn('Opinion API key not configured, returning empty markets');
        return [];
      }

      const response = await fetch(
        `${this.baseUrl}/markets?category=${category || 'science'}&limit=${limit}&active=true`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Opinion API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.markets.map((market: any) => ({
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
        source: 'opinion' as const,
        liquidity: market.liquidity || 0,
      }));

    } catch (error) {
      console.error('Error fetching Opinion API markets:', error);
      return [];
    }
  }

  async createMarket(
    question: string,
    description: string,
    category: string,
    endDate: string
  ): Promise<OpinionMarket | null> {
    try {
      if (!this.apiKey) {
        console.warn('Opinion API key not configured, cannot create market');
        return null;
      }

      const response = await fetch(`${this.baseUrl}/markets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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

      return {
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
        source: 'opinion' as const,
      };

    } catch (error) {
      console.error('Error creating Opinion API market:', error);
      return null;
    }
  }

  async placePosition(
    marketId: string,
    prediction: 'yes' | 'no',
    stake: number
  ): Promise<OpinionPosition | null> {
    try {
      if (!this.apiKey) {
        console.warn('Opinion API key not configured, cannot place position');
        return null;
      }

      const cleanMarketId = marketId.replace('opinion-', '');

      const response = await fetch(`${this.baseUrl}/markets/${cleanMarketId}/positions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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

      return {
        id: data.id,
        marketId: `opinion-${cleanMarketId}`,
        prediction,
        stake,
        price: data.price,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      console.error('Error placing position on Opinion API:', error);
      return null;
    }
  }

  async getMarketPrice(marketId: string): Promise<{ yesPrice: number; noPrice: number } | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const cleanMarketId = marketId.replace('opinion-', '');

      const response = await fetch(`${this.baseUrl}/markets/${cleanMarketId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Opinion API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        yesPrice: Math.round(data.yesPrice * 100),
        noPrice: Math.round(data.noPrice * 100),
      };

    } catch (error) {
      console.error('Error fetching market price:', error);
      return null;
    }
  }
}

export const opinionAPIService = new OpinionAPIService();
export type { OpinionMarket, OpinionPosition };
