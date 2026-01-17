'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Activity, MessageCircle, TrendingUp, Edit3, Lock } from 'react-feather';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { WalletGate } from './components/WalletGate/WalletGate';
import { VyTapScreen } from './modules/vytap/VyTapScreen';
import { VitalsyncScreen } from './modules/vitalsync/VitalsyncScreen';
import { ChatScreen } from './modules/chat/ChatScreen';
import { SciCastScreen } from './modules/scicast/SciCastScreen';
import { BlogScreen } from './modules/blog/BlogScreen';
import { WalletConnectionProvider } from './providers/SolanaWalletProvider';
import { TonWalletProvider } from './providers/TonWalletProvider';
import { ParticleBackground } from './components/Background/ParticleBackground';
import { TelegramProvider } from '../components/TelegramProvider';
import './styles/tokens.css';

export default function InflammAIPage() {
  const [activeModule, setActiveModule] = useState('vytap');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || event.error?.message || '';
      if (
        errorMessage.includes('message channel closed') ||
        errorMessage.includes('Receiving end does not exist') ||
        errorMessage.includes('Extension context invalidated')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason);
      if (
        errorMessage.includes('message channel closed') ||
        errorMessage.includes('Receiving end does not exist') ||
        errorMessage.includes('Extension context invalidated')
      ) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case 'vytap':
        return (
          <WalletGate>
            <VyTapScreen />
          </WalletGate>
        );
      case 'vitalsync':
        return (
          <WalletGate>
            <VitalsyncScreen />
          </WalletGate>
        );
      case 'chat':
        return (
          <WalletGate>
            <ChatScreen />
          </WalletGate>
        );
      case 'scicast':
        return (
          <WalletGate>
            <SciCastScreen />
          </WalletGate>
        );
      case 'blog':
        return (
          <WalletGate>
            <BlogScreen />
          </WalletGate>
        );
      default:
        return (
          <WalletGate>
            <VyTapScreen />
          </WalletGate>
        );
    }
  };

  return (
    <TelegramProvider>
      <TonWalletProvider>
        <WalletConnectionProvider>
          <ParticleBackground />
          <div className="flex h-screen bg-[var(--bg)] overflow-hidden relative" style={{ zIndex: 10 }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar
            activeModule={activeModule}
            onNavigate={setActiveModule}
            collapsed={sidebarCollapsed}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && showMobileSidebar && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowMobileSidebar(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 z-50">
              <Sidebar
                activeModule={activeModule}
                onNavigate={(module) => {
                  setActiveModule(module);
                  setShowMobileSidebar(false);
                }}
                collapsed={false}
              />
            </div>
          </>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <Header
            onToggleSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          <main className="flex-1 overflow-y-auto relative z-10">
            {renderModule()}
          </main>

          {/* Mobile bottom navigation */}
          {isMobile && (
            <nav className="fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-gray-800 z-30">
              <div className="flex justify-around h-16">
                {[
                  { id: 'vytap', label: 'VyTap', Icon: Zap, locked: false },
                  { id: 'vitalsync', label: 'Vitals', Icon: Activity, locked: true },
                  { id: 'chat', label: 'Chat', Icon: MessageCircle, locked: true },
                  { id: 'scicast', label: 'SciCast', Icon: TrendingUp, locked: true },
                  { id: 'blog', label: 'Blog', Icon: Edit3, locked: false },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => !item.locked && setActiveModule(item.id)}
                    disabled={item.locked}
                    className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
                      item.locked 
                        ? 'text-gray-600 opacity-50 cursor-not-allowed'
                        : activeModule === item.id
                        ? 'text-[var(--accent-orange)]'
                        : 'text-[var(--muted)]'
                    }`}
                    style={{ minHeight: 'var(--touch-target-min)' }}
                  >
                    {item.locked ? (
                      <>
                        <Lock size={20} className="mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          Soon
                        </span>
                      </>
                    ) : (
                      <>
                        <item.Icon size={20} className="mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
        </WalletConnectionProvider>
      </TonWalletProvider>
    </TelegramProvider>
  );
}
