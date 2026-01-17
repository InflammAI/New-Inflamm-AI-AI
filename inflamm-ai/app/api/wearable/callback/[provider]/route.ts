import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/wearable-integrations/oauth-service';
import { TokenStorage } from '@/lib/wearable-integrations/oauth-configs';

// Mock database for token storage (in production, use PostgreSQL)
const tokenStorage = new Map<string, TokenStorage>();

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/wearable?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/wearable?error=missing_parameters`
      );
    }

    // Verify state from cookie
    const storedState = request.cookies.get(`oauth_state_${provider}`)?.value;
    if (storedState !== state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/wearable?error=invalid_state`
      );
    }

    // Exchange code for tokens
    const tokenData = await OAuthService.exchangeCodeForToken(provider, code, state);

    // Store tokens securely and update connections
    const userId = 'current-user'; // Get from authentication
    const storageKey = `${userId}_${provider}`;
    tokenStorage.set(storageKey, tokenData);

    // Update connections list
    try {
      const connectionsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/wearable/connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider })
      });
    } catch (error) {
      console.error('Failed to update connections:', error);
    }

    // Clear state cookie
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/wearable?provider=${provider}&success=true`
    );
    
    response.cookies.delete(`oauth_state_${provider}`);

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/wearable?error=callback_failed`
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    const userId = 'current-user'; // Get from authentication
    const storageKey = `${userId}_${provider}`;
    
    const storedToken = tokenStorage.get(storageKey);
    if (!storedToken) {
      return NextResponse.json(
        { error: 'No stored token found' },
        { status: 404 }
      );
    }

    // Check if token needs refresh
    if (storedToken.expiresAt < new Date()) {
      const refreshedToken = await OAuthService.refreshAccessToken(
        provider,
        storedToken.refreshToken
      );
      tokenStorage.set(storageKey, refreshedToken);
      return NextResponse.json({ token: refreshedToken });
    }

    return NextResponse.json({ token: storedToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
