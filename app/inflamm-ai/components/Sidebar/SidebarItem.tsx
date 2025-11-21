'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  id: string;
  label: string;
  Icon: React.ComponentType<{ isActive?: boolean; className?: string }>;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
  locked?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  Icon,
  active,
  onClick,
  collapsed = false,
  locked = false,
}) => {
  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      className={`
        relative w-full flex items-center gap-3 px-3 py-2.5
        rounded-xl transition-all duration-200
        ${locked ? 'cursor-not-allowed opacity-50' : 'hover:scale-[1.02] active:translate-y-[1px]'}
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0B0F14]
        ${active ? 'text-white' : 'text-[#98A1AD] hover:text-[#B8C1CC]'}
        ${collapsed ? 'justify-center' : ''}
      `}
      style={{ minHeight: 'var(--touch-target-min)' }}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-gradient-to-r from-[var(--glow-orange)] to-[var(--glow-yellow)] rounded-xl"
          style={{
            boxShadow: '0 4px 12px rgba(255, 138, 0, 0.2)',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
      
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className="flex-shrink-0">
          <Icon isActive={active} />
        </div>
        
        {!collapsed && (
          <div className="flex items-center justify-between flex-1 gap-2">
            <span className="font-medium text-sm whitespace-nowrap">
              {label}
            </span>
            {locked && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 border border-gray-600 font-semibold whitespace-nowrap">
                Coming Soon
              </span>
            )}
          </div>
        )}
        
        {collapsed && locked && (
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gray-600 border border-gray-500" />
        )}
      </div>
    </button>
  );
};
