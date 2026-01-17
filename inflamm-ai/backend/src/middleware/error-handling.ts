import { Request, Response, NextFunction } from 'express';
import { AppError, isAppError } from '../utils/errors';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error details
  console.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle custom application errors
  if (isAppError(error)) {
    switch (error.name) {
      case 'ValidationError':
        res.status(400).json({
          success: false,
          error: error.message,
          field: (error as any).field,
          timestamp: Date.now()
        });
        break;

      case 'AuthenticationError':
        res.status(401).json({
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
        break;

      case 'AuthorizationError':
        res.status(403).json({
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
        break;

      case 'NotFoundError':
        res.status(404).json({
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
        break;

      case 'ConflictError':
        res.status(409).json({
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
        break;

      case 'RateLimitError':
        res.status(429).json({
          success: false,
          error: error.message,
          retryAfter: (error as any).retryAfter,
          timestamp: Date.now()
        });
        break;

      case 'DatabaseError':
      case 'EncryptionError':
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: Date.now()
        });
        break;

      case 'ServiceUnavailableError':
        res.status(503).json({
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
        break;

      default:
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: Date.now()
        });
        break;
    }
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: Date.now()
  });
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function validateRequest<T>(schema: {
  [K in keyof T]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | string;
  };
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const errors: { field: string; message: string }[] = [];

      for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];
        const fieldRules = rules as any;

        // Check required fields
        if (fieldRules.required && (value === undefined || value === null)) {
          errors.push({ field, message: `${field} is required` });
          continue;
        }

        // Skip validation if field is not provided and not required
        if (value === undefined || value === null) {
          continue;
        }

        // Type validation
        if (fieldRules.type) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          if (actualType !== fieldRules.type) {
            errors.push({ field, message: `${field} must be of type ${fieldRules.type}` });
            continue;
          }
        }

        // String validation
        if (fieldRules.type === 'string') {
          if (fieldRules.min && value.length < fieldRules.min) {
            errors.push({ field, message: `${field} must be at least ${fieldRules.min} characters` });
          }
          if (fieldRules.max && value.length > fieldRules.max) {
            errors.push({ field, message: `${field} must be at most ${fieldRules.max} characters` });
          }
          if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
            errors.push({ field, message: `${field} format is invalid` });
          }
          if (fieldRules.enum && !fieldRules.enum.includes(value)) {
            errors.push({ field, message: `${field} must be one of: ${fieldRules.enum.join(', ')}` });
          }
        }

        // Number validation
        if (fieldRules.type === 'number') {
          if (fieldRules.min !== undefined && value < fieldRules.min) {
            errors.push({ field, message: `${field} must be at least ${fieldRules.min}` });
          }
          if (fieldRules.max !== undefined && value > fieldRules.max) {
            errors.push({ field, message: `${field} must be at most ${fieldRules.max}` });
          }
        }

        // Array validation
        if (fieldRules.type === 'array') {
          if (fieldRules.min && value.length < fieldRules.min) {
            errors.push({ field, message: `${field} must have at least ${fieldRules.min} items` });
          }
          if (fieldRules.max && value.length > fieldRules.max) {
            errors.push({ field, message: `${field} must have at most ${fieldRules.max} items` });
          }
        }

        // Custom validation
        if (fieldRules.custom) {
          const result = fieldRules.custom(value);
          if (result !== true) {
            errors.push({ field, message: typeof result === 'string' ? result : `${field} is invalid` });
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
          timestamp: Date.now()
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
