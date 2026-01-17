import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (error) {
    // Redirect back to app with error
    const errorUrl = new URL('/inflamm-ai', request.nextUrl);
    errorUrl.searchParams.set('error', error);
    return NextResponse.redirect(errorUrl.toString());
  }

  if (code) {
    // Exchange authorization code for tokens (server-side flow)
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange authorization code');
      }

      const tokens = await tokenResponse.json();
      
      // Get user info with access token
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user information');
      }

      const userData = await userResponse.json();

      // Redirect back to app with user data
      const successUrl = new URL('/inflamm-ai', request.nextUrl);
      successUrl.searchParams.set('google_user', JSON.stringify(userData));
      
      return NextResponse.redirect(successUrl.toString());

    } catch (error) {
      console.error('OAuth callback error:', error);
      const errorUrl = new URL('/inflamm-ai', request.nextUrl);
      errorUrl.searchParams.set('error', 'OAuth callback failed');
      return NextResponse.redirect(errorUrl.toString());
    }
  }

  // Handle implicit flow (token in hash fragment)
  const hash = request.url.includes('#') ? request.url.split('#')[1] : '';
  if (hash && hash.includes('access_token')) {
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      try {
        // Get user info with access token
        const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user information');
        }

        const userData = await userResponse.json();

        // Redirect back to app with user data
        const successUrl = new URL('/inflamm-ai', request.nextUrl);
        successUrl.searchParams.set('google_user', JSON.stringify(userData));
        
        return NextResponse.redirect(successUrl.toString());
      } catch (error) {
        console.error('Token processing error:', error);
        const errorUrl = new URL('/inflamm-ai', request.nextUrl);
        errorUrl.searchParams.set('error', 'Token processing failed');
        return NextResponse.redirect(errorUrl.toString());
      }
    }
  }

  // No code or token, redirect to home
  return NextResponse.redirect(new URL('/inflamm-ai', request.nextUrl).toString());
}
