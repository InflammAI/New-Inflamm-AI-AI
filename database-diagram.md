# InflammAI Database Architecture Diagram

## Visual Database Schema

```mermaid
graph TB
    %% Core User Tables
    Users["Users Table<br/>👤 User Profiles<br/>• user_id (PK)<br/>• email, username<br/>• subscription_plan<br/>• family_group_id<br/>• hipaa_consent"]
    
    %% Chat System Tables
    ChatSessions["ChatSessions<br/>💬 Chat Management<br/>• session_id (PK)<br/>• user_id (FK)<br/>• session_type<br/>• wellness_rating<br/>• sentiment_score"]
    
    ChatMessages["ChatMessages<br/>📝 Message Storage<br/>• message_id (PK)<br/>• session_id (FK)<br/>• content<br/>• message_type<br/>• ai_confidence"]
    
    ChatImages["ChatSessionImages<br/>🖼️ Chat Media<br/>• image_id (PK)<br/>• session_id (FK)<br/>• image_url<br/>• image_type<br/>• upload_source"]
    
    %% SciCast System Tables
    ScientificHypotheses["ScientificHypotheses<br/>🔬 Research Hub<br/>• hypothesis_id (PK)<br/>• creator_user_id (FK)<br/>• title, description<br/>• status<br/>• category"]
    
    HypothesisVotes["HypothesisVotes<br/>🗳️ Community Voting<br/>• vote_id (PK)<br/>• hypothesis_id (FK)<br/>• voter_user_id (FK)<br/>• vote_type<br/>• confidence_level"]
    
    HypothesisEvidence["HypothesisEvidence<br/>📋 Research Evidence<br/>• evidence_id (PK)<br/>• hypothesis_id (FK)<br/>• evidence_data (JSONB)<br/>• credibility_score"]
    
    HypothesisComments["HypothesisComments<br/>💭 Research Discussion<br/>• comment_id (PK)<br/>• hypothesis_id (FK)<br/>• commenter_user_id (FK)<br/>• content<br/>• comment_type"]
    
    %% Health & Wellness Tables
    HealthVitals["HealthVitals<br/>❤️ Health Tracking<br/>• vital_id (PK)<br/>• user_id (FK)<br/>• vital_type, value<br/>• measurement_method<br/>• is_abnormal"]
    
    VitalImages["VitalImages<br/>📊 Health Charts<br/>• image_id (PK)<br/>• vital_id (FK)<br/>• chart_type<br/>• data_points (JSONB)<br/>• time_range"]
    
    VitalAlerts["VitalAlerts<br/>🚨 Health Alerts<br/>• alert_id (PK)<br/>• user_id (FK)<br/>• alert_type<br/>• severity<br/>• message"]
    
    %% Commerce Tables
    WellnessKits["WellnessKits<br/>🛍️ Wellness Products<br/>• kit_id (PK)<br/>• kit_name, price<br/>• kit_category<br/>• supplier_name<br/>• is_approved"]
    
    KitItems["KitItems<br/>📦 Product Details<br/>• item_id (PK)<br/>• kit_id (FK)<br/>• item_name<br/>• quantity, unit<br/>• ingredients"]
    
    KitImages["KitImages<br/>📷 Product Photos<br/>• image_id (PK)<br/>• kit_id (FK)<br/>• image_url<br/>• image_type<br/>• is_primary"]
    
    MicroTransactions["MicroTransactions<br/>💳 Purchase History<br/>• transaction_id (PK)<br/>• user_id (FK)<br/>• item_id (FK)<br/>• total_amount<br/>• payment_status"]
    
    %% Family System Tables
    FamilyGroups["FamilyGroups<br/>👨‍👩‍👧‍👦 Family Groups<br/>• family_group_id (PK)<br/>• group_name<br/>• primary_member_id (FK)<br/>• max_members<br/>• subscription_plan"]
    
    FamilyMembers["FamilyMembers<br/>👥 Family Members<br/>• membership_id (PK)<br/>• family_group_id (FK)<br/>• user_id (FK)<br/>• role<br/>• permissions (JSONB)"]
    
    %% Relationships
    Users -->|has| ChatSessions
    Users -->|creates| ScientificHypotheses
    Users -->|votes on| HypothesisVotes
    Users -->|tracks| HealthVitals
    Users -->|purchases| MicroTransactions
    Users -->|belongs to| FamilyGroups
    
    ChatSessions -->|contains| ChatMessages
    ChatSessions -->|has images| ChatImages
    
    ScientificHypotheses -->|receives| HypothesisVotes
    ScientificHypotheses -->|has evidence| HypothesisEvidence
    ScientificHypotheses -->|has comments| HypothesisComments
    
    HealthVitals -->|generates| VitalImages
    HealthVitals -->|triggers| VitalAlerts
    
    WellnessKits -->|contains| KitItems
    WellnessKits -->|has photos| KitImages
    WellnessKits -->|sold in| MicroTransactions
    
    FamilyGroups -->|includes| FamilyMembers
    
    %% Styling
    classDef userTable fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef chatTable fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef scicastTable fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef healthTable fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef commerceTable fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef familyTable fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    
    class Users userTable
    class ChatSessions,ChatMessages,ChatImages chatTable
    class ScientificHypotheses,HypothesisVotes,HypothesisEvidence,HypothesisComments scicastTable
    class HealthVitals,VitalImages,VitalAlerts healthTable
    class WellnessKits,KitItems,KitImages,MicroTransactions commerceTable
    class FamilyGroups,FamilyMembers familyTable
```

## System Architecture Overview

```mermaid
graph LR
    subgraph "Frontend Layer"
        WebApp[🌐 Web Application]
        MobileApp[📱 Mobile App]
        ChatUI[💬 Chat Interface]
        SciCastUI[🔬 SciCast Portal]
    end
    
    subgraph "API Layer"
        ChatAPI[💬 Chat API]
        SciCastAPI[🔬 SciCast API]
        HealthAPI[❤️ Health API]
        CommerceAPI[🛍️ Commerce API]
        FamilyAPI[👨‍👩‍👧‍👦 Family API]
    end
    
    subgraph "Business Logic Layer"
        AIService[🤖 AI Service]
        AnalyticsService[📊 Analytics Service]
        NotificationService[🔔 Notification Service]
        PaymentService[💳 Payment Service]
    end
    
    subgraph "Database Layer"
        PostgreSQL[(🐘 PostgreSQL)]
        Redis[(⚡ Redis Cache)]
        S3Storage[(📦 S3 Storage)]
    end
    
    subgraph "External Services"
        EmailService[📧 Email Service]
        PaymentGateway[💰 Payment Gateway]
        HealthDevices[🏥 Health Devices]
    end
    
    %% Connections
    WebApp --> ChatAPI
    WebApp --> SciCastAPI
    MobileApp --> HealthAPI
    ChatUI --> ChatAPI
    SciCastUI --> SciCastAPI
    
    ChatAPI --> AIService
    SciCastAPI --> AnalyticsService
    HealthAPI --> NotificationService
    CommerceAPI --> PaymentService
    
    AIService --> PostgreSQL
    AnalyticsService --> Redis
    NotificationService --> S3Storage
    
    PaymentService --> PaymentGateway
    HealthAPI --> HealthDevices
    NotificationService --> EmailService
    
    %% Styling
    classDef frontend fill:#e3f2fd,stroke:#1976d2
    classDef api fill:#f3e5f5,stroke:#7b1fa2
    classDef business fill:#e8f5e8,stroke:#388e3c
    classDef database fill:#fff3e0,stroke:#f57c00
    classDef external fill:#fce4ec,stroke:#c2185b
    
    class WebApp,MobileApp,ChatUI,SciCastUI frontend
    class ChatAPI,SciCastAPI,HealthAPI,CommerceAPI,FamilyAPI api
    class AIService,AnalyticsService,NotificationService,PaymentService business
    class PostgreSQL,Redis,S3Storage database
    class EmailService,PaymentGateway,HealthDevices external
```

## Chat System Data Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant C as 💬 Chat UI
    participant A as 🤖 AI Service
    participant DB as 🐘 Database
    participant S as 📦 Storage
    
    U->>C: Send message
    C->>A: Process message
    A->>DB: Store user message
    A->>A: Generate AI response
    A->>DB: Store AI response
    A->>S: Generate chart/image (if needed)
    S->>DB: Store image reference
    A->>C: Return response
    C->>U: Display AI response + images
    
    Note over A,DB: Wellness Check Flow
    U->>C: Rate wellness (1-5)
    C->>A: Process wellness rating
    A->>DB: Update session with rating
    A->>A: Generate empathetic response
    A->>C: Return wellness response
    
    Note over A,DB: Mini-Offer Flow
    U->>C: Request mini-offer
    C->>A: Process offer request
    A->>DB: Store offer interaction
    A->>C: Return offer details
    U->>C: Purchase decision
    C->>A: Process purchase
    A->>DB: Record transaction
```

## SciCast System Workflow

```mermaid
flowchart TD
    Start([🚀 Start]) --> CreateHypothesis[💡 Create Hypothesis]
    CreateHypothesis --> SubmitReview[📋 Submit for Review]
    SubmitReview --> ReviewDecision{🔍 Review Decision}
    
    ReviewDecision -->|✅ Approved| CommunityVote[🗳️ Community Voting]
    ReviewDecision -->|❌ Rejected| ReviseHypothesis[✏️ Revise Hypothesis]
    ReviseHypothesis --> SubmitReview
    
    CommunityVote --> VoteThreshold{📊 Vote Threshold Met?}
    VoteThreshold -->|✅ Yes| ResearchPhase[🔬 Research Phase]
    VoteThreshold -->|❌ No| GatherEvidence[📈 Gather More Evidence]
    GatherEvidence --> CommunityVote
    
    ResearchPhase --> DataCollection[📊 Data Collection]
    DataCollection --> Analysis[📉 Data Analysis]
    Analysis --> Results[📋 Research Results]
    Results --> Publish[🌐 Publish Findings]
    Publish --> End([✅ Complete])
    
    %% Styling
    classDef startEnd fill:#4caf50,color:#fff
    classDef process fill:#2196f3,color:#fff
    classDef decision fill:#ff9800,color:#fff
    classDef action fill:#9c27b0,color:#fff
    
    class Start,End startEnd
    class CreateHypothesis,SubmitReview,CommunityVote,ResearchPhase,DataCollection,Analysis,Results,Publish process
    class ReviewDecision,VoteThreshold decision
    class ReviseHypothesis,GatherEvidence action
```

## Health Data Pipeline

```mermaid
graph TB
    subgraph "Data Sources"
        Wearables[⌚ Wearables]
        ManualEntry[✍️ Manual Entry]
        MedicalDevices[🏥 Medical Devices]
        ThirdPartyAPIs[🔌 Third-party APIs]
    end
    
    subgraph "Data Processing"
        DataValidation[✅ Data Validation]
        Normalization[📊 Normalization]
        AnomalyDetection[🚨 Anomaly Detection]
        TrendAnalysis[📈 Trend Analysis]
    end
    
    subgraph "Storage & Analytics"
        RawData[(🗄️ Raw Data)]
        ProcessedData[(📊 Processed Data)]
        Analytics[(📈 Analytics)]
        Charts[(📋 Charts)]
    end
    
    subgraph "User Interface"
        Dashboard[📱 Health Dashboard]
        Alerts[🔔 Health Alerts]
        Reports[📋 Health Reports]
        ChatIntegration[💬 Chat Integration]
    end
    
    %% Data Flow
    Wearables --> DataValidation
    ManualEntry --> DataValidation
    MedicalDevices --> DataValidation
    ThirdPartyAPIs --> DataValidation
    
    DataValidation --> Normalization
    Normalization --> AnomalyDetection
    AnomalyDetection --> TrendAnalysis
    
    DataValidation --> RawData
    Normalization --> ProcessedData
    TrendAnalysis --> Analytics
    Analytics --> Charts
    
    ProcessedData --> Dashboard
    AnomalyDetection --> Alerts
    Analytics --> Reports
    Charts --> ChatIntegration
    
    %% Styling
    classDef source fill:#e3f2fd,stroke:#1976d2
    classDef processing fill:#f3e5f5,stroke:#7b1fa2
    classDef storage fill:#e8f5e8,stroke:#388e3c
    classDef interface fill:#fff3e0,stroke:#f57c00
    
    class Wearables,ManualEntry,MedicalDevices,ThirdPartyAPIs source
    class DataValidation,Normalization,AnomalyDetection,TrendAnalysis processing
    class RawData,ProcessedData,Analytics,Charts storage
    class Dashboard,Alerts,Reports,ChatIntegration interface
```

## Key Database Relationships Summary

### Primary Relationships:
- **Users** → **ChatSessions** (1:N) - User chat sessions
- **Users** → **ScientificHypotheses** (1:N) - Created hypotheses
- **Users** → **HealthVitals** (1:N) - Health tracking data
- **Users** → **FamilyGroups** (N:1) - Family membership
- **ChatSessions** → **ChatMessages** (1:N) - Messages per session
- **ScientificHypotheses** → **HypothesisVotes** (1:N) - Votes per hypothesis
- **WellnessKits** → **MicroTransactions** (1:N) - Purchase history

### Critical Indexes:
- `users_email_idx` - Fast user lookup
- `chat_sessions_user_id_idx` - User session queries
- `hypotheses_status_idx` - Filter by approval status
- `health_vitals_user_measured_idx` - User health history
- `transactions_user_status_idx` - Purchase history

### Data Volume Estimates:
- **Chat Messages**: ~1M messages/month
- **Health Vitals**: ~10M readings/month
- **Hypotheses**: ~1K active hypotheses
- **Transactions**: ~10K purchases/month
- **Images**: ~50K images stored

This comprehensive database architecture supports all InflammAI features with scalability, performance, and HIPAA compliance in mind.
