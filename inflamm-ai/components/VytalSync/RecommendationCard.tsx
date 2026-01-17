'use client';

import { useState } from 'react';
import { Lightbulb, ThumbsUp, Share2 } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: any;
  apiUrl: string;
  accessToken: string;
}

export function RecommendationCard({
  recommendation,
  apiUrl,
  accessToken,
}: RecommendationCardProps) {
  const [actedUpon, setActedUpon] = useState(recommendation.is_acted_upon);

  const handleActUpon = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/recommendations/${recommendation.id}/acted`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (response.ok) {
        setActedUpon(true);
      }
    } catch (err) {
      console.error('Failed to mark as acted upon:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{recommendation.recommendation_type}</p>
          </div>
        </div>
        {recommendation.confidence_score && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {Math.round(recommendation.confidence_score)}%
            </p>
            <p className="text-xs text-gray-500">Confidence</p>
          </div>
        )}
      </div>

      <p className="text-gray-700 text-sm mb-4">{recommendation.content}</p>

      <div className="flex gap-2">
        <button
          onClick={handleActUpon}
          disabled={actedUpon}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
            actedUpon
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{actedUpon ? 'Completed' : 'Mark as Done'}</span>
        </button>
        <button className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
