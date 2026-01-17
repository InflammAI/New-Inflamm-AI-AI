import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    if (!apiKey) {
      console.error('❌ NEWS_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('🌐 Fetching news from NewsAPI...');
    const url = `https://newsapi.org/v2/top-headlines?category=health&pageSize=${limit}&language=en&apiKey=${apiKey}`;
    
    console.log('📡 Request URL:', url.replace(apiKey, '***'));
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ News API error:', response.status, errorText);
      throw new Error(`News API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Received', data.articles?.length || 0, 'articles');
    
    // Ensure we always return an array, even if data.articles is undefined
    const articles = Array.isArray(data.articles) ? data.articles : [];
    
    // Add some mock data if no articles are returned (for testing)
    if (articles.length === 0) {
      console.warn('⚠️ No articles found, using mock data');
      return NextResponse.json([{
        id: 'mock-1',
        title: 'Example Health News',
        summary: 'This is a sample health news article.',
        image: '/placeholder-news.jpg',
        publishedAt: new Date().toISOString(),
        source: 'Example News',
        link: '#'
      }]);
    }
    
    return NextResponse.json(articles);
    
  } catch (error) {
    console.error('❌ Error in news API route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

