import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import { NextRequest } from 'next/server';
import { isTonAddress, verifyTonProof, TonProofRequest } from './ton-auth';

export interface VerifyResult {
  success: boolean;
  walletAddress?: string;
  walletType?: 'solana' | 'ton';
  error?: string;
}

export async function verifyWalletSignature(
  walletAddress: string,
  signature: string,
  message: string,
  isSessionSignature: boolean = false,
  publicKey?: string,
  tonProof?: TonProofRequest
): Promise<VerifyResult> {
  try {
    // CRITICAL: Proof-first validation - determine wallet type from proof structure, not address format
    // This prevents clients from spoofing wallet type by manipulating address format
    
    // Check if TON proof is provided (indicates TON wallet)
    if (tonProof) {
      const expectedDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'app.inflammai.com';
      const tonResult = await verifyTonProof(tonProof, expectedDomain);
      
      if (!tonResult.success) {
        return { success: false, error: tonResult.error };
      }

      // CRITICAL: Verify the proof-derived address matches the client-claimed address
      if (tonResult.walletAddress !== walletAddress) {
        return { 
          success: false, 
          error: `Address mismatch: TON proof verifies ${tonResult.walletAddress} but client claims ${walletAddress}` 
        };
      }

      return { success: true, walletAddress: tonResult.walletAddress, walletType: 'ton' };
    }
    
    // Check if Solana proof is provided (signature + message)
    if (signature && message) {
      // Validate wallet address format
      try {
        new PublicKey(walletAddress);
      } catch (error) {
        return { success: false, error: 'Invalid Solana wallet address format' };
      }

      // Verify signature
      try {
        const messageBytes = new TextEncoder().encode(message);
        const signatureBytes = bs58.decode(signature);
        const publicKeyBytes = new PublicKey(walletAddress).toBytes();

        const verified = nacl.sign.detached.verify(
          messageBytes,
          signatureBytes,
          publicKeyBytes
        );

        if (!verified) {
          return { success: false, error: 'Invalid Solana signature' };
        }
      } catch (error) {
        return { success: false, error: 'Solana signature verification failed' };
      }

      // Check message timestamp only for non-session signatures
      if (!isSessionSignature) {
        try {
          const messageData = JSON.parse(message);
          const timestamp = messageData.timestamp;
          const now = Date.now();
          
          if (!timestamp || Math.abs(now - timestamp) > 60000) { // 1 minute window
            return { success: false, error: 'Message expired or invalid timestamp' };
          }
        } catch (error) {
          return { success: false, error: 'Invalid message format' };
        }
      }
      
      // For session signatures, verify the message contains sessionId
      if (isSessionSignature) {
        try {
          const messageData = JSON.parse(message);
          if (!messageData.sessionId || messageData.walletAddress !== walletAddress) {
            return { success: false, error: 'Invalid session signature' };
          }
        } catch (error) {
          return { success: false, error: 'Invalid session message format' };
        }
      }

      return { success: true, walletAddress, walletType: 'solana' };
    }
    
    // No valid proof provided
    return { 
      success: false, 
      error: 'No valid proof provided. Must provide either tonProof (for TON) or signature+message (for Solana)' 
    };
  } catch (error) {
    console.error('Wallet verification error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function verifyRequest(req: NextRequest): Promise<VerifyResult> {
  try {
    const body = await req.json();
    const { walletAddress, sessionSignature, sessionMessage, signature, message, publicKey, tonProof } = body;
    
    if (!walletAddress) {
      return { success: false, error: 'Missing wallet address' };
    }

    // Check if we have valid proof (either TON proof OR Solana signature)
    const hasTonProof = !!tonProof;
    const hasSolanaProof = !!(sessionSignature || signature) && !!(sessionMessage || message);

    if (!hasTonProof && !hasSolanaProof) {
      return { success: false, error: 'Missing authentication credentials. Provide either tonProof or signature+message' };
    }

    const sig = sessionSignature || signature || '';
    const msg = sessionMessage || message || '';

    return await verifyWalletSignature(walletAddress, sig, msg, !!sessionSignature, publicKey, tonProof);
  } catch (error) {
    return { success: false, error: 'Failed to parse request' };
  }
}
