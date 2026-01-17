export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
}

export interface ProcessedArticle {
  id: string;
  title: string;
  summary: string;
  image: string;
  publishedAt: string;
  source: string;
  link: string;
}

export function isNewsArticle(article: any): article is NewsArticle {
  return (
    article &&
    typeof article === 'object' &&
    'title' in article &&
    'description' in article &&
    'url' in article
  );
}
