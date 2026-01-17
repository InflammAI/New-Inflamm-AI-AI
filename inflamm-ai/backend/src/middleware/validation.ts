import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export function validateHealthData(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, signature, publicKey, timestamp } = req.body;

    if (!data) {
      throw new ValidationError('Data is required', 'data');
    }

    if (!signature) {
      throw new ValidationError('Signature is required', 'signature');
    }

    if (!publicKey) {
      throw new ValidationError('Public key is required', 'publicKey');
    }

    if (!timestamp) {
      throw new ValidationError('Timestamp is required', 'timestamp');
    }

    if (typeof data !== 'object' || !data.data || !data.nonce) {
      throw new ValidationError('Invalid encrypted data format', 'data');
    }

    if (typeof signature !== 'string') {
      throw new ValidationError('Signature must be a string', 'signature');
    }

    if (typeof publicKey !== 'string') {
      throw new ValidationError('Public key must be a string', 'publicKey');
    }

    if (typeof timestamp !== 'number') {
      throw new ValidationError('Timestamp must be a number', 'timestamp');
    }

    // Validate timestamp is within acceptable range (5 minutes)
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    if (Math.abs(now - timestamp) > maxAge) {
      throw new ValidationError('Timestamp is too old or too far in the future', 'timestamp');
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateAccessGrantRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { recordId, granteePublicKey, permissions, expiresAt } = req.body;

    if (!recordId) {
      throw new ValidationError('Record ID is required', 'recordId');
    }

    if (!granteePublicKey) {
      throw new ValidationError('Grantee public key is required', 'granteePublicKey');
    }

    if (!permissions || !Array.isArray(permissions)) {
      throw new ValidationError('Permissions array is required', 'permissions');
    }

    // Validate permissions
    const validPermissions = ['read', 'write', 'delete'];
    for (const permission of permissions) {
      if (!validPermissions.includes(permission)) {
        throw new ValidationError(`Invalid permission: ${permission}`, 'permissions');
      }
    }

    // Validate expiration date if provided
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) {
        throw new ValidationError('Invalid expiration date format', 'expiresAt');
      }
      if (expiryDate <= new Date()) {
        throw new ValidationError('Expiration date must be in the future', 'expiresAt');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateHealthDataQuery(req: Request, res: Response, next: NextFunction) {
  try {
    const { publicKey, startDate, endDate, limit, offset } = req.query;

    if (!publicKey) {
      throw new ValidationError('Public key is required', 'publicKey');
    }

    if (typeof publicKey !== 'string') {
      throw new ValidationError('Public key must be a string', 'publicKey');
    }

    // Validate date range if provided
    if (startDate) {
      const start = new Date(startDate as string);
      if (isNaN(start.getTime())) {
        throw new ValidationError('Invalid start date format', 'startDate');
      }
    }

    if (endDate) {
      const end = new Date(endDate as string);
      if (isNaN(end.getTime())) {
        throw new ValidationError('Invalid end date format', 'endDate');
      }
    }

    // Validate pagination
    if (limit) {
      const limitNum = Number(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
        throw new ValidationError('Limit must be between 1 and 1000', 'limit');
      }
    }

    if (offset) {
      const offsetNum = Number(offset);
      if (isNaN(offsetNum) || offsetNum < 0) {
        throw new ValidationError('Offset must be a non-negative number', 'offset');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validatePublicKeyHeader(req: Request, res: Response, next: NextFunction) {
  try {
    const publicKey = req.headers['x-public-key'] as string;

    if (!publicKey) {
      throw new ValidationError('Public key is required in X-Public-Key header');
    }

    if (typeof publicKey !== 'string') {
      throw new ValidationError('Public key must be a string');
    }

    // Validate base64 format
    try {
      const decoded = Buffer.from(publicKey, 'base64');
      if (decoded.length !== 32) {
        throw new ValidationError('Public key must be 32 bytes when decoded');
      }
    } catch {
      throw new ValidationError('Public key must be valid base64');
    }

    next();
  } catch (error) {
    next(error);
  }
}
