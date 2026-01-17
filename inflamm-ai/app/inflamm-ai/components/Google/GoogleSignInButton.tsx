'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SimpleGoogleSignIn } from '../../../../components/SimpleGoogleSignIn';
import { GoogleUser } from '../../../../lib/google-oauth';
import { useGoogleAuth } from '../../providers/GoogleAuthProvider';

interface GoogleSignInButtonProps {
  onSignIn?: (user: GoogleUser) => void;
  onSignOut?: () => void;
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onSignIn, 
  onSignOut, 
  className = '' 
}) => {
  const { user, loading, signIn, signOut, setUser } = useGoogleAuth();

  const handleSignIn = async (googleUser: GoogleUser) => {
    setUser(googleUser);
    onSignIn?.(googleUser);
  };

  const handleSignOutClick = () => {
    signOut();
    onSignOut?.();
  };

  if (user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOutClick}
          disabled={loading}
          className="px-3 py-2 text-sm bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {loading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <SimpleGoogleSignIn 
        onSuccess={handleSignIn}
        onError={(error) => console.error('Google sign-in failed:', error)}
      />
    </div>
  );
};
