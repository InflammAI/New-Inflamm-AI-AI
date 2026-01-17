import { NextRequest, NextResponse } from 'next/server';

// Mock database for connections (in production, use PostgreSQL)
const userConnections = new Map<string, string[]>(); // userId -> providers[]

export async function GET(request: NextRequest) {
  try {
    const userId = 'current-user'; // Get from authentication
    
    const connections = userConnections.get(userId) || [];
    
    return NextResponse.json(connections);
  } catch (error) {
    console.error('Failed to get connections:', error);
    return NextResponse.json(
      { error: 'Failed to get connections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json();
    const userId = 'current-user'; // Get from authentication
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    const connections = userConnections.get(userId) || [];
    
    if (!connections.includes(provider)) {
      connections.push(provider);
      userConnections.set(userId, connections);
    }

    return NextResponse.json({ 
      message: 'Connection added successfully',
      connections 
    });
  } catch (error) {
    console.error('Failed to add connection:', error);
    return NextResponse.json(
      { error: 'Failed to add connection' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { provider } = await request.json();
    const userId = 'current-user'; // Get from authentication
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    const connections = userConnections.get(userId) || [];
    const updatedConnections = connections.filter(p => p !== provider);
    userConnections.set(userId, updatedConnections);

    return NextResponse.json({ 
      message: 'Connection removed successfully',
      connections: updatedConnections 
    });
  } catch (error) {
    console.error('Failed to remove connection:', error);
    return NextResponse.json(
      { error: 'Failed to remove connection' },
      { status: 500 }
    );
  }
}
