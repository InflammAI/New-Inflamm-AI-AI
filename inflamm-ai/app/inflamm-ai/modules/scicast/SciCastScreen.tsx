'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Market {
  id: string;
  question: string;
  description: string;
  yesPrice: number;
  noPrice: number;
  totalStake: number;
  endDate: string;
  category: string;
  votes: number;
  userVote?: 'yes' | 'no';
  volume24h: number;
  liquidity?: number;
}

export const SciCastScreen: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([
    {
      id: '1',
      question: 'Will a major breakthrough in inflammation research be published in Nature before Q1 2026?',
      description: 'Resolves YES if a peer-reviewed study demonstrating novel inflammation mechanisms appears in Nature journal.',
      yesPrice: 62,
      noPrice: 38,
      totalStake: 15420,
      endDate: '2026-03-31',
      category: 'Research',
      votes: 1247,
      volume24h: 3200,
    },
    {
      id: '2',
      question: 'Will FDA approve a new anti-inflammatory drug in 2025?',
      description: 'Resolves YES if FDA grants approval for any novel anti-inflammatory therapeutic.',
      yesPrice: 45,
      noPrice: 55,
      totalStake: 8750,
      endDate: '2025-12-31',
      category: 'Regulatory',
      votes: 892,
      volume24h: 1800,
    },
    {
      id: '3',
      question: 'Will plant-based anti-inflammatory supplements gain mainstream adoption by 2026?',
      description: 'Resolves YES if market penetration reaches 25%+ in US adults.',
      yesPrice: 70,
      noPrice: 30,
      totalStake: 12300,
      endDate: '2026-12-31',
      category: 'Market',
      votes: 2103,
      volume24h: 4500,
    },
    {
      id: '4',
      question: 'Will CRISPR-based anti-inflammatory therapies enter clinical trials in 2025?',
      description: 'Resolves YES if any CRISPR-based anti-inflammatory therapy enters Phase I trials.',
      yesPrice: 58,
      noPrice: 42,
      totalStake: 9800,
      endDate: '2025-12-31',
      category: 'Technology',
      votes: 1567,
      volume24h: 2900,
    },
    {
      id: '5',
      question: 'Will AI-driven drug discovery reduce inflammation treatment costs by 30% by 2026?',
      description: 'Resolves YES if average treatment costs decrease by 30% due to AI-discovered compounds.',
      yesPrice: 41,
      noPrice: 59,
      totalStake: 11200,
      endDate: '2026-12-31',
      category: 'Technology',
      votes: 934,
      volume24h: 1600,
    },
  ]);

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [prediction, setPrediction] = useState<'yes' | 'no'>('yes');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userMarkets, setUserMarkets] = useState<Market[]>([]);
  const [showCreateHypothesis, setShowCreateHypothesis] = useState(false);
  const [newHypothesis, setNewHypothesis] = useState({
    question: '',
    description: '',
    category: 'Research',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', 'Research', 'Regulatory', 'Market', 'Technology'];

  const allMarkets = markets;

  const filteredMarkets = selectedCategory === 'All' 
  ? allMarkets 
  : allMarkets.filter(market => market.category === selectedCategory);

  const handleVote = (marketId: string, vote: 'yes' | 'no') => {
    const market = allMarkets.find(m => m.id === marketId);
    if (market) {
      setSelectedMarket(market);
      setPrediction(vote);
    }
  };

  const handlePlacePosition = async () => {
    if (!selectedMarket || !prediction || !stakeAmount) return;

    try {
      // Update the market's vote count and user vote
      setMarkets(prevMarkets => 
        prevMarkets.map(market => 
          market.id === selectedMarket.id 
            ? { ...market, votes: market.votes + 1, userVote: prediction }
            : market
        )
      );
      
      setSelectedMarket(null);
      setStakeAmount(100);
    } catch (error) {
      console.error('Failed to place position:', error);
      alert('Failed to place position. Please try again.');
    }
  };

  const handleCreateHypothesis = async () => {
    if (!newHypothesis.question || !newHypothesis.description || !newHypothesis.endDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const newMarket: Market = {
        id: (markets.length + 1).toString(),
        question: newHypothesis.question,
        description: newHypothesis.description,
        yesPrice: 50,
        noPrice: 50,
        totalStake: 0,
        endDate: newHypothesis.endDate,
        category: newHypothesis.category,
        votes: 0,
        volume24h: 0,
      };

      setMarkets(prevMarkets => [newMarket, ...prevMarkets]);

      setShowCreateHypothesis(false);
      setNewHypothesis({
        question: '',
        description: '',
        category: 'Research',
        endDate: ''
      });
      
    } catch (error) {
      console.error('Failed to create hypothesis:', error);
      alert('Failed to create hypothesis. Please try again.');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">SciCast</h1>
          <p className="text-[var(--muted)]">Predict scientific outcomes and earn Vital Points</p>
        </div>
        <button
          onClick={() => setShowCreateHypothesis(true)}
          className="px-6 py-3 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold rounded-lg hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Hypothesis
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white'
                  : 'bg-[var(--surface)] text-[var(--muted)] hover:text-white border border-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--surface)] rounded-xl p-4 border border-gray-800">
          <p className="text-[var(--muted)] text-sm mb-1">Total Markets</p>
          <p className="text-white text-2xl font-bold">{allMarkets.length}</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 border border-gray-800">
          <p className="text-[var(--muted)] text-sm mb-1">Total Volume</p>
          <p className="text-white text-2xl font-bold">{allMarkets.reduce((sum, m) => sum + m.totalStake, 0).toLocaleString()} VP</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 border border-gray-800">
          <p className="text-[var(--muted)] text-sm mb-1">24h Volume</p>
          <p className="text-white text-2xl font-bold">{allMarkets.reduce((sum, m) => sum + m.volume24h, 0).toLocaleString()} VP</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 border border-gray-800">
          <p className="text-[var(--muted)] text-sm mb-1">Total Votes</p>
          <p className="text-white text-2xl font-bold">{allMarkets.reduce((sum, m) => sum + m.votes, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Markets grid */}
      <div className="space-y-4">
        {filteredMarkets.map((market, index) => (
          <motion.div
            key={market.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {/* Category badges */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white">
                    {market.category}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{market.question}</h3>
                <p className="text-[var(--muted)] text-sm">{market.description}</p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-[var(--muted)] text-xs mb-1">Votes</p>
                <p className="text-white text-lg font-bold">{market.votes.toLocaleString()}</p>
                {market.liquidity && (
                  <p className="text-[var(--muted)] text-xs mt-1">Liquidity: {market.liquidity}</p>
                )}
              </div>
            </div>

            {/* Odds and Voting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[var(--bg)] rounded-lg p-4">
                <p className="text-[var(--muted)] text-xs mb-1">YES</p>
                <p className="text-green-500 text-2xl font-bold">{market.yesPrice}%</p>
                <button
                  onClick={() => handleVote(market.id, 'yes')}
                  className="mt-2 w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Vote YES
                </button>
              </div>
              <div className="bg-[var(--bg)] rounded-lg p-4">
                <p className="text-[var(--muted)] text-xs mb-1">NO</p>
                <p className="text-red-500 text-2xl font-bold">{market.noPrice}%</p>
                <button
                  onClick={() => handleVote(market.id, 'no')}
                  className="mt-2 w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Vote NO
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">
                Total staked: <span className="text-white font-semibold">{market.totalStake.toLocaleString()} VP</span>
              </span>
              <span className="text-[var(--muted)]">
                Ends: {new Date(market.endDate).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Position modal */}
      {selectedMarket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMarket(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-[var(--surface)] rounded-2xl p-6 max-w-md w-full border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">Place Prediction</h2>
            
            <p className="text-[var(--muted)] text-sm mb-6">{selectedMarket.question}</p>

            {/* Prediction selector */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Your prediction</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrediction('yes')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    prediction === 'yes'
                      ? 'bg-green-600 text-white'
                      : 'bg-[var(--bg)] text-[var(--muted)] hover:text-white'
                  }`}
                >
                  YES {selectedMarket.yesPrice}%
                </button>
                <button
                  onClick={() => setPrediction('no')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    prediction === 'no'
                      ? 'bg-red-600 text-white'
                      : 'bg-[var(--bg)] text-[var(--muted)] hover:text-white'
                  }`}
                >
                  NO {selectedMarket.noPrice}%
                </button>
              </div>
            </div>

            {/* Stake amount */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Stake amount (Vital Points)
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] text-white border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMarket(null)}
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] text-white font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePlacePosition}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create Hypothesis Modal */}
      {showCreateHypothesis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateHypothesis(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-[var(--surface)] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create Scientific Hypothesis</h2>
            
            {/* Question */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Hypothesis Question *
              </label>
              <input
                type="text"
                value={newHypothesis.question}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, question: e.target.value }))}
                placeholder="e.g., Will CRISPR-based therapies cure genetic diseases by 2030?"
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] text-white border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                maxLength={200}
              />
              <p className="text-[var(--muted)] text-xs mt-1">
                {newHypothesis.question.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={newHypothesis.description}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed criteria for how this hypothesis will be resolved..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] text-white border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors resize-none"
                maxLength={500}
              />
              <p className="text-[var(--muted)] text-xs mt-1">
                {newHypothesis.description.length}/500 characters
              </p>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={newHypothesis.category}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] text-white border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
              >
                <option value="Research">Research</option>
                <option value="Regulatory">Regulatory</option>
                <option value="Market">Market</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            {/* End Date */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Resolution Date *
              </label>
              <input
                type="date"
                value={newHypothesis.endDate}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, endDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] text-white border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
              />
            </div>

            {/* Guidelines */}
            <div className="mb-6 p-4 bg-[var(--bg)] rounded-lg border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Guidelines:</h3>
              <ul className="text-[var(--muted)] text-sm space-y-1">
                <li>• Be specific and measurable</li>
                <li>• Include clear resolution criteria</li>
                <li>• Choose realistic timeframes</li>
                <li>• Avoid ambiguous language</li>
                <li>• Ensure verifiability</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateHypothesis(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] text-white font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateHypothesis}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Create Hypothesis
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
