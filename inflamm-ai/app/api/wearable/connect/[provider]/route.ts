import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/wearable-integrations/oauth-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    
    // Validate provider
    const supportedProviders = ['fitbit', 'googlefit', 'garmin', 'applehealth', 'oura'];
    if (!supportedProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Unsupported provider' },
        { status: 400 }
      );
    }

    const { url, state } = OAuthService.getAuthorizationUrl(provider);
    
    // Store state in session or database
    const response = NextResponse.json({ url, state });
    
    // Set state in cookie for verification
    response.cookies.set(`oauth_state_${provider}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300 // 5 minutes
    });

    return response;
  } catch (error) {
    console.error('OAuth connect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}
