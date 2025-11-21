import { Address, Cell, beginCell, contractAddress, loadStateInit } from '@ton/core';
import { sha256_sync } from '@ton/crypto';
import nacl from 'tweetnacl';
import db from './db';

export interface TonVerifyResult {
  success: boolean;
  walletAddress?: string;
  error?: string;
}

export interface TonConnectProof {
  timestamp: number;
  domain: {
    lengthBytes: number;
    value: string;
  };
  signature: string;
  payload: string;
  state_init?: string;
}

export interface TonProofRequest {
  address: string;
  proof: TonConnectProof;
  publicKey?: string;
}

const PROOF_VALIDITY_SECONDS = 300;

export function isTonAddress(address: string): boolean {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
}

async function checkReplayProtection(nonce: string): Promise<{isReplay: boolean; error?: string}> {
  try {
    const result = await db.query(
      'SELECT id FROM ton_proof_nonces WHERE nonce = $1 AND expires_at > NOW()',
      [nonce]
    );
    return { isReplay: result.rows.length > 0 };
  } catch (error) {
    console.error('Replay check database error:', error);
    return { isReplay: false, error: 'Replay protection database unavailable' };
  }
}

async function storeNonce(nonce: string, expirySeconds: number): Promise<boolean> {
  try {
    await db.query(
      `INSERT INTO ton_proof_nonces (nonce, expires_at) 
       VALUES ($1, NOW() + INTERVAL '${expirySeconds} seconds')
       ON CONFLICT (nonce) DO NOTHING`,
      [nonce]
    );
    return true;
  } catch (error) {
    console.error('Failed to store nonce:', error);
    return false;
  }
}

function extractPublicKeyFromStateInit(stateInitBase64: string): Uint8Array | null {
  try {
    const stateInitCell = Cell.fromBase64(stateInitBase64);
    const stateInit = loadStateInit(stateInitCell.beginParse());
    
    if (!stateInit.data) {
      return null;
    }
    
    const dataSlice = stateInit.data.beginParse();
    
    dataSlice.loadUint(32);
    dataSlice.loadUint(32);
    
    const publicKeyBuffer = dataSlice.loadBuffer(32);
    return new Uint8Array(publicKeyBuffer);
  } catch (error) {
    console.error('Failed to extract public key from state_init:', error);
    return null;
  }
}

function verifyAddressFromStateInit(
  claimedAddress: string,
  stateInitBase64: string
): boolean {
  try {
    const stateInitCell = Cell.fromBase64(stateInitBase64);
    const stateInit = loadStateInit(stateInitCell.beginParse());
    
    if (!stateInit.code || !stateInit.data) {
      return false;
    }
    
    const parsedClaimed = Address.parse(claimedAddress);
    
    const derivedAddress = contractAddress(parsedClaimed.workChain, {
      code: stateInit.code,
      data: stateInit.data
    });
    
    return derivedAddress.equals(parsedClaimed);
  } catch (error) {
    console.error('Address verification from state_init failed:', error);
    return false;
  }
}

export async function verifyTonProof(
  proofRequest: TonProofRequest,
  expectedDomain: string
): Promise<TonVerifyResult> {
  try {
    const { address, proof } = proofRequest;
    
    const parsedAddress = Address.parse(address);
    
    if (proof.domain.value !== expectedDomain) {
      return { 
        success: false, 
        error: `Invalid domain. Expected ${expectedDomain}, got ${proof.domain.value}` 
      };
    }
    
    const now = Math.floor(Date.now() / 1000);
    const proofAge = now - proof.timestamp;
    
    if (Math.abs(proofAge) > PROOF_VALIDITY_SECONDS) {
      return { 
        success: false, 
        error: `Proof expired. Age: ${proofAge}s, max: ${PROOF_VALIDITY_SECONDS}s` 
      };
    }
    
    const nonceKey = `${address}-${proof.payload}-${proof.timestamp}`;
    const replayCheck = await checkReplayProtection(nonceKey);
    
    if (replayCheck.error) {
      return { 
        success: false, 
        error: replayCheck.error
      };
    }
    
    if (replayCheck.isReplay) {
      return { 
        success: false, 
        error: 'Proof replay detected. This proof has already been used.' 
      };
    }
    
    if (!proof.state_init) {
      return { 
        success: false, 
        error: 'state_init is required for secure verification' 
      };
    }
    
    const addressMatches = verifyAddressFromStateInit(address, proof.state_init);
    if (!addressMatches) {
      return { 
        success: false, 
        error: 'Address does not match state_init. Possible impersonation attempt.' 
      };
    }
    
    const publicKeyBytes = extractPublicKeyFromStateInit(proof.state_init);
    if (!publicKeyBytes) {
      return { success: false, error: 'Failed to extract public key from state_init' };
    }
    
    const wc = Buffer.alloc(4);
    wc.writeInt32LE(parsedAddress.workChain);
    
    const ts = Buffer.alloc(8);
    ts.writeBigUInt64LE(BigInt(proof.timestamp));
    
    const dl = Buffer.alloc(4);
    dl.writeUInt32LE(proof.domain.lengthBytes);
    
    let payloadBytes: Buffer;
    try {
      payloadBytes = Buffer.from(proof.payload, 'base64');
    } catch {
      payloadBytes = Buffer.from(proof.payload, 'hex');
    }
    
    const message = Buffer.concat([
      Buffer.from('ton-proof-item-v2/'),
      wc,
      Buffer.from(parsedAddress.hash),
      dl,
      Buffer.from(proof.domain.value),
      ts,
      payloadBytes
    ]);
    
    const messageHash = sha256_sync(message);
    
    const fullMessage = Buffer.concat([
      Buffer.from([0xff, 0xff]),
      Buffer.from('ton-connect'),
      messageHash
    ]);
    
    const signatureHash = sha256_sync(fullMessage);
    
    let signatureBytes: Uint8Array;
    try {
      signatureBytes = Buffer.from(proof.signature, 'base64');
    } catch (error) {
      try {
        signatureBytes = Buffer.from(proof.signature, 'hex');
      } catch {
        return { success: false, error: 'Invalid signature encoding' };
      }
    }
    
    if (signatureBytes.length !== 64) {
      return { success: false, error: 'Invalid signature length (must be 64 bytes)' };
    }
    
    const verified = nacl.sign.detached.verify(
      signatureHash,
      signatureBytes,
      publicKeyBytes
    );
    
    if (!verified) {
      return { success: false, error: 'Invalid signature' };
    }
    
    const nonceStored = await storeNonce(nonceKey, PROOF_VALIDITY_SECONDS);
    if (!nonceStored) {
      return { 
        success: false, 
        error: 'Failed to store nonce. Replay protection unavailable.' 
      };
    }
    
    return { 
      success: true, 
      walletAddress: parsedAddress.toString({ bounceable: false, testOnly: false })
    };
  } catch (error) {
    console.error('TON proof verification error:', error);
    return { success: false, error: 'TON proof verification failed' };
  }
}

export async function verifyTonSignature(
  walletAddress: string,
  signature: string,
  message: string,
  publicKey?: string
): Promise<TonVerifyResult> {
  return { 
    success: false, 
    error: 'Legacy TON signature verification deprecated. Use verifyTonProof with full TonConnect proof payload.' 
  };
}
