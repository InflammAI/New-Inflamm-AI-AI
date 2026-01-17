declare global {
    namespace Express {
        interface Request {
            user?: {
                walletAddress: string;
            };
        }
    }
}
export declare function verifyWallet(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<any>;
//# sourceMappingURL=auth.d.ts.map