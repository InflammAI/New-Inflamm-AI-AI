# App Vital Sync - Architecture Overview

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    App Vital Sync                          │
│                 (Next.js Frontend)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────┴───────────────────────────────────────┐
│                    Core Modules                             │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Health Tracker │   Vytal Sync    │   Authentication       │
│   (Flutter)    │   (TypeScript)  │   (Multi-wallet)      │
└─────────────────┴─────────────────┴─────────────────────────┘
                      │
                      ▼
┌─────────────────────┴───────────────────────────────────────┐
│                 Backend Services                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Database      │   API Gateway   │   External APIs       │
│  (PostgreSQL)   │   (Express)     │  (Wearable/Botpress) │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## 📱 Frontend Architecture (Next.js)

### **Core Pages & Routes**
```
/app
├── /                    # Landing page
├── /health-tracker      # Health monitoring interface
├── /vytal-sync         # Data synchronization dashboard
├── /api               # Backend API routes
└── /inflamm-ai        # Main application pages
```

### **Component Structure**
```
/components
├── /HealthTracker
│   ├── HealthTrackerDashboard.tsx      # Main health monitoring UI
│   └── IntegratedHealthDashboard.tsx   # Unified tracker + sync
├── /VytalSync
│   ├── VytalSyncDashboard.tsx         # Original sync interface
│   └── EnhancedVytalSyncDashboard.tsx # Advanced sync with security
├── Navbar.tsx                        # Navigation with auth
├── Footer.tsx                        # Application footer
└── [Other UI Components]              # Reusable UI elements
```

### **State Management**
- **React Hooks**: Local component state
- **Context API**: Global application state
- **Real-time Updates**: Simulated live data streams

## 🔐 Authentication & Wallet Integration

### **Multi-Wallet Support**
```typescript
// Supported Wallets
├── @solana/wallet-adapter-react     # Solana ecosystem
├── @tonconnect/ui-react             # TON blockchain
├── @web3-react/core               # Ethereum/Web3
└── @tma.js/sdk-react             # Telegram Mini Apps
```

### **Authentication Flow**
1. **User selects wallet** → Connect to blockchain
2. **Generate cryptographic keys** → For VytalSync encryption
3. **Create access tokens** → For API authentication
4. **Store session securely** → In browser storage

## 🏥 Health Tracker Module

### **Flutter Architecture**
```
/Health_Tracker (Flutter)
├── /lib
│   ├── main.dart                    # App entry point
│   ├── /smartwatch_connection
│   │   ├── /scan_screen            # BLE device discovery
│   │   ├── /device_screen          # Device management
│   │   └── /cubit                # State management (BLoC)
│   └── /shared                    # Reusable components
├── /android                       # Android platform code
├── /ios                          # iOS platform code
└── pubspec.yaml                   # Dependencies
```

### **Health Data Flow**
```
Wearable Device (BLE)
        ↓
Flutter Blue Plus
        ↓
Health Metrics (Heart Rate, Steps, Calories)
        ↓
Local Storage (Device)
        ↓
VytalSync Encryption
        ↓
Zero-Knowledge API
```

### **Key Dependencies**
- `flutter_blue_plus`: Bluetooth LE connectivity
- `bloc`: State management pattern
- `provider`: Dependency injection
- `shimmer`: Loading animations

## 🔒 VytalSync Security Architecture

### **Zero-Knowledge Data Pipeline**
```typescript
// Data Flow Architecture
1. Wearable Data Collection
   ↓
2. Client-Side Encryption (AES-256-GCM)
   ↓
3. Digital Signature (Ed25519)
   ↓
4. Zero-Knowledge API Storage
   ↓
5. Access Control (Cryptographic Permissions)
```

### **Core Security Components**
```typescript
/lib/vytal-sync
├── data-flow-orchestrator.ts    # Main sync coordinator
├── vytal-sync-app.ts           # Sync application logic
├── encrypted-database.ts        # Secure data storage
├── encryption.ts              # Cryptographic operations
├── wearable-interface.ts       # Device data abstraction
└── index.ts                  # Module exports
```

### **Encryption Specifications**
- **Algorithm**: AES-256-GCM for data encryption
- **Key Exchange**: ECDH (Elliptic Curve Diffie-Hellman)
- **Digital Signatures**: Ed25519
- **Hash Function**: SHA-256
- **Zero-Knowledge**: Server cannot access plaintext data

## 🗄️ Backend Architecture

### **API Routes Structure**
```
/app/api
├── /auth                    # Authentication endpoints
├── /health-data             # VytalSync data operations
├── /wearable               # Device integration
├── /telegram               # Bot integration
└── /wallet                 # Blockchain operations
```

### **Database Schema**
```sql
-- Core Tables
users                  # User profiles and wallet addresses
health_data_records     # Encrypted health data
access_permissions      # Data sharing permissions
audit_logs            # Security and access logs
sync_status           # Synchronization tracking
```

### **External Integrations**
- **Botpress**: Chatbot and conversational AI
- **Rasa**: Natural language processing
- **PostgreSQL**: Primary database
- **Express.js**: API server framework

## 🔗 Data Flow Architecture

### **Health Data Synchronization**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ Wearable    │    │   Flutter    │    │  VytalSync  │
│ Device      │───▶│   App        │───▶│  Backend    │
│ (BLE)       │    │ (Mobile)     │    │ (ZK Proof)  │
└─────────────┘    └──────────────┘    └─────────────┘
                           │                    │
                           ▼                    ▼
                   ┌──────────────┐    ┌─────────────┐
                   │ Local Cache  │    │ Encrypted   │
                   │ (Device)     │    │ Database    │
                   └──────────────┘    └─────────────┘
```

### **Web Application Flow**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   User      │    │ Next.js     │    │  Backend    │
│ Browser     │───▶│ Frontend    │───▶│  APIs       │
│             │    │             │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   React     │    │   State     │    │ Database   │
│ Components  │    │ Management  │    │ (PostgreSQL)│
└─────────────┘    └──────────────┘    └─────────────┘
```

## 🛡️ Security Architecture

### **Multi-Layer Security**
```
┌─────────────────────────────────────────────────────────┐
│                 Security Layers                      │
├─────────────────────────────────────────────────────┤
│ 1. Network Security (HTTPS, CORS)                │
│ 2. Authentication (JWT, Multi-Wallet)            │
│ 3. Authorization (Role-based Access)               │
│ 4. Encryption (End-to-End AES-256)              │
│ 5. Zero-Knowledge (Server can't decrypt)         │
│ 6. Audit Logging (Complete activity tracking)      │
│ 7. Compliance (GDPR, HIPAA)                     │
└─────────────────────────────────────────────────────┘
```

### **Privacy Features**
- **Client-Side Encryption**: Data encrypted before transmission
- **Zero-Knowledge Storage**: Server stores only encrypted blobs
- **Access Control**: Cryptographic permissions for data sharing
- **Audit Trails**: Complete log of all data access
- **Key Management**: User-controlled private keys

## 📊 Technology Stack

### **Frontend Technologies**
- **Framework**: Next.js 15.5.7 (React 18.3.1)
- **Styling**: Tailwind CSS 3.3.0
- **UI Components**: Material-UI, Lucide Icons
- **State Management**: React Hooks, Context API
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

### **Mobile Technologies**
- **Framework**: Flutter (Dart)
- **State Management**: BLoC Pattern
- **Bluetooth**: flutter_blue_plus
- **Platform Support**: Android, iOS, Web

### **Backend Technologies**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL 8.16.3
- **ORM**: Custom database layer
- **Authentication**: JWT + Blockchain wallets

### **Blockchain & Crypto**
- **Solana**: @solana/wallet-adapter
- **TON**: @tonconnect/ui-react
- **Ethereum**: @web3-react/core
- **Cryptography**: Custom encryption library

## 🚀 Deployment Architecture

### **Development Environment**
```
Local Development
├── Next.js Dev Server (Port 5000)
├── Flutter Development Server
├── PostgreSQL Database
└── Backend API Server
```

### **Production Deployment**
```
Cloud Infrastructure
├── Frontend: Vercel/Netlify (Next.js)
├── Backend: Docker Containers
├── Database: Managed PostgreSQL
├── Storage: Encrypted blob storage
└── CDN: Static asset delivery
```

## 🔄 Integration Points

### **Health Tracker ↔ VytalSync**
- **Data Flow**: Health metrics → Encryption → Secure storage
- **Real-time Sync**: Continuous data synchronization
- **Access Control**: User-managed sharing permissions

### **Web ↔ Mobile**
- **Shared Backend**: Common API endpoints
- **Unified Authentication**: Cross-platform wallet support
- **Data Consistency**: Synchronized health records

### **Blockchain Integration**
- **Identity**: Wallet-based user authentication
- **Smart Contracts**: Automated data access rules
- **Tokenomics**: In-app token functionality

## 📈 Scalability Architecture

### **Horizontal Scaling**
- **Load Balancing**: Multiple frontend instances
- **Database Sharding**: Partitioned health data
- **Microservices**: Modular backend services
- **CDN Distribution**: Global content delivery

### **Performance Optimization**
- **Caching Strategy**: Redis for frequent queries
- **Database Indexing**: Optimized health data queries
- **Lazy Loading**: Progressive component loading
- **Image Optimization**: Next.js image optimization

## 🔧 Development Workflow

### **Code Organization**
```
/src
├── /app              # Next.js app router
├── /components       # Reusable React components
├── /lib             # Utility libraries
├── /styles          # Global styles
└── /types           # TypeScript definitions
```

### **Build Process**
1. **Development**: `npm run dev` (Hot reload)
2. **Production**: `npm run build` (Optimized build)
3. **Testing**: Vitest + Playwright
4. **Linting**: ESLint + TypeScript checks

## 🎯 Key Features & Capabilities

### **Health Monitoring**
- Real-time vital signs tracking
- Multi-device support
- Historical data analysis
- Health trend insights

### **Data Security**
- Zero-knowledge encryption
- Blockchain-based identity
- Granular access control
- Complete audit trails

### **User Experience**
- Responsive design
- Progressive web app
- Multi-platform support
- Intuitive interface

### **Developer Experience**
- TypeScript throughout
- Component-based architecture
- Comprehensive documentation
- Modern tooling

---

## 📝 Notes

- **Flutter Health Tracker**: Standalone mobile app with BLE connectivity
- **Web Interface**: Dashboard and management portal
- **VytalSync**: Core zero-knowledge data synchronization
- **Blockchain**: Multi-wallet support for identity and transactions
- **Security**: End-to-end encryption with zero-knowledge proofs

This architecture ensures privacy, security, and scalability while providing a seamless user experience across multiple platforms.
