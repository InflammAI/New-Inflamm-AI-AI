import type { Request, Response } from 'express';
type NextFunction = (err?: any) => void;

interface AuthRequest extends Request {
  user?: {
    walletAddress: string;
  };
  query: any;
  body: any;
}
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

export async function verifyWallet(req: AuthRequest, res: any, next: NextFunction) {
  try {
    const body = req.body as Record<string, any> | undefined;
    const { walletAddress, sessionSignature, sessionMessage, signature, message } = body ?? {};
    const sig = sessionSignature || signature;
    const msg = sessionMessage || message;

    if (!walletAddress || !sig || !msg) {
      return res.status(401).json({ success: false, error: 'Missing authentication credentials' });
    }

    try {
      new PublicKey(walletAddress);
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid wallet address format' });
    }

    try {
      const messageBytes = new TextEncoder().encode(msg as string);
      const signatureBytes = bs58.decode(sig as string);
      const publicKeyBytes = new PublicKey(walletAddress).toBytes();
      const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

      if (!verified) {
        return res.status(401).json({ success: false, error: 'Invalid signature' });
      }
    } catch {
      return res.status(401).json({ success: false, error: 'Signature verification failed' });
    }

    if (!sessionSignature && message) {
      try {
        const messageData = JSON.parse(msg as string);
        const timestamp = messageData.timestamp;
        const now = Date.now();

        if (!timestamp || Math.abs(now - timestamp) > 60000) {
          return res.status(401).json({ success: false, error: 'Message expired or invalid timestamp' });
        }
      } catch {
        return res.status(401).json({ success: false, error: 'Invalid message format' });
      }
    }

    if (sessionSignature) {
      try {
        const messageData = JSON.parse(msg as string);
        if (!messageData.sessionId || messageData.walletAddress !== walletAddress) {
          return res.status(401).json({ success: false, error: 'Invalid session signature' });
        }
      } catch {
        return res.status(401).json({ success: false, error: 'Invalid session message format' });
      }
    }

    req.user = { walletAddress };
    return next();
  } catch (error) {
    console.error('Wallet verification error:', error);
    return res.status(500).json({ success: false, error: 'Authentication failed' });
  }
}

export async function optionalAuth(req: AuthRequest, res: any, next: NextFunction) {
  const query = req.query as Record<string, any>;
  const walletAddress = typeof query.walletAddress === 'string' ? query.walletAddress : undefined;

  if (walletAddress) {
    try {
      new PublicKey(walletAddress);
      req.user = { walletAddress };
    } catch {
      // ignore invalid
    }
  }

  return next();
}
