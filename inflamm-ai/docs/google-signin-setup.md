# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In for the Inflamm AI application.

## Prerequisites

- Google Cloud Console account
- Firebase project (can be created automatically)

## Step 1: Set up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enable Google Analytics (optional)
   - Choose your Google Analytics account
4. Wait for project creation

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started** on the Authentication page
3. In the "Sign-in method" tab, click **Google**
4. **Enable** the Google provider
5. Provide a project email address
6. Click **Save**

## Step 3: Get Firebase Configuration

1. In Firebase, go to **Project Settings** (gear icon ⚙️)
2. In the "General" tab, scroll down to "Your apps"
3. Click the web app icon (`</>`)
4. Give your app a nickname (e.g., "Inflamm AI Web")
5. Click "Register app"
6. Copy the Firebase configuration object
7. Add the values to your `.env` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 4: Configure Authorized Domains

1. In Firebase Project Settings, go to **Authentication** → **Sign-in method**
2. Scroll down to **Authorized domains**
3. Add your development domain:
   - `localhost` (for development)
   - `your-domain.com` (for production)
4. Click **Add domain**

## Step 5: Update Google Cloud Console (if needed)

If you're using a custom domain or need additional configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Find the "Web client (auto created by Google Service)" under "OAuth 2.0 Client IDs"
5. Add your authorized JavaScript origins and redirect URIs

## Step 6: Test the Implementation

1. Restart your development server
2. Navigate to the app
3. You should see the "Authentication Required" screen
4. Click "Sign in with Google"
5. Complete the Google sign-in flow
6. You should be successfully authenticated and able to access the app

## Troubleshooting

### Common Issues

1. **"auth/unauthorized-domain" error**
   - Add your domain to Firebase authorized domains
   - Check that your environment variables are correctly set

2. **"auth/api-key-not-authorized" error**
   - Verify your Firebase API key is correct
   - Ensure the API key is not restricted

3. **Sign-in button not working**
   - Check browser console for errors
   - Verify Firebase configuration is loaded correctly

4. **Environment variables not loading**
   - Ensure your `.env` file is in the root directory
   - Restart your development server after adding environment variables

### Development vs Production

- **Development**: Use `localhost` as authorized domain
- **Production**: Add your actual domain to authorized domains
- **Staging**: Add your staging domain if applicable

## Security Considerations

- Never expose your Firebase service account keys in client-side code
- Use environment variables for all configuration
- Enable email verification in Firebase Authentication settings
- Consider implementing additional security measures like rate limiting

## Features Implemented

- ✅ Google Sign-In integration
- ✅ User profile display (name, email, photo)
- ✅ Sign-out functionality
- ✅ Authentication state management
- ✅ Integration with existing wallet authentication
- ✅ Responsive design for mobile and desktop

## Next Steps

1. Implement user data persistence
2. Add user profile management
3. Integrate with health data tracking
4. Add social features (sharing, etc.)
5. Implement backup authentication methods
