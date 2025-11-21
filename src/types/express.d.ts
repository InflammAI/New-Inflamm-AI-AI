declare namespace Express {
  interface Request {
    user?: { walletAddress: string };
  }
}
