'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarItem } from './SidebarItem';
import { Logo } from '../Logo/Logo';
import { IconVyTap, IconVitals, IconChat, IconSciCast, IconBlog } from './icons';
import { isFeatureEnabled } from '@/app/inflamm-ai/lib/featureFlags';

interface SidebarProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  collapsed?: boolean;
}

const SIDEBAR_ITEMS = [
  { id: 'vytap', label: 'VyTap', Icon: IconVyTap, feature: 'FEATURE_VYTAP' as const },
  { id: 'vitalsync', label: 'Vitalsync', Icon: IconVitals, feature: 'FEATURE_VITALSYNC' as const },
  { id: 'chat', label: 'Chat', Icon: IconChat, feature: 'FEATURE_CHAT' as const },
  { id: 'scicast', label: 'SciCast', Icon: IconSciCast, feature: 'FEATURE_SCICAST' as const },
  { id: 'blog', label: 'Blog', Icon: IconBlog, feature: 'FEATURE_BLOG' as const },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onNavigate,
  collapsed = false,
}) => {
  const enabledItems = SIDEBAR_ITEMS.filter(item => isFeatureEnabled(item.feature));
  const showQuantumBg = isFeatureEnabled('FEATURE_QUANTUM_BG');

  return (
    <aside
      className={`
        relative h-full bg-[var(--surface)] p-4 transition-all duration-300
        ${collapsed ? 'w-20' : 'w-72'}
      `}
      aria-label="Main navigation"
    >
      {/* Circuit background */}
      {showQuantumBg && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'url(/images/circuit-bg.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Brand */}
      <div className="relative z-10 mb-8">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <h1 className="text-xl font-bold text-white">Inflamm AI</h1>
          </div>
        ) : (
          <div className="flex justify-center">
            <Logo size={48} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 space-y-2">
        {enabledItems.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            Icon={item.Icon}
            active={activeModule === item.id}
            onClick={() => onNavigate(item.id)}
            collapsed={collapsed}
            locked={item.id === 'vitalsync' || item.id === 'chat' || item.id === 'scicast'}
          />
        ))}
      </nav>

      {/* Quantum glow particles */}
      {showQuantumBg && (
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
          <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-[var(--accent-orange)] opacity-20 animate-pulse" />
          <div className="absolute bottom-16 right-12 w-1.5 h-1.5 rounded-full bg-[var(--accent-yellow)] opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}
    </aside>
  );
};
