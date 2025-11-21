'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchHealthNews } from '../../services/apitube';
import { ProcessedArticle, isNewsArticle } from '../../types/news';

export const BlogScreen: React.FC = () => {
  const [articles, setArticles] = useState<ProcessedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Research', 'Treatment', 'Prevention', 'Wellness'];

 useEffect(() => {
  let isMounted = true;
  
  async function loadNews() {
    try {
      setLoading(true);
      setError(null);
      
      const news = await fetchHealthNews(12);
      
      if (!isMounted) return;
      
    if (!Array.isArray(news)) {
  console.error('Invalid news format:', news);
  throw new Error('Received invalid news format from the server');
}
      
      setArticles(news);
    } catch (err) {
      console.error('Failed to fetch health news:', err);
      if (isMounted) {
        setError(err instanceof Error ? err.message : 'Failed to load health news. Please try again later.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadNews();
  
  return () => {
    isMounted = false;
  };
}, []);

  // Ensure filteredArticles is always an array
  // We can directly use articles since it's always an array now
  const filteredArticles = articles;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Health News</h1>
        <p className="text-[var(--muted)]">Latest health and medical news from trusted sources</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--surface)] rounded-xl overflow-hidden border border-gray-800 animate-pulse">
              <div className="h-48 bg-gray-800" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-800 rounded w-20" />
                <div className="h-6 bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="flex justify-between mt-4">
                  <div className="h-4 bg-gray-800 rounded w-24" />
                  <div className="h-4 bg-gray-800 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Articles grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--surface)] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer"
            >
              {/* Article Image */}
              <div className="h-48 overflow-hidden bg-gray-800">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              {/* Article Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-orange-400 font-medium">{article.source}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 text-sm font-medium">Read more</span>
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-orange-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300">No articles found</h3>
          <p className="mt-1 text-gray-500">We couldn't find any health news articles at the moment.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};
