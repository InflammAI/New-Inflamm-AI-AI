# Vytal Sync Real-Time Tracking Usage Guide

## Overview
The Vytal Sync backend now supports real-time health data tracking using WebSockets. This allows clients to receive live health data updates and send real-time health metrics.

## Setup

### Environment Variables
Add these to your `.env` file:
```env
JWT_SECRET=your-secret-key-here
PORT=3001
DATABASE_URL=your-database-url
```

### Dependencies
New dependencies have been added:
- `ws` - WebSocket library
- `jsonwebtoken` - JWT authentication for WebSocket connections
- `@types/ws` - TypeScript definitions
- `@types/jsonwebtoken` - TypeScript definitions

## API Endpoints

### 1. Get WebSocket Authentication Token
```
GET /api/vytal-sync/real-time/token
Headers: X-Public-Key: <user-public-key>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "wsUrl": "ws://localhost:3001/ws/vytal-sync?token=jwt-token-here",
    "expiresIn": "24h"
  },
  "timestamp": 1640995200000
}
```

### 2. Get Real-Time Metrics
```
GET /api/vytal-sync/real-time/metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalConnections": 5,
    "subscriptions": 8,
    "bufferedData": 12
  },
  "timestamp": 1640995200000
}
```

### 3. Trigger Real-Time Event
```
POST /api/vytal-sync/real-time/trigger-event
Body: {
  "eventType": "health_alert",
  "publicKey": "user-public-key",
  "data": { ... }
}
```

## WebSocket Connection

### Connection URL
```
ws://localhost:3001/ws/vytal-sync?token=<jwt-token>
```

### Message Types

#### 1. Subscribe to Health Data
```json
{
  "type": "subscribe",
  "dataType": "health_data",
  "publicKey": "user-public-key-or-leave-empty-for-self"
}
```

#### 2. Unsubscribe
```json
{
  "type": "unsubscribe",
  "dataType": "health_data",
  "publicKey": "user-public-key"
}
```

#### 3. Send Health Data
```json
{
  "type": "health_data",
  "data": {
    "heartRate": 75,
    "steps": 5000,
    "calories": 300,
    "bloodOxygen": 98,
    "stressLevel": 2,
    "activityType": "walking"
  }
}
```

#### 4. Ping/Pong
```json
{
  "type": "ping"
}
```

### Server Messages

#### Connection Established
```json
{
  "type": "connection",
  "clientId": "abc123def",
  "message": "Connected to Vytal Sync real-time tracking",
  "timestamp": 1640995200000
}
```

#### Subscription Confirmed
```json
{
  "type": "subscription_confirmed",
  "dataType": "health_data",
  "publicKey": "user-public-key",
  "timestamp": 1640995200000
}
```

#### Health Data Update
```json
{
  "type": "health_data_update",
  "data": {
    "id": "data123",
    "publicKey": "user-public-key",
    "timestamp": 1640995200000,
    "heartRate": 75,
    "steps": 5000,
    "calories": 300,
    "bloodOxygen": 98,
    "stressLevel": 2,
    "activityType": "walking"
  },
  "timestamp": 1640995200000
}
```

#### Health Data Received Confirmation
```json
{
  "type": "health_data_received",
  "dataId": "data123",
  "timestamp": 1640995200000
}
```

## Client Implementation Example (JavaScript)

```javascript
class VytalSyncRealTime {
  constructor(publicKey) {
    this.publicKey = publicKey;
    this.ws = null;
    this.token = null;
  }

  async connect() {
    // Get auth token
    const response = await fetch('/api/vytal-sync/real-time/token', {
      headers: { 'X-Public-Key': this.publicKey }
    });
    const { data } = await response.json();
    this.token = data.token;

    // Connect WebSocket
    this.ws = new WebSocket(data.wsUrl);
    
    this.ws.onopen = () => {
      console.log('Connected to Vytal Sync real-time tracking');
      this.subscribe();
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from Vytal Sync');
    };
  }

  subscribe() {
    this.ws.send(JSON.stringify({
      type: 'subscribe',
      dataType: 'health_data'
    }));
  }

  sendHealthData(data) {
    this.ws.send(JSON.stringify({
      type: 'health_data',
      data
    }));
  }

  handleMessage(message) {
    switch (message.type) {
      case 'health_data_update':
        console.log('Received health data:', message.data);
        break;
      case 'subscription_confirmed':
        console.log('Subscription confirmed');
        break;
      default:
        console.log('Received message:', message);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage
const client = new VytalSyncRealTime('user-public-key');
client.connect();
```

## Features

### 1. Real-Time Health Data Streaming
- Live heart rate, steps, calories, blood oxygen, stress level
- Activity tracking
- Automatic data buffering and processing

### 2. Authentication & Security
- JWT-based WebSocket authentication
- Public key validation
- Secure token generation

### 3. Connection Management
- Automatic cleanup of inactive connections
- Ping/pong heartbeat mechanism
- Graceful shutdown handling

### 4. Data Processing
- Batch processing of health data
- Database integration
- Real-time broadcasting to subscribed clients

### 5. Monitoring & Metrics
- Connection count tracking
- Subscription metrics
- Buffer status monitoring

## Error Handling

### WebSocket Errors
- Authentication failures (1008)
- Invalid message format
- Connection timeouts

### API Errors
- Missing public key headers
- Invalid token requests
- Server errors

## Testing

Start the backend server:
```bash
cd backend
npm install
npm run dev
```

The server will start on port 3001 with WebSocket support enabled.

## Notes

- WebSocket connections require a valid JWT token
- Tokens expire after 24 hours
- Health data is processed in batches every 5 seconds
- Inactive connections are automatically cleaned up after 60 seconds
- All timestamps are in milliseconds since epoch
