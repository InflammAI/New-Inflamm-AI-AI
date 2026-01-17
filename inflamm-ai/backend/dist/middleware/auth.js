"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWallet = verifyWallet;
exports.optionalAuth = optionalAuth;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
async function verifyWallet(req, res, next) {
    try {
        const body = req.body;
        const { walletAddress, sessionSignature, sessionMessage, signature, message } = body ?? {};
        const sig = sessionSignature || signature;
        const msg = sessionMessage || message;
        if (!walletAddress || !sig || !msg) {
            return res.status(401).json({ success: false, error: 'Missing authentication credentials' });
        }
        try {
            new web3_js_1.PublicKey(walletAddress);
        }
        catch {
            return res.status(401).json({ success: false, error: 'Invalid wallet address format' });
        }
        try {
            const messageBytes = new TextEncoder().encode(msg);
            const signatureBytes = bs58_1.default.decode(sig);
            const publicKeyBytes = new web3_js_1.PublicKey(walletAddress).toBytes();
            const verified = tweetnacl_1.default.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
            if (!verified) {
                return res.status(401).json({ success: false, error: 'Invalid signature' });
            }
        }
        catch {
            return res.status(401).json({ success: false, error: 'Signature verification failed' });
        }
        if (!sessionSignature && message) {
            try {
                const messageData = JSON.parse(msg);
                const timestamp = messageData.timestamp;
                const now = Date.now();
                if (!timestamp || Math.abs(now - timestamp) > 60000) {
                    return res.status(401).json({ success: false, error: 'Message expired or invalid timestamp' });
                }
            }
            catch {
                return res.status(401).json({ success: false, error: 'Invalid message format' });
            }
        }
        if (sessionSignature) {
            try {
                const messageData = JSON.parse(msg);
                if (!messageData.sessionId || messageData.walletAddress !== walletAddress) {
                    return res.status(401).json({ success: false, error: 'Invalid session signature' });
                }
            }
            catch {
                return res.status(401).json({ success: false, error: 'Invalid session message format' });
            }
        }
        req.user = { walletAddress };
        return next();
    }
    catch (error) {
        console.error('Wallet verification error:', error);
        return res.status(500).json({ success: false, error: 'Authentication failed' });
    }
}
async function optionalAuth(req, res, next) {
    const query = req.query;
    const walletAddress = typeof query.walletAddress === 'string' ? query.walletAddress : undefined;
    if (walletAddress) {
        try {
            new web3_js_1.PublicKey(walletAddress);
            req.user = { walletAddress };
        }
        catch {
            // ignore invalid
        }
    }
    return next();
}
