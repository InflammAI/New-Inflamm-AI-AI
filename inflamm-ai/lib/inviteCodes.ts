// Invite code management system

export interface InviteCode {
  code: string;
  uses: number;
  maxUses?: number;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
}

// In production, these should be stored in a database
// For now, we'll use environment variables for security
const VALID_CODES = {
  // Updated invite codes for 2026
  'INFLAMM2026': { maxUses: 100, expiresAt: new Date('2026-12-31') },
  'BETA2026': { maxUses: 25, expiresAt: new Date('2026-12-31') },
  'EARLYACCESS': { maxUses: 50, expiresAt: new Date('2026-12-31') },
  // Add your custom codes here
};

export function validateInviteCode(code: string): { valid: boolean; message?: string } {
  if (!code || code.trim() === '') {
    return { valid: false, message: 'Please enter an access code' };
  }

  const normalizedCode = code.toUpperCase().trim();
  const codeConfig = VALID_CODES[normalizedCode as keyof typeof VALID_CODES];

  if (!codeConfig) {
    return { valid: false, message: 'Invalid access code' };
  }

  // Check expiration
  if (codeConfig.expiresAt && new Date() > codeConfig.expiresAt) {
    return { valid: false, message: 'Access code has expired' };
  }

  // In production, you'd check usage count against database
  // For now, we'll just validate the code exists

  return { valid: true };
}

export function generateInviteCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// For admin panel - create new codes
export function createInviteCode(options: {
  maxUses?: number;
  expiresAt?: Date;
  createdBy: string;
}): InviteCode {
  return {
    code: generateInviteCode(),
    uses: 0, // Initialize with 0 uses
    maxUses: options.maxUses,
    expiresAt: options.expiresAt,
    createdBy: options.createdBy,
    createdAt: new Date(),
  };
}
