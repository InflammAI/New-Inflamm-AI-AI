import type { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        walletAddress: string;
      };
      query: any;
      body: any;
      params: any;
      headers: any;
      ip?: string;
    }
    
    interface Response {
      status: (code: number) => Response;
      json: (data: any) => Response;
    }
  }
}

export {};
