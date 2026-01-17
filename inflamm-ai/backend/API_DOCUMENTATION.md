# Vytal Sync Backend API Documentation

## Overview

The Vytal Sync backend provides a secure, encrypted API for storing and managing health data with Ed25519 signature-based authentication and end-to-end encryption.

## Architecture

- **API Framework**: Node.js with Express
- **Authentication**: Ed25519 cryptographic signatures
- **Database**: PostgreSQL with encrypted blob storage
- **Encryption**: NaCl (TweetNaCl) for client-server encryption
- **Real-time**: WebSocket connections for live data streaming

## Authentication

### Ed25519 Signature Verification

All write operations require Ed25519 signature verification:

```typescript
interface SignedRequest {
  data: EncryptedData;
  signature: string; // Base64 encoded signature
  publicKey: string; // Base64 encoded public key
  timestamp: number;
}
```

### Public Key Verification

Read operations and access control use public key verification via `X-Public-Key` header.

## API Endpoints

### Health Data Management

#### POST /api/vytal-sync/health-data
Store encrypted health data with signature verification.

**Request Body:**
```typescript
{
  "data": {
    "data": "base64_encrypted_data",
    "nonce": "base64_nonce"
  },
  "signature": "base64_signature",
  "publicKey": "base64_public_key",
  "timestamp": 1234567890
}
```

**Response:**
```typescript
{
  "success": true,
  "data": { "recordId": "uuid" },
  "timestamp": 1234567890
}
```

#### GET /api/vytal-sync/health-data
Retrieve encrypted health data for a public key.

**Headers:**
- `X-Public-Key`: Base64 encoded public key

**Query Parameters:**
- `publicKey`: Base64 encoded public key
- `startDate`: Optional start date (ISO string)
- `endDate`: Optional end date (ISO string)
- `limit`: Optional limit (default: 100)
- `offset`: Optional offset (default: 0)

**Response:**
```typescript
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "uuid",
        "encryptedData": { "data": "...", "nonce": "..." },
        "publicKey": "...",
        "timestamp": 1234567890,
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z"
      }
    ]
  },
  "timestamp": 1234567890
}
```

#### DELETE /api/vytal-sync/health-data/:recordId
Delete a health data record.

**Headers:**
- `X-Public-Key`: Base64 encoded public key

**Response:**
```typescript
{
  "success": true,
  "timestamp": 1234567890
}
```

### Server Public Key

#### GET /api/vytal-sync/server-public-key
Get the server's public key for encryption.

**Response:**
```typescript
{
  "success": true,
  "data": { "publicKey": "base64_public_key" },
  "timestamp": 1234567890
}
```

### Access Control

#### POST /api/vytal-sync/grant-access
Grant access permissions to another user.

**Headers:**
- `X-Public-Key`: Requestor's public key

**Request Body:**
```typescript
{
  "recordId": "uuid",
  "granteePublicKey": "base64_public_key",
  "permissions": ["read", "write", "delete"],
  "expiresAt": "2023-12-31T23:59:59Z" // Optional
}
```

**Response:**
```typescript
{
  "success": true,
  "data": { "ruleId": "uuid" },
  "timestamp": 1234567890
}
```

#### DELETE /api/vytal-sync/revoke-access/:recordId/:granteePublicKey
Revoke access permissions.

**Headers:**
- `X-Public-Key`: Requestor's public key

**Response:**
```typescript
{
  "success": true,
  "timestamp": 1234567890
}
```

#### GET /api/vytal-sync/access-rules/:recordId
Get access rules for a record.

**Headers:**
- `X-Public-Key`: Requestor's public key

**Response:**
```typescript
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "uuid",
        "recordId": "uuid",
        "publicKey": "base64_public_key",
        "permissions": ["read"],
        "expiresAt": "2023-12-31T23:59:59Z",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ]
  },
  "timestamp": 1234567890
}
```

### System Endpoints

#### GET /api/vytal-sync/metrics
Get system metrics.

**Headers:**
- `X-Public-Key`: Public key for authentication

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalRecords": 1000,
    "totalEncryptedBlobs": 1000,
    "totalAccessRules": 500,
    "expiredAccessRules": 10
  },
  "timestamp": 1234567890
}
```

#### POST /api/vytal-sync/cleanup
Clean up expired access rules.

**Headers:**
- `X-Public-Key`: Public key for authentication

**Response:**
```typescript
{
  "success": true,
  "data": { "cleanedRules": 5 },
  "timestamp": 1234567890
}
```

### Real-time Tracking

#### GET /api/vytal-sync/real-time/token
Get WebSocket authentication token.

**Headers:**
- `X-Public-Key`: Public key for authentication

**Response:**
```typescript
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "wsUrl": "ws://localhost:3001/ws/vytal-sync?token=jwt_token",
    "expiresIn": "24h"
  },
  "timestamp": 1234567890
}
```

#### GET /api/vytal-sync/real-time/metrics
Get real-time connection metrics.

**Headers:**
- `X-Public-Key`: Public key for authentication

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalConnections": 10,
    "subscriptions": 25,
    "bufferedData": 50
  },
  "timestamp": 1234567890
}
```

#### POST /api/vytal-sync/real-time/trigger-event
Trigger real-time events.

**Headers:**
- `X-Public-Key`: Public key for authentication

**Request Body:**
```typescript
{
  "eventType": "health_update",
  "publicKey": "base64_public_key",
  "data": { /* event data */ }
}
```

## WebSocket API

### Connection
Connect to: `ws://localhost:3001/ws/vytal-sync?token=jwt_token`

### Message Types

#### Subscribe
```typescript
{
  "type": "subscribe",
  "dataType": "health_data",
  "publicKey": "base64_public_key" // Optional, defaults to your own
}
```

#### Unsubscribe
```typescript
{
  "type": "unsubscribe",
  "dataType": "health_data",
  "publicKey": "base64_public_key"
}
```

#### Health Data
```typescript
{
  "type": "health_data",
  "data": {
    "id": "data_id",
    "timestamp": 1234567890,
    "heartRate": 75,
    "steps": 1000,
    "calories": 200,
    "bloodOxygen": 98,
    "stressLevel": 3,
    "activityType": "walking"
  }
}
```

#### Ping/Pong
```typescript
// Client sends:
{ "type": "ping" }

// Server responds:
{ "type": "pong", "timestamp": 1234567890 }
```

## Data Models

### Health Data Structure
```typescript
interface WearableData {
  id: string;
  timestamp: number;
  heartRate?: number;
  steps?: number;
  calories?: number;
  sleepData?: SleepData;
  activityData?: ActivityData;
  bloodOxygen?: number;
  stressLevel?: number;
}
```

### Sleep Data
```typescript
interface SleepData {
  duration: number;
  quality: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
}
```

### Activity Data
```typescript
interface ActivityData {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
}
```

## Security

### Encryption
- All health data is encrypted client-side before transmission
- Server uses NaCl box encryption for secure communication
- Ed25519 signatures verify data integrity and authenticity

### Access Control
- Fine-grained permissions: read, write, delete
- Time-limited access rules with expiration
- Owner retains full control over their data

### Rate Limiting
- 100 requests per minute per public key
- WebSocket connection limits
- Automatic cleanup of inactive connections

## Error Handling

All API responses follow this structure:
```typescript
{
  "success": boolean,
  "data?: T,
  "error?: string,
  "timestamp": number
}
```

Common error codes:
- 400: Bad Request (invalid data, missing fields)
- 401: Unauthorized (invalid signature, missing public key)
- 403: Forbidden (insufficient permissions)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Deployment

### Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@host:port/database
JWT_SECRET=your_jwt_secret_key
PORT=3001
NODE_ENV=production
```

### Database Setup
The application automatically creates required tables on startup:
- `encrypted_blobs`: Stores encrypted health data
- `access_rules`: Manages access permissions

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Development

### Installation
```bash
npm install
npm run build
npm run dev
```

### Testing
```bash
npm test
```

### Database Migrations
The application handles schema creation automatically. For manual updates:
```sql
-- View current schema
\dt encrypted_blobs
\dt access_rules
```

## Monitoring

### Health Check
```bash
curl http://localhost:3001/
```

### Metrics
```bash
curl -H "X-Public-Key: your_public_key" \
     http://localhost:3001/api/vytal-sync/metrics
```

### Real-time Status
```bash
curl -H "X-Public-Key: your_public_key" \
     http://localhost:3001/api/vytal-sync/real-time/metrics
```
