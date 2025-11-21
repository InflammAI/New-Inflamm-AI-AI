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
}

export const SciCastScreen: React.FC = () => {
  const [markets] = useState<Market[]>([
    {
      id: '1',
      question: 'Will a major breakthrough in inflammation research be published in Nature before Q1 2026?',
      description: 'Resolves YES if a peer-reviewed study demonstrating novel inflammation mechanisms appears in Nature journal.',
      yesPrice: 62,
      noPrice: 38,
      totalStake: 15420,
      endDate: '2026-03-31',
      category: 'Research',
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
    },
  ]);

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [prediction, setPrediction] = useState<'yes' | 'no'>('yes');

  const handlePlacePosition = async () => {
    if (!selectedMarket) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/v1/scicast/markets/${selectedMarket.id}/position`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prediction, stake: stakeAmount }),
      // });

      alert(`Placed ${stakeAmount} Vital Points on ${prediction.toUpperCase()}`);
      setSelectedMarket(null);
      setStakeAmount(100);
    } catch (error) {
      console.error('Failed to place position:', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">SciCast</h1>
        <p className="text-[var(--muted)]">Predict scientific outcomes and earn Vital Points</p>
      </div>

      {/* Markets grid */}
      <div className="space-y-4">
        {markets.map((market, index) => (
          <motion.div
            key={market.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            {/* Category badge */}
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white">
                {market.category}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-white font-semibold text-lg mb-2">{market.question}</h3>
            <p className="text-[var(--muted)] text-sm mb-4">{market.description}</p>

            {/* Odds */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-[var(--bg)] rounded-lg p-4">
                <p className="text-[var(--muted)] text-xs mb-1">YES</p>
                <p className="text-green-500 text-2xl font-bold">{market.yesPrice}%</p>
              </div>
              <div className="flex-1 bg-[var(--bg)] rounded-lg p-4">
                <p className="text-[var(--muted)] text-xs mb-1">NO</p>
                <p className="text-red-500 text-2xl font-bold">{market.noPrice}%</p>
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

            {/* Action */}
            <button
              onClick={() => setSelectedMarket(market)}
              className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Place Prediction
            </button>
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
    </div>
  );
};
