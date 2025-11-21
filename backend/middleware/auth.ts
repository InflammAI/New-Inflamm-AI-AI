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
    // Support both session-based and traditional signature formats
    const { walletAddress, sessionSignature, sessionMessage, signature, message } = req.body;
    
    const sig = sessionSignature || signature;
    const msg = sessionMessage || message;

    if (!walletAddress || !sig || !msg) {
      return res.status(401).json({ 
        success: false, 
        error: 'Missing authentication credentials' 
      });
    }

    // Validate wallet address format
    try {
      new PublicKey(walletAddress);
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid wallet address format' 
      });
    }

    // Verify signature
    try {
      const messageBytes = new TextEncoder().encode(msg);
      const signatureBytes = bs58.decode(sig);
      const publicKeyBytes = new PublicKey(walletAddress).toBytes();

      const verified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!verified) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid signature' 
        });
      }
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        error: 'Signature verification failed' 
      });
    }

    // Check message timestamp only for non-session signatures
    if (!sessionSignature && message) {
      try {
        const messageData = JSON.parse(msg);
        const timestamp = messageData.timestamp;
        const now = Date.now();
        
        if (!timestamp || Math.abs(now - timestamp) > 60000) { // 1 minute window
          return res.status(401).json({ 
            success: false, 
            error: 'Message expired or invalid timestamp' 
          });
        }
      } catch (error) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid message format' 
        });
      }
    }
    
    // For session signatures, verify the message contains sessionId
    if (sessionSignature) {
      try {
        const messageData = JSON.parse(msg);
        if (!messageData.sessionId || messageData.walletAddress !== walletAddress) {
          return res.status(401).json({ 
            success: false, 
            error: 'Invalid session signature' 
          });
        }
      } catch (error) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid session message format' 
        });
      }
    }

    // Attach user to request
    req.user = { walletAddress };
    next();
  } catch (error) {
    console.error('Wallet verification error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
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
      // Invalid wallet, just continue without user
    }
  }
  
  next();
}
