import type { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        walletAddress: string;
      };
      query: any;
      body: any;
    }
    
    interface Response {
      status: (code: number) => Response;
      json: (data: any) => Response;
    }
  }
}

export {};
