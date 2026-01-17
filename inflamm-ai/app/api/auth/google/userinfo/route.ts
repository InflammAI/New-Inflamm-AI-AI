import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Fetch user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    
    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user information from Google' },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Userinfo API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
