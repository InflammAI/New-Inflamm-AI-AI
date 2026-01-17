import { useState, useEffect } from 'react';
import { GoogleUser, initializeGoogleOAuth, getGoogleOAuthService } from '../lib/google-oauth';

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    if (!client_id || client_id.includes('your_') || client_id.includes('xxxxxxxx')) {
      setError('Google OAuth client ID not configured');
      setLoading(false);
      return;
    }

    initializeGoogleOAuth({
      client_id,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI
    });
    setLoading(false);
  }, [mounted]);

  const signIn = async (): Promise<GoogleUser> => {
    if (!mounted) {
      throw new Error('Google OAuth can only be used in the browser');
    }

    try {
      setLoading(true);
      setError(null);
      
      const service = getGoogleOAuthService();
      if (!service) {
        throw new Error('Google OAuth service not initialized');
      }

      await service.init();
      const googleUser = await service.signIn();
      setUser(googleUser);
      return googleUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = (): void => {
    try {
      const service = getGoogleOAuthService();
      if (service) {
        service.signOut();
      }
      setUser(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
    }
  };

  const getCurrentUser = (): GoogleUser | null => {
    if (!mounted) return null;
    
    const service = getGoogleOAuthService();
    if (service) {
      return service.getCurrentUser();
    }
    return null;
  };

  const isSignedIn = (): boolean => {
    if (!mounted) return false;
    
    const service = getGoogleOAuthService();
    if (service) {
      return service.isSignedIn();
    }
    return false;
  };

  return {
    user,
    loading: loading || !mounted,
    error,
    signIn,
    signOut,
    getCurrentUser,
    isSignedIn
  };
}
