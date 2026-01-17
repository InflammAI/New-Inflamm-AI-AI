import { NextRequest, NextResponse } from 'next/server';
import { ServerSideEncryption, ClientSideEncryption } from '../../../lib/vytal-sync/encryption';
import { EncryptedDatabase } from '../../../lib/vytal-sync/encrypted-database';

const db = new EncryptedDatabase();
const serverEncryption = new ServerSideEncryption();

export async function POST(request: NextRequest) {
  try {
    const signedRequest = await request.json();

    // Verify the signature
    const isValidSignature = ClientSideEncryption.verifySignature(signedRequest);
    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Check timestamp to prevent replay attacks (5 minute window)
    const now = Date.now();
    const requestTime = signedRequest.timestamp;
    if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Request timestamp too old' },
        { status: 401 }
      );
    }

    // Decrypt the data
    const decryptedData = serverEncryption.decrypt(
      signedRequest.data,
      signedRequest.publicKey
    );

    // Store encrypted blob
    const recordId = await db.storeEncryptedBlob(
      signedRequest.data,
      signedRequest.publicKey,
      decryptedData.timestamp
    );

    // Enforce access rules
    await db.enforceAccessRules(recordId, signedRequest.publicKey);

    return NextResponse.json({ 
      success: true, 
      recordId,
      timestamp: now 
    });

  } catch (error) {
    console.error('Health data API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicKey = searchParams.get('publicKey');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!publicKey) {
      return NextResponse.json(
        { error: 'Public key required' },
        { status: 400 }
      );
    }

    // Verify access permissions
    const hasAccess = await db.checkAccessPermissions(publicKey);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Retrieve encrypted blobs
    const records = await db.getEncryptedBlobs(
      publicKey,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json({ 
      records,
      count: records.length 
    });

  } catch (error) {
    console.error('Health data retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
