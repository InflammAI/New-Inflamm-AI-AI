import { ProcessedArticle } from '../types/news';

interface NewsApiArticle {
  url?: string;
  title?: string;
  description?: string;
  content?: string;
  urlToImage?: string | null;
  publishedAt?: string;
  source?: {
    name?: string;
  };
}

export async function fetchHealthNews(limit: number = 10): Promise<ProcessedArticle[]> {
  try {
    console.log('🌐 Fetching health news...');
    const response = await fetch(`/api/news?limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    
    // If we got an error response from our API route
    if (data.error) {
      console.error('❌ API Route Error:', data.error);
      throw new Error(data.error);
    }

    // Ensure we have an array, even if empty
    const articles = Array.isArray(data) ? data : [data].filter(Boolean);
    
    console.log(`✅ Successfully processed ${articles.length} articles`);
    
    // Process each article with proper fallbacks
    return articles.map((article: NewsApiArticle, index: number) => {
      // Handle both direct API response and our mock data format
      const sourceName = typeof article.source === 'string' 
        ? article.source 
        : article.source?.name || 'Unknown Source';
      
      return {
        id: article.url || `article-${index}-${Date.now()}`,
        title: article.title?.trim() || 'No title available',
        summary: (article.description || article.content || 'No summary available').substring(0, 200) + '...',
        image: article.urlToImage || '/placeholder-news.jpg',
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: sourceName,
        link: article.url || '#',
      };
    });
  } catch (error) {
    console.error('❌ Error in fetchHealthNews:', error);
    // Return a fallback article in case of error
    return [{
      id: 'error-1',
      title: 'Failed to load news',
      summary: 'We encountered an error while loading the latest health news. Please try again later.',
      image: '/placeholder-news.jpg',
      publishedAt: new Date().toISOString(),
      source: 'System',
      link: '#',
    }];
  }
}