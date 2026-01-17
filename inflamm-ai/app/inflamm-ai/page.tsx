'use client';

import React, { useState, useEffect } from 'react';
import { Activity, MessageCircle, TrendingUp, Edit3, Lock, ChevronUp } from 'react-feather';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { WalletGate } from './components/WalletGate/WalletGate';
import { WalletAwareContent } from './components/WalletAwareContent/WalletAwareContent';
import { VitalsyncScreen } from './modules/vitalsync/VitalsyncScreen';
import { ChatScreen } from './modules/chat/ChatScreen';
import { SciCastScreen } from './modules/scicast/SciCastScreen';
import { BlogScreen } from './modules/blog/BlogScreen';
import { WalletConnectionProvider } from './providers/SolanaWalletProvider';
import { GoogleAuthProvider } from './providers/GoogleAuthProvider';
import { ParticleBackground } from './components/Background/ParticleBackground';
import { InviteCodeProvider } from './providers/InviteCodeProvider';
import { InviteCodeGate } from './components/InviteCodeGate/InviteCodeGate';
import './styles/tokens.css';

export default function InflammAIPage() {
  const [activeModule, setActiveModule] = useState('vitalsync');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [mobileNavCollapsed, setMobileNavCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse mobile nav when entering chat module
  useEffect(() => {
    if (isMobile && activeModule === 'chat') {
      setMobileNavCollapsed(true);
    } else if (isMobile && activeModule !== 'chat') {
      setMobileNavCollapsed(false);
    }
  }, [activeModule, isMobile]);

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
            <VitalsyncScreen />
          </WalletGate>
        );
    }
  };

  return (
    <InviteCodeProvider>
      <InviteCodeGate>
        <WalletConnectionProvider>
          <GoogleAuthProvider>
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
                      <WalletAwareContent>
                        {renderModule()}
                      </WalletAwareContent>
                    </main>
                    {/* Mobile bottom navigation */}
                    {isMobile && (
                      <nav className={`fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-gray-800 z-30 transition-transform duration-300 pb-safe overflow-x-auto ${
                        mobileNavCollapsed ? 'translate-y-full' : 'translate-y-0'
                      }`}>
                        <div className="flex justify-around h-16 min-w-max px-2">
                          {[
                            { id: 'vitalsync', label: 'Vitals', Icon: Activity, locked: false },
                            { id: 'chat', label: 'Chat', Icon: MessageCircle, locked: false },
                            { id: 'scicast', label: 'SciCast', Icon: TrendingUp, locked: false },
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
                    {/* Mobile navigation toggle button */}
                    {isMobile && (mobileNavCollapsed || activeModule === 'chat') && (
                      <button
                        onClick={() => {
                          setMobileNavCollapsed(!mobileNavCollapsed);
                        }}
                        className={`fixed bottom-4 right-4 w-12 h-12 bg-[var(--accent-orange)] text-white rounded-full shadow-lg z-40 flex items-center justify-center transition-all duration-300 ${
                          mobileNavCollapsed ? 'scale-100 opacity-100' : 'scale-100 opacity-100'
                        }`}
                      >
                        <ChevronUp size={20} className={`transition-transform duration-300 ${mobileNavCollapsed ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
            </GoogleAuthProvider>
        </WalletConnectionProvider>
      </InviteCodeGate>
    </InviteCodeProvider>
  );
}
