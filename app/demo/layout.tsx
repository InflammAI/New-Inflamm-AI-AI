'use client';

import { Web3Provider } from '@/contexts/Web3Provider';
import { HealthProvider } from '@/contexts/HealthContext';
import { AIProvider } from '@/contexts/AIContext';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Web3Provider>
      <HealthProvider>
        <AIProvider>
          {children}
        </AIProvider>
      </HealthProvider>
    </Web3Provider>
  );
}
