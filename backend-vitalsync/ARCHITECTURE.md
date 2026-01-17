# Vital Sync Backend - Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATIONS                      │
│                    (Web, Mobile, Desktop)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   NGINX/PROXY    │ (Optional)
                    │  Rate Limiting   │
                    │  SSL/TLS         │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS API SERVER                          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Routes    │  │  Middleware  │  │ Controllers  │          │
│  │  /auth      │  │ • Auth       │  │ • Logic      │          │
│  │  /vitals    │  │ • Validation │  │ • Business   │          │
│  │  /devices   │  │ • RateLimit  │  │ • Responses  │          │
│  │  /recom     │  │ • CORS       │  │              │          │
│  │  /notif     │  │ • Logging    │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         SERVICES (Business Logic Layer)                │    │
│  │  • recommendationService (Claude API integration)      │    │
│  │  • notificationService (Email, notifications)          │    │
│  │  • logger (Activity tracking)                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              UTILS (Helper Functions)                  │    │
│  │  • crypto.js (JWT, hashing, encryption)               │    │
│  │  • validation (Input validation)                       │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  users   │ │  vitals  │ │ devices  │ │  notif   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │ sessions │ │ activity │ │   ai_    │  ...                  │
│  │          │ │   logs   │ │  recom   │                       │
│  └──────────┘ └──────────┘ └──────────┘                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
        ┌─────────────────────┐  ┌──────────────────┐
        │   External Services │  │  Scheduled Jobs  │
        │                     │  │  (Node-Cron)     │
        │  • Fitbit API       │  │                  │
        │  • Oura API         │  │ • Inactivity     │
        │  • Garmin API       │  │   alerts         │
        │  • Claude API       │  │ • Daily summaries│
        │  • Email Service    │  │ • Recommendations│
        │    (SMTP)           │  └──────────────────┘
        └─────────────────────┘
```

---

## Design Patterns

### 1. **MVC Pattern** (Modified)
- **Models**: Database schema and queries
- **Views**: JSON responses
- **Controllers**: Request handling and business logic

### 2. **Service Layer**
- Separates business logic from controllers
- Reusable services: recommendation, notification, logger
- Easier testing and maintenance

### 3. **Middleware Pattern**
- Authentication (JWT verification)
- Validation (Input sanitization)
- Error handling
- Logging

### 4. **Repository Pattern** (Implicit)
- Database access through service functions
- Encapsulates query logic

---

## Authentication Flow

```
User Signup/Login
       │
       ▼
   Validate Input
       │
       ▼
   Hash Password (bcrypt)
       │
       ▼
   Generate Tokens
   ├─ Access Token (15 min)
   └─ Refresh Token (7 days)
       │
       ▼
   Store in Sessions Table
       │
       ▼
   Return Tokens to Client
       │
       ▼
Client Stores Tokens
       │
       ▼
Subsequent Requests
   ├─ Authorization Header
   ├─ Verify JWT Signature
   ├─ Check Expiration
   ├─ Verify Session Exists
   └─ Grant Access
```

**Token Payload:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "user",
  "iat": 1705084200,
  "exp": 1705085100
}
```

---

## Vital Signs Data Pipeline

```
┌──────────────────────────┐
│  Record Vital Endpoint   │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│  Validate Input          │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│  Store in Database       │
│  vitals table            │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│  Update Daily Streak     │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│  Check Thresholds        │
│  & Send Alerts           │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│  Log Activity            │
└──────────────────────────┘
```

---

## Device Syncing Flow

```
Device Sync Request
       │
       ▼
Retrieve Device Details
       │
       ▼
Decrypt OAuth Token
       │
       ▼
Call External API
(Fitbit/Oura/Garmin)
       │
       ▼
Parse Response Data
       │
       ▼
Normalize Data Format
       │
       ▼
Store Vitals in DB
       │
       ▼
Update Last Synced Time
       │
       ▼
Log Activity
       │
       ▼
Return Results
```

---

## AI Recommendation Pipeline

```
User Requests Recommendations
           │
           ▼
Get Latest Vitals
           │
           ▼
Build Claude Prompt
(Health profile + vitals)
           │
           ▼
Call Anthropic API
(Claude 3.5 Sonnet)
           │
           ▼
Parse Response
(Extract JSON)
           │
           ▼
Validate Recommendations
           │
           ▼
Store in Database
           │
           ▼
Return to User
```

---

## Scheduled Jobs (Cron)

### Job 1: Inactivity Alerts (Every 30 minutes)
```javascript
cron.schedule('*/30 * * * *', () => {
  // Find users inactive for 2+ hours
  // Send alert notification
  // Log activity
});
```

### Job 2: Daily Health Summaries (8:00 AM)
```javascript
cron.schedule('0 8 * * *', () => {
  // Get today's vitals for all users
  // Calculate statistics
  // Send email summaries
});
```

### Job 3: Generate Recommendations (9:00 AM)
```javascript
cron.schedule('0 9 * * *', () => {
  // Find users with recent vitals
  // Call Claude API
  // Store recommendations
});
```

---

## Database Schema Design

### User & Session Management
- `users` - Core user profiles
- `sessions` - Active sessions with token tracking
- `user_devices` - Connected wearables
- `api_keys` - Encrypted third-party API keys

### Health Data
- `vitals` - Core vital signs data
- `daily_streaks` - Habit tracking
- `water_intake` - Water intake logging
- `reminders` - Health reminders
- `tasks` - Health-related tasks

### AI & Notifications
- `ai_recommendations` - Claude-generated recommendations
- `notifications` - User notifications (in-app, email)
- `notification_preferences` - User notification settings

### Audit & Logging
- `activity_logs` - User action tracking

### Indexes
- Composite indexes on frequently filtered columns
- Indexes on foreign keys
- Indexes on timestamp columns for range queries

---

## Security Architecture

```
┌─────────────────────────────────┐
│  HTTPS/TLS Encryption           │
│  (Transport Layer)              │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Rate Limiting                  │
│  (API Protection)               │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Input Validation               │
│  (Sanitization)                 │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  JWT Verification               │
│  (Authentication)               │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Role-Based Access Control      │
│  (Authorization)                │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Parameterized Queries          │
│  (SQL Injection Protection)     │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Encryption (oauth_tokens)      │
│  (Data at Rest)                 │
└─────────────────────────────────┘
```

---

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation)
- `401` - Unauthorized (no auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Performance Optimization

### Database
- Connection pooling (max 20 connections)
- Indexes on frequently queried columns
- Pagination for large result sets
- Efficient query design

### Application
- Middleware ordering (fast checks first)
- Async/await for non-blocking operations
- Error handling at all levels
- Logging only essential info

### Caching Strategies
- Session tokens cached in memory
- Database result pagination
- Could add Redis for distributed caching

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (can run multiple instances)
- Shared PostgreSQL database
- Session tokens stored in DB (not in-memory)
- Load balancer (Nginx, AWS ELB)

### Vertical Scaling
- Increase Node.js memory limits
- PostgreSQL instance upgrades
- Connection pool optimization

### Database Scaling
- Read replicas for reporting
- Partitioning on large tables (vitals)
- Archive old data

---

## Testing Strategy

### Unit Tests
- Utility functions (crypto, validation)
- Service logic
- Controller handlers

### Integration Tests
- Database operations
- API endpoints
- External service calls

### E2E Tests
- Complete user flows
- Auth to vitals recording
- Device syncing

---

## Deployment Architecture

```
┌─────────────────────────────────────┐
│  Git Repository                     │
│  (GitHub/GitLab)                    │
└─────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  CI/CD Pipeline                     │
│  • Build                            │
│  • Test                             │
│  • Deploy                           │
└─────────────────────────────────────┘
          │
    ┌─────┴──────┐
    ▼            ▼
Docker       Container
Image        Registry
Registry

    ▼
┌─────────────────────────────────────┐
│  Production Environment             │
│  • Load Balancer                    │
│  • API Instances (N replicas)       │
│  • Database (Primary + Replicas)    │
│  • Cache (Redis - optional)         │
│  • Monitoring & Logs                │
└─────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | PostgreSQL 12+ |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs |
| **Encryption** | Node crypto |
| **Validation** | express-validator |
| **AI API** | Anthropic Claude |
| **Email** | Nodemailer + SMTP |
| **Scheduling** | node-cron |
| **Rate Limiting** | express-rate-limit |
| **Security** | Helmet.js |
| **CORS** | cors |
| **Logging** | Morgan |
| **HTTP Client** | Axios |
| **Container** | Docker |
| **Orchestration** | Docker Compose |

---

## Code Organization Principles

1. **Separation of Concerns** - Each file has one responsibility
2. **DRY** - Don't Repeat Yourself
3. **SOLID Principles** - Clean, maintainable code
4. **Error Handling** - Comprehensive error management
5. **Security First** - Security at every layer
6. **Documentation** - Inline comments for complex logic
7. **Logging** - Audit trail for debugging

---

## Future Enhancements

- [ ] GraphQL API alternative
- [ ] Real-time WebSocket support
- [ ] File upload (profile pictures, documents)
- [ ] Advanced analytics dashboard
- [ ] Machine learning models for predictions
- [ ] Payment integration
- [ ] Third-party integrations (Apple Health, Google Fit)
- [ ] Multi-language support
- [ ] Advanced search functionality

---
