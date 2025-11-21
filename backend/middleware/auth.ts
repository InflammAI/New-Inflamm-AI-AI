import { Request, Response, NextFunction } from 'express';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        walletAddress: string;
      };
    }
  }
}

// Wallet verification middleware
export async function verifyWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const { walletAddress, sessionSignature, sessionMessage, signature, message } = req.body;
    const sig = sessionSignature || signature;
    const msg = sessionMessage || message;

    if (!walletAddress || !sig || !msg) {
      return res.status(401).json({ success: false, error: 'Missing authentication credentials' });
    }

    // Validate wallet address format
    try {
      new PublicKey(walletAddress);
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid wallet address format' });
    }

    // Verify signature
    try {
      const messageBytes = new TextEncoder().encode(msg);
      const signatureBytes = bs58.decode(sig);
      const publicKeyBytes = new PublicKey(walletAddress).toBytes();
      const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

      if (!verified) {
        return res.status(401).json({ success: false, error: 'Invalid signature' });
      }
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Signature verification failed' });
    }

    // Check message timestamp for normal signatures
    if (!sessionSignature && message) {
      try {
        const messageData = JSON.parse(msg);
        const timestamp = messageData.timestamp;
        const now = Date.now();

        if (!timestamp || Math.abs(now - timestamp) > 60000) {
          return res.status(401).json({ success: false, error: 'Message expired or invalid timestamp' });
        }
      } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid message format' });
      }
    }

    // Validate session signatures
    if (sessionSignature) {
      try {
        const messageData = JSON.parse(msg);
        if (!messageData.sessionId || messageData.walletAddress !== walletAddress) {
          return res.status(401).json({ success: false, error: 'Invalid session signature' });
        }
      } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid session message format' });
      }
    }

    req.user = { walletAddress };
    return next(); // ✅ Return to satisfy TS
  } catch (error) {
    console.error('Wallet verification error:', error);
    return res.status(500).json({ success: false, error: 'Authentication failed' }); // ✅ Return
  }
}

// Optional authentication (doesn't block)
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const { walletAddress } = req.query;

  if (walletAddress && typeof walletAddress === 'string') {
    try {
      new PublicKey(walletAddress);
      req.user = { walletAddress };
    } catch {
      // Invalid wallet, ignore
    }
  }

  return next(); // ✅ Ensure return
}
