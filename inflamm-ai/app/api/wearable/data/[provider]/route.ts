import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/wearable-integrations/oauth-service';
import { TokenStorage } from '@/lib/wearable-integrations/oauth-configs';

// Mock database for token storage
const tokenStorage = new Map<string, TokenStorage>();

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const userId = 'current-user'; // Get from authentication

    const storageKey = `${userId}_${provider}`;
    const storedToken = tokenStorage.get(storageKey);

    if (!storedToken) {
      return NextResponse.json(
        { error: 'No connection found for this provider' },
        { status: 404 }
      );
    }

    // Check if token needs refresh
    let tokenData = storedToken;
    if (tokenData.expiresAt < new Date()) {
      try {
        tokenData = await OAuthService.refreshAccessToken(
          provider,
          tokenData.refreshToken
        );
        tokenStorage.set(storageKey, tokenData);
      } catch (refreshError) {
        return NextResponse.json(
          { error: 'Token refresh failed, please reconnect' },
          { status: 401 }
        );
      }
    }

    // Fetch wearable data
    const wearableData = await OAuthService.fetchWearableData(
      provider,
      tokenData.accessToken,
      date
    );

    return NextResponse.json(wearableData);
  } catch (error) {
    console.error('Data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wearable data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    const userId = 'current-user'; // Get from authentication
    const storageKey = `${userId}_${provider}`;

    tokenStorage.delete(storageKey);

    // Update connections list
    try {
      const connectionsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/wearable/connections`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider })
      });
    } catch (error) {
      console.error('Failed to update connections:', error);
    }

    return NextResponse.json({ message: 'Connection removed successfully' });
  } catch (error) {
    console.error('Disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect provider' },
      { status: 500 }
    );
  }
}
