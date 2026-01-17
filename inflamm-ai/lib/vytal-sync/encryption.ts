import * as tweetnacl from 'tweetnacl';
import { createHash } from 'crypto';

export interface EncryptedData {
  data: string; // Base64 encoded encrypted data
  nonce: string; // Base64 encoded nonce
  keyId?: string;
}

export interface SignedRequest {
  data: EncryptedData;
  signature: string; // Base64 encoded signature
  publicKey: string; // Base64 encoded public key
  timestamp: number;
}

export class ClientSideEncryption {
  private keyPair: tweetnacl.BoxKeyPair;
  private serverPublicKey?: Uint8Array;

  constructor() {
    this.keyPair = tweetnacl.box.keyPair();
  }

  static generateKeyPair(): tweetnacl.BoxKeyPair {
    return tweetnacl.box.keyPair();
  }

  static fromPrivateKey(privateKey: string): ClientSideEncryption {
    const keyPair = tweetnacl.box.keyPair.fromSecretKey(
      Buffer.from(privateKey, 'base64')
    );
    const encryption = new ClientSideEncryption();
    encryption.keyPair = keyPair;
    return encryption;
  }

  setServerPublicKey(publicKey: string): void {
    this.serverPublicKey = Buffer.from(publicKey, 'base64');
  }

  getPublicKey(): string {
    return Buffer.from(this.keyPair.publicKey).toString('base64');
  }

  getPrivateKey(): string {
    return Buffer.from(this.keyPair.secretKey).toString('base64');
  }

  encrypt(data: any): EncryptedData {
    if (!this.serverPublicKey) {
      throw new Error('Server public key not set');
    }

    const message = Buffer.from(JSON.stringify(data));
    const nonce = tweetnacl.randomBytes(24);
    
    const encrypted = tweetnacl.box(
      message,
      nonce,
      this.serverPublicKey,
      this.keyPair.secretKey
    );

    if (!encrypted) {
      throw new Error('Encryption failed');
    }

    return {
      data: Buffer.from(encrypted).toString('base64'),
      nonce: Buffer.from(nonce).toString('base64'),
    };
  }

  signRequest(data: EncryptedData): SignedRequest {
    const message = Buffer.from(JSON.stringify(data));
    const signature = tweetnacl.sign.detached(message, this.keyPair.secretKey);

    return {
      data,
      signature: Buffer.from(signature).toString('base64'),
      publicKey: this.getPublicKey(),
      timestamp: Date.now(),
    };
  }

  static verifySignature(signedRequest: SignedRequest): boolean {
    try {
      const message = Buffer.from(JSON.stringify(signedRequest.data));
      const signature = Buffer.from(signedRequest.signature, 'base64');
      const publicKey = Buffer.from(signedRequest.publicKey, 'base64');

      return tweetnacl.sign.detached.verify(message, signature, publicKey);
    } catch (error) {
      return false;
    }
  }

  static generateKeyId(): string {
    return createHash('sha256').digest().toString('hex').substring(0, 16);
  }
}

export class ServerSideEncryption {
  private keyPair: tweetnacl.BoxKeyPair;

  constructor() {
    this.keyPair = tweetnacl.box.keyPair();
  }

  getPublicKey(): string {
    return Buffer.from(this.keyPair.publicKey).toString('base64');
  }

  decrypt(encryptedData: EncryptedData, clientPublicKey: string): any {
    const encrypted = Buffer.from(encryptedData.data, 'base64');
    const nonce = Buffer.from(encryptedData.nonce, 'base64');
    const publicKey = Buffer.from(clientPublicKey, 'base64');

    const decrypted = tweetnacl.box.open(
      encrypted,
      nonce,
      publicKey,
      this.keyPair.secretKey
    );

    if (!decrypted) {
      throw new Error('Decryption failed');
    }

    return JSON.parse(Buffer.from(decrypted).toString());
  }
}
