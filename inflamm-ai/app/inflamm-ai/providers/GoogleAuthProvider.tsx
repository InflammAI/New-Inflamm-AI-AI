'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useGoogleAuth as useGoogleOAuth } from '../../../hooks/useGoogleAuth';
import { GoogleUser } from '../../../lib/google-oauth';

interface GoogleAuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<GoogleUser>;
  signOut: () => void;
  isSignedIn: () => boolean;
  setUser: (user: GoogleUser | null) => void; // Add this to allow manual user setting
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, error, signIn, signOut, isSignedIn } = useGoogleOAuth();
  const [globalUser, setGlobalUser] = useState<GoogleUser | null>(null);

  // Sync user state between hook and context
  useEffect(() => {
    setGlobalUser(user);
  }, [user]);

  // Check for user in URL hash (from OAuth callback)
  useEffect(() => {
    console.log('GoogleAuthProvider: Checking for OAuth callback...');
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    
    console.log('Hash:', hash);
    console.log('SearchParams:', searchParams.toString());
    
    // Check hash fragment for access token
    if (hash && hash.includes('access_token')) {
      console.log('Found access token in hash');
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        console.log('Access token found, fetching user info...');
        // Fetch user info using our server-side proxy
        fetch('/api/auth/google/userinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        })
          .then(response => {
            console.log('User info response:', response);
            return response.json();
          })
          .then(userData => {
            console.log('User data received:', userData);
            setGlobalUser(userData);
            // Clean URL
            window.history.replaceState(null, '', window.location.pathname);
          })
          .catch(err => {
            console.error('Failed to fetch user info:', err);
          });
      }
    }
    
    // Also check for user data from callback page
    const googleUserData = searchParams.get('google_user');
    if (googleUserData) {
      console.log('Found google_user in search params');
      try {
        const user = JSON.parse(decodeURIComponent(googleUserData));
        console.log('Parsed user data:', user);
        setGlobalUser(user);
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
      } catch (err) {
        console.error('Failed to parse user data from callback:', err);
      }
    }
  }, []);

  const handleSetUser = (user: GoogleUser | null) => {
    setGlobalUser(user);
  };

  const handleSignOut = () => {
    console.log('GoogleAuthProvider: Signing out user');
    setGlobalUser(null);
    
    // Clear any URL hash or search params that might contain auth data
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
      
      // Try to revoke any existing Google tokens
      const service = getGoogleOAuthService();
      if (service) {
        service.signOut();
      }
    }
  };

  return (
    <GoogleAuthContext.Provider value={{ 
      user: globalUser, 
      loading, 
      error, 
      signIn, 
      signOut: handleSignOut, 
      isSignedIn,
      setUser: handleSetUser 
    }}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);
  if (context === undefined) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
}
