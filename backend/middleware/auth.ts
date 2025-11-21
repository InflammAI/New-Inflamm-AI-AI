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

export async function verifyWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const { walletAddress, sessionSignature, sessionMessage, signature, message } = req.body;

    const sig = sessionSignature || signature;
    const msg = sessionMessage || message;

    if (!walletAddress || !sig || !msg) {
      return res.status(401).json({ success: false, error: 'Missing authentication credentials' });
    }

    try {
      new PublicKey(walletAddress);
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid wallet address format' });
    }

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

    // Attach user to request and return next
    req.user = { walletAddress };
    return next(); // ✅ Return ensures TS sees a value
  } catch (error) {
    console.error('Wallet verification error:', error);
    return res.status(500).json({ success: false, error: 'Authentication failed' }); // ✅ Return here too
  }
}

// Optional auth - doesn't block if no auth provided
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const { walletAddress } = req.query;

  if (walletAddress && typeof walletAddress === 'string') {
    try {
      new PublicKey(walletAddress);
      req.user = { walletAddress };
    } catch (error) {
      // Invalid wallet, just continue
    }
  }

  return next(); // ✅ Ensure return
}
