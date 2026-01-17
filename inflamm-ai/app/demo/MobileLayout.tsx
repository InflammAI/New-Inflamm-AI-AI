'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Web3Provider } from '@/contexts/Web3Provider';
import { HealthProvider } from '@/contexts/HealthContext';
import { AIProvider } from '@/contexts/AIContext';

// Import your components
import { DashboardView } from './components/DashboardView';
import { HealthDashboard } from './components/HealthDashboard';
import { AIChat } from './components/AIChat';
import { BlogSection } from './components/BlogSection';

// Icons
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={isActive ? "#2563eb" : "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ActivityIcon = ({ isActive }: { isActive: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={isActive ? "#2563eb" : "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const MessageIcon = ({ isActive }: { isActive: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={isActive ? "#2563eb" : "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BookIcon = ({ isActive }: { isActive: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={isActive ? "#2563eb" : "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  // Set a default mobile state that will be updated after component mounts
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // This function will run only on the client side
    const checkIfMobile = () => {
      // Check if window is defined (client-side)
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    // Set initial value
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkIfMobile);
      }
    };
  }, []);

  const tabs: Tab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <HomeIcon isActive={activeTab === 'dashboard'} />,
      component: <DashboardView />
    },
    {
      id: 'health',
      label: 'Health',
      icon: <ActivityIcon isActive={activeTab === 'health'} />,
      component: <HealthDashboard />
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: <MessageIcon isActive={activeTab === 'chat'} />,
      component: <AIChat />
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: <BookIcon isActive={activeTab === 'blog'} />,
      component: <BlogSection />
    }
  ];

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg" style={{ WebkitTransform: 'translateZ(0)' }}>
      <nav className="flex h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center relative ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                outline: 'none',
              }}
            >
              <div className="relative p-1">
                {React.cloneElement(tab.icon as React.ReactElement, { isActive })}
                {isActive && (
                  <motion.span 
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-600 rounded-full"
                    style={{
                      transform: 'translateX(-50%)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-xs mt-0.5 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      {/* Safe area for mobile devices with notches */}
      <div className="h-4 bg-white sm:hidden" style={{ height: 'env(safe-area-inset-bottom, 0)' }} />
    </div>
  );

  const DesktopTabs = () => (
    <div className="hidden md:block bg-white border-b border-gray-200">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const renderContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    return activeTabData?.component || null;
  };

  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setIsConnected(!isConnected);
  };

  return (
    <Web3Provider>
      <HealthProvider>
        <AIProvider>
          <div className="min-h-screen bg-gray-50 pb-24 md:pb-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6rem)' }}>
            <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">InflammAI</h1>
              <button
                onClick={handleConnectWallet}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isConnected 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isConnected ? 'Connected' : 'Connect Wallet'}
              </button>
            </header>
            {/* Always show bottom navigation on mobile, desktop tabs on larger screens */}
            <div className="md:hidden">
              <BottomNavigation />
            </div>
            <div className="hidden md:block">
              <DesktopTabs />
            </div>
            
            <main className="p-4 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </AIProvider>
      </HealthProvider>
    </Web3Provider>
  );
}
