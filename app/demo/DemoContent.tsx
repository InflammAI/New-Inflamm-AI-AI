'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Web3Provider } from '@/contexts/Web3Provider';
import { HealthProvider } from '@/contexts/HealthContext';
import { AIProvider } from '@/contexts/AIContext';
import { WalletConnectButton } from '@/components/demo/WalletConnectButton';
import HealthDashboard from '@/components/demo/HealthDashboard';
import { AIChat } from '@/components/demo/AIChat';

export function DemoContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to render the current view based on activeTab
  const renderView = () => {
    switch (activeTab) {
      case 'health':
        return <HealthDashboard />;
      case 'ai':
        return <AIChat />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to InflammAI</h2>
              <p className="text-gray-600">
                Connect your wallet and start tracking your health data to earn rewards.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-900 mb-2">Your Health Summary</h3>
                <p className="text-sm text-gray-600">Connect your health devices to see your data.</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-sm text-gray-600">Convert your health data into tokens.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Inflamm</span>AI
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'health', label: 'Health Data' },
                { id: 'ai', label: 'AI Assistant' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="ml-4">
                <WalletConnectButton />
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'health', label: 'Health Data' },
                  { id: 'ai', label: 'AI Assistant' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="pt-2 border-t border-gray-200">
                  <WalletConnectButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}
