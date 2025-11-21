import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        wallet: string;
      };
      walletAddress?: string;
      sessionSignature?: string;
      sessionMessage?: string;
      signature?: string;
      message?: string;
    }
  }
}

export {};

