import type { Request, Response } from 'express';
type NextFunction = (err?: any) => void;

interface VytalSyncRequest extends Request {
  user?: {
    publicKey: string;
  };
  query: any;
  body: any;
}

import nacl from 'tweetnacl';
import { SignedRequest } from '../types/vytal-sync';

/**
 * Middleware to verify Ed25519 signatures for Vytal Sync API requests
 */
export async function verifyVytalSignature(req: VytalSyncRequest, res: Response, next: NextFunction) {
  try {
    const signedRequest: SignedRequest = req.body;

    // Check if this is a signed request
    if (!signedRequest || !signedRequest.signature || !signedRequest.publicKey || !signedRequest.data) {
      return res.status(401).json({ 
        success: false, 
        error: 'Missing signature, public key, or data in request body' 
      });
    }

    // Validate timestamp to prevent replay attacks (5 minute window)
    const maxAgeMs = 5 * 60 * 1000;
    if (!signedRequest.timestamp || !isValidTimestamp(signedRequest.timestamp, maxAgeMs)) {
      return res.status(401).json({ 
        success: false, 
        error: 'Request timestamp too old or missing' 
      });
    }

    // Verify the Ed25519 signature
    const isValidSignature = verifyEd25519Signature(signedRequest);
    if (!isValidSignature) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid signature' 
      });
    }

    // Attach public key to request for downstream use
    req.user = { publicKey: signedRequest.publicKey };
    return next();

  } catch (error) {
    console.error('Signature verification error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
}

/**
 * Middleware to verify public key from headers for operations that don't require signed requests
 */
export async function verifyPublicKey(req: VytalSyncRequest, res: Response, next: NextFunction) {
  try {
    const publicKey = req.headers['x-public-key'] as string;

    if (!publicKey) {
      return res.status(401).json({ 
        success: false, 
        error: 'Public key is required in X-Public-Key header' 
      });
    }

    // Validate public key format (should be base64 encoded)
    try {
      const decodedKey = Buffer.from(publicKey, 'base64');
      if (decodedKey.length !== 32) { // Ed25519 public keys are 32 bytes
        throw new Error('Invalid public key length');
      }
    } catch {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid public key format' 
      });
    }

    req.user = { publicKey };
    return next();

  } catch (error) {
    console.error('Public key verification error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
}

/**
 * Optional authentication middleware - attaches public key if present but doesn't require it
 */
export async function optionalVytalAuth(req: VytalSyncRequest, res: Response, next: NextFunction) {
  try {
    const publicKey = req.headers['x-public-key'] as string;

    if (publicKey) {
      try {
        const decodedKey = Buffer.from(publicKey, 'base64');
        if (decodedKey.length === 32) { // Valid Ed25519 public key
          req.user = { publicKey };
        }
      } catch {
        // Ignore invalid public key for optional auth
      }
    }

    return next();

  } catch (error) {
    console.error('Optional auth error:', error);
    return next(); // Don't block request for optional auth
  }
}

/**
 * Verify Ed25519 signature for a signed request
 */
function verifyEd25519Signature(signedRequest: SignedRequest): boolean {
  try {
    const message = Buffer.from(JSON.stringify(signedRequest.data));
    const signature = Buffer.from(signedRequest.signature, 'base64');
    const publicKey = Buffer.from(signedRequest.publicKey, 'base64');

    return nacl.sign.detached.verify(message, signature, publicKey);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Validate timestamp to prevent replay attacks
 */
function isValidTimestamp(timestamp: number, maxAgeMs: number): boolean {
  const now = Date.now();
  const age = Math.abs(now - timestamp);
  return age <= maxAgeMs;
}

/**
 * Rate limiting middleware for API endpoints
 */
export const rateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: VytalSyncRequest, res: Response, next: NextFunction) => {
    const clientKey = req.user?.publicKey || req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, data] of requests.entries()) {
      if (data.resetTime < windowStart) {
        requests.delete(key);
      }
    }

    // Check current request count
    const current = requests.get(clientKey);
    if (!current || current.resetTime < windowStart) {
      requests.set(clientKey, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      });
    }
    
    current.count++;
    return next();
  };
};
