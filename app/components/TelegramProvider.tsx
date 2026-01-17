"use client";

import { PropsWithChildren } from "react";

export function TelegramProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function useTelegramUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp?.initDataUnsafe?.user) {
      return webApp.initDataUnsafe.user as { 
        id: number; 
        first_name?: string; 
        last_name?: string; 
        username?: string 
      };
    }
  } catch {
    return null;
  }
  
  return null;
}
