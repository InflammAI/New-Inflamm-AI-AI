import { Request, Response, NextFunction } from 'express';
import { ServerSideEncryption } from '../services/encryption';
import { SignedRequest } from '../types/vytal-sync';

// Extend Express Request type to include query parameters
interface ExpressRequest extends Request {
  query: any;
  params: any;
  body: any;
  headers: any;
  ip?: string;
}

export interface AuthenticatedRequest extends ExpressRequest {
  publicKey?: string;
}

export const validateSignedRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const signedRequest: SignedRequest = req.body as SignedRequest;

    if (!signedRequest || !signedRequest.data || !signedRequest.signature || !signedRequest.publicKey) {
      res.status(400).json({
        success: false,
        error: 'Invalid signed request format',
        timestamp: Date.now(),
      });
      return;
    }

    // Verify signature
    const isValidSignature = ServerSideEncryption.verifySignature(signedRequest);
    if (!isValidSignature) {
      res.status(401).json({
        success: false,
        error: 'Invalid signature',
        timestamp: Date.now(),
      });
      return;
    }

    // Validate timestamp
    const isValidTimestamp = ServerSideEncryption.validateTimestamp(signedRequest.timestamp);
    if (!isValidTimestamp) {
      res.status(401).json({
        success: false,
        error: 'Request timestamp too old',
        timestamp: Date.now(),
      });
      return;
    }

    // Attach public key to request for downstream use
    req.publicKey = signedRequest.publicKey;
    next();
  } catch (error) {
    console.error('Signed request validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      timestamp: Date.now(),
    });
  }
};

export const requirePublicKey = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const publicKey = req.headers['x-public-key'] as string;

  if (!publicKey) {
    res.status(400).json({
      success: false,
      error: 'Public key is required in X-Public-Key header',
      timestamp: Date.now(),
    });
    return;
  }

  req.publicKey = publicKey;
  next();
};

export const rateLimiter = (
  maxRequests: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const publicKey = req.publicKey || (req.ip || 'unknown');
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key);
      }
    }

    // Check current requests
    const current = requests.get(publicKey);
    if (current && current.count >= maxRequests && current.resetTime > windowStart) {
      res.status(429).json({
        success: false,
        error: 'Too many requests',
        timestamp: Date.now(),
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      });
      return;
    }

    // Update counter
    if (current) {
      current.count++;
    } else {
      requests.set(publicKey, {
        count: 1,
        resetTime: now + windowMs,
      });
    }

    next();
  };
};

export const validateHealthData = (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const data = req.body as any;

    if (!data || typeof data !== 'object') {
      res.status(400).json({
        success: false,
        error: 'Invalid data format',
        timestamp: Date.now(),
      });
      return;
    }

    // Check required fields
    if (!data.id || typeof data.id !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Data ID is required and must be a string',
        timestamp: Date.now(),
      });
      return;
    }

    if (!data.timestamp || typeof data.timestamp !== 'number') {
      res.status(400).json({
        success: false,
        error: 'Timestamp is required and must be a number',
        timestamp: Date.now(),
      });
      return;
    }

    // Validate optional numeric fields
    const numericFields = ['heartRate', 'steps', 'calories', 'bloodOxygen', 'stressLevel'];
    for (const field of numericFields) {
      if (data[field] !== undefined && (typeof data[field] !== 'number' || data[field] < 0)) {
        res.status(400).json({
          success: false,
          error: `${field} must be a positive number if provided`,
          timestamp: Date.now(),
        });
        return;
      }
    }

    // Validate specific ranges
    if (data.bloodOxygen !== undefined && (data.bloodOxygen < 0 || data.bloodOxygen > 100)) {
      res.status(400).json({
        success: false,
        error: 'Blood oxygen must be between 0 and 100',
        timestamp: Date.now(),
      });
      return;
    }

    if (data.stressLevel !== undefined && (data.stressLevel < 0 || data.stressLevel > 10)) {
      res.status(400).json({
        success: false,
        error: 'Stress level must be between 0 and 10',
        timestamp: Date.now(),
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Health data validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      timestamp: Date.now(),
    });
  }
};
