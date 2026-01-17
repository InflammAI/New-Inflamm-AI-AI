# Vytal Sync Backend

This document describes the Vytal Sync backend implementation for secure health data synchronization.

## Architecture Overview

The Vytal Sync backend implements a zero-knowledge architecture for health data storage and synchronization:

```
Wearable Device
    ↓
OS Health API
    ↓
Vytal Sync App (Client-side Encryption & Signing)
    ↓
Zero-Knowledge API (Backend)
    ↓
Encrypted Database
```

## Components

### 1. Types (`src/types/vytal-sync.ts`)
Defines all TypeScript interfaces and types for the Vytal Sync system:
- `WearableData` - Health data structure
- `EncryptedData` - Encrypted blob format
- `SignedRequest` - Cryptographically signed requests
- `AccessRule` - Permission management
- `APIResponse` - Standardized API responses

### 2. Models (`src/models/vytal-sync.ts`)
Database layer for encrypted data storage:
- `VytalSyncModel` - PostgreSQL-based data access
- Encrypted blob storage with JSONB
- Access rule management
- Automatic cleanup of expired permissions

### 3. Services (`src/services/`)
Business logic and encryption services:

#### Encryption Service (`src/services/encryption.ts`)
- `ServerSideEncryption` - Server-side cryptographic operations
- `ClientSideEncryption` - Client-side encryption utilities
- Signature verification and timestamp validation
- NaCl-based encryption for zero-knowledge architecture

#### Vytal Sync Service (`src/services/vytal-sync.ts`)
- `VytalSyncService` - Core business logic
- Health data processing and validation
- Access control enforcement
- Metrics collection

### 4. Controllers (`src/controllers/vytal-sync.ts`)
HTTP request handlers:
- Health data CRUD operations
- Access control management
- Metrics and system status
- Error handling and response formatting

### 5. Middleware (`src/middleware/vytal-sync.ts`)
Request processing middleware:
- `validateSignedRequest` - Cryptographic signature validation
- `requirePublicKey` - Authentication header validation
- `rateLimiter` - Rate limiting by public key
- `validateHealthData` - Data structure validation

### 6. Routes (`src/routes/vytal-sync.ts`)
Express router configuration:
- `/api/vytal-sync/health-data` - Health data endpoints
- `/api/vytal-sync/server-public-key` - Server public key
- `/api/vytal-sync/grant-access` - Access control
- `/api/vytal-sync/metrics` - System metrics

## API Endpoints

### Health Data Management
- `POST /api/vytal-sync/health-data` - Store encrypted health data
- `GET /api/vytal-sync/health-data` - Retrieve encrypted health data
- `DELETE /api/vytal-sync/health-data/:recordId` - Delete health data

### Access Control
- `POST /api/vytal-sync/grant-access` - Grant access to health data
- `DELETE /api/vytal-sync/revoke-access/:recordId/:granteePublicKey` - Revoke access
- `GET /api/vytal-sync/access-rules/:recordId` - List access rules

### System
- `GET /api/vytal-sync/server-public-key` - Get server encryption public key
- `GET /api/vytal-sync/metrics` - System metrics
- `POST /api/vytal-sync/cleanup` - Cleanup expired access rules

## Security Features

### Zero-Knowledge Architecture
- All health data is encrypted client-side before transmission
- Server stores only encrypted blobs without decryption capability
- Access control enforced at database level

### Cryptographic Security
- NaCl-based public-key encryption
- Digital signatures for request authentication
- Timestamp validation to prevent replay attacks
- Automatic key rotation support

### Access Control
- Granular permissions (read/write/delete)
- Time-limited access grants
- Owner-controlled data sharing
- Automatic cleanup of expired permissions

## Database Schema

### Encrypted Blobs Table
```sql
CREATE TABLE encrypted_blobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encrypted_data JSONB NOT NULL,
    public_key TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Access Rules Table
```sql
CREATE TABLE access_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID REFERENCES encrypted_blobs(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL,
    permissions TEXT[] NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage Examples

### Store Health Data
```javascript
const signedRequest = {
  data: {
    data: "base64-encoded-encrypted-data",
    nonce: "base64-encoded-nonce"
  },
  signature: "base64-signature",
  publicKey: "base64-public-key",
  timestamp: Date.now()
};

fetch('/api/vytal-sync/health-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(signedRequest)
});
```

### Grant Access
```javascript
fetch('/api/vytal-sync/grant-access', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Public-Key': 'owner-public-key'
  },
  body: JSON.stringify({
    recordId: 'record-uuid',
    granteePublicKey: 'provider-public-key',
    permissions: ['read'],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })
});
```

## Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)

### Database Setup
```bash
# Initialize database tables
npm run dev
# The VytalSyncModel.initialize() method will create required tables
```

## Development

### Running the Backend
```bash
cd backend
npm install
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## Monitoring

### Metrics Available
- Total encrypted records
- Total access rules
- Expired access rules
- System performance metrics

### Health Checks
- `/` - Basic health check
- `/api/vytal-sync/metrics` - Detailed system metrics

## Security Considerations

1. **Client-Side Encryption**: All sensitive health data must be encrypted before transmission
2. **Signature Verification**: Every request must be cryptographically signed
3. **Timestamp Validation**: Requests older than 5 minutes are rejected
4. **Access Control**: All data access is controlled through permission system
5. **Rate Limiting**: Prevents abuse through request rate limiting
6. **Data Validation**: All incoming data is validated before storage

## Integration

The Vytal Sync backend is designed to integrate with:
- Wearable device APIs (Apple Health, Google Fit, etc.)
- Healthcare provider systems
- Analytics platforms (with proper consent)
- Mobile applications using the Vytal Sync SDK

## Troubleshooting

### Common Issues
1. **Invalid Signature**: Check client-side encryption implementation
2. **Timestamp Too Old**: Ensure client system time is synchronized
3. **Access Denied**: Verify public key and permissions
4. **Database Connection**: Check DATABASE_URL configuration

### Debug Mode
Set `NODE_ENV=development` for enhanced logging and error details.
