'use client';

import React, { useState } from 'react';
import { GoogleUser } from '../lib/google-oauth';

interface SimpleGoogleSignInProps {
  onSuccess?: (user: GoogleUser) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function SimpleGoogleSignIn({ 
  onSuccess, 
  onError, 
  className = '' 
}: SimpleGoogleSignInProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get client ID from environment variables
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI;

      if (!clientId || clientId.includes('your_') || clientId.includes('xxxxxxxx')) {
        throw new Error('Google OAuth client ID not configured');
      }

      // Direct OAuth 2.0 flow with callback page
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri ?? 'http://localhost:3000/inflamm-ai');
      authUrl.searchParams.set('response_type', 'token');
      authUrl.searchParams.set('scope', 'openid email profile');
      authUrl.searchParams.set('state', Math.random().toString(36).substring(7));

      // Open in same window (simpler than popup)
      window.location.href = authUrl.toString();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-in failed';
      setError(errorMessage);
      onError?.(errorMessage);
      setLoading(false);
    }
  };

  // Check if we have a token in URL (callback from Google)
  React.useEffect(() => {
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check hash fragment for access token
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        // Fetch user info
        fetchUserInfo(accessToken)
          .then(user => {
            onSuccess?.(user);
            // Clean URL
            window.history.replaceState(null, '', window.location.pathname);
          })
          .catch(err => {
            const errorMsg = err instanceof Error ? err.message : 'Failed to fetch user info';
            setError(errorMsg);
            onError?.(errorMsg);
          });
      }
    }
    
    // Also check for user data from callback page
    const googleUserData = searchParams.get('google_user');
    if (googleUserData) {
      try {
        const user = JSON.parse(decodeURIComponent(googleUserData));
        onSuccess?.(user);
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
      } catch (err) {
        const errorMsg = 'Failed to parse user data from callback';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    }
  }, [onSuccess, onError]);

  const fetchUserInfo = async (accessToken: string): Promise<GoogleUser> => {
    const response = await fetch('/api/auth/google/userinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user information');
    }
    return response.json();
  };

  return (
    <div className={className}>
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-3 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="font-medium">
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </span>
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
