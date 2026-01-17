# Google OAuth Migration Guide

## Overview
This guide helps you migrate from Firebase Authentication to direct Google OAuth 2.0 using Google Cloud Console.

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the **Google Identity** API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Identity Toolkit API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Select "Web application"
   - Add authorized redirect URI: `http://localhost:3001`
   - Copy the **Client ID**

### 2. Environment Configuration

Update your `.env.local` file:

```env
#############################################
# Google OAuth 2.0 Configuration
# Get these from: https://console.cloud.google.com/apis/credentials
#############################################
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3001
```

### 3. Code Migration

#### Replace Firebase Auth with Google OAuth:

**Old way (Firebase):**
```typescript
import { signInWithGoogle } from '../lib/google-auth';
```

**New way (Google OAuth):**
```typescript
import { GoogleSignInButton } from '../components/GoogleSignInButton';
```

#### In your components:

```tsx
import { GoogleSignInButton } from '../components/GoogleSignInButton';

function YourComponent() {
  const handleSignIn = (user) => {
    console.log('User signed in:', user);
    // Handle successful sign-in
  };

  const handleError = (error) => {
    console.error('Sign-in error:', error);
    // Handle error
  };

  return (
    <GoogleSignInButton 
      onSuccess={handleSignIn}
      onError={handleError}
    />
  );
}
```

#### Using the hook directly:

```tsx
import { useGoogleAuth } from '../hooks/useGoogleAuth';

function YourComponent() {
  const { user, loading, error, signIn, signOut } = useGoogleAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
}
```

## User Data Structure

### Firebase User Object:
```typescript
interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
}
```

### Google OAuth User Object:
```typescript
interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}
```

## Key Differences

| Feature | Firebase Auth | Google OAuth |
|---------|---------------|-------------|
| Setup | Firebase Console | Google Cloud Console |
| Token Management | Automatic | Manual (access tokens) |
| Session Persistence | Built-in | Custom implementation |
| Additional Providers | Multiple (Email, Phone, etc.) | Google only |
| Analytics Integration | Built-in | Separate setup |

## Benefits of Google OAuth

✅ **Direct Google Integration** - No intermediary service
✅ **Full Control** - Complete control over OAuth flow
✅ **Cost Effective** - No Firebase Auth usage costs
✅ **Simpler Setup** - Fewer dependencies
✅ **Customizable** - Can be extended for other Google APIs

## Migration Checklist

- [ ] Set up Google Cloud Console project
- [ ] Enable Google Identity API
- [ ] Create OAuth 2.0 Client ID
- [ ] Update environment variables
- [ ] Replace Firebase Auth imports
- [ ] Update user data handling
- [ ] Test sign-in flow
- [ ] Remove Firebase dependencies (optional)

## Troubleshooting

### Common Issues:

1. **"Google OAuth client ID not configured"**
   - Check your `.env.local` file
   - Ensure you've replaced the placeholder client ID

2. **"Redirect URI mismatch"**
   - Make sure the redirect URI in Google Cloud Console matches `http://localhost:3001`

3. **"Google Identity Services failed to load"**
   - Check network connectivity
   - Ensure no ad blockers are blocking Google scripts

## Files Created/Modified

- `lib/google-oauth.ts` - New Google OAuth implementation
- `hooks/useGoogleAuth.ts` - React hook for Google OAuth
- `components/GoogleSignInButton.tsx` - Sign-in button component
- `.env.local` - Updated environment variables
- `GOOGLE_OAUTH_MIGRATION.md` - This migration guide

## Next Steps

1. Configure your Google Cloud Console project
2. Update the environment variables with your real Client ID
3. Replace Firebase Auth usage in your components
4. Test the complete authentication flow
5. Remove Firebase dependencies if no longer needed
