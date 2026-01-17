'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { validateInviteCode } from '../../../lib/inviteCodes';

interface InviteCodeContextType {
  hasAccess: boolean;
  isChecking: boolean;
  error: string | null;
  checkAccess: () => void;
  validateAndGrantAccess: (code: string) => Promise<boolean>;
  revokeAccess: () => void;
}

const InviteCodeContext = createContext<InviteCodeContextType | undefined>(undefined);

export function InviteCodeProvider({ children }: { children: ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user already has access on mount
  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = () => {
    setIsChecking(true);
    const storedAccess = localStorage.getItem('invite_access_granted');
    const accessTime = localStorage.getItem('invite_access_time');
    
    if (storedAccess === 'true' && accessTime) {
      const accessDate = new Date(accessTime);
      const now = new Date();
      const daysSinceAccess = (now.getTime() - accessDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Grant access for 30 days, then require re-verification
      if (daysSinceAccess < 30) {
        setHasAccess(true);
      } else {
        // Access expired, remove it
        localStorage.removeItem('invite_access_granted');
        localStorage.removeItem('invite_access_time');
        setHasAccess(false);
      }
    }
    setIsChecking(false);
  };

  const validateAndGrantAccess = async (code: string): Promise<boolean> => {
    setError(null);
    
    const validation = validateInviteCode(code);
    
    if (!validation.valid) {
      setError(validation.message || 'Invalid access code');
      return false;
    }

    // Grant access
    setHasAccess(true);
    localStorage.setItem('invite_access_granted', 'true');
    localStorage.setItem('invite_access_time', new Date().toISOString());
    
    return true;
  };

  const revokeAccess = () => {
    setHasAccess(false);
    localStorage.removeItem('invite_access_granted');
    localStorage.removeItem('invite_access_time');
  };

  return (
    <InviteCodeContext.Provider value={{
      hasAccess,
      isChecking,
      error,
      checkAccess,
      validateAndGrantAccess,
      revokeAccess
    }}>
      {children}
    </InviteCodeContext.Provider>
  );
}

export function useInviteCode() {
  const context = useContext(InviteCodeContext);
  if (context === undefined) {
    throw new Error('useInviteCode must be used within an InviteCodeProvider');
  }
  return context;
}
