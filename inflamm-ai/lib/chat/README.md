# Wellness Chat System

A comprehensive chat system for wellness coaching with safety rules, vitals integration, and supplement micro-transactions.

## Features

### 🏥 Safety-First Design
- **Emergency Detection**: Automatically detects emergency situations and redirects to appropriate resources
- **Risk Assessment**: Multi-level risk evaluation (Low, Medium, High, Emergency)
- **Medical Safety**: Never diagnoses or provides medical treatment
- **Compliance**: Follows healthcare regulations and best practices

### 💬 Intelligent Chat
- **Intent Classification**: Automatically categorizes user messages (wellness, sleep, stress, nutrition, supplements, emergency)
- **Context-Aware Responses**: Generates appropriate responses based on intent and risk level
- **Vitals Integration**: Optional integration with wearable health data for personalized insights

### 💰 Supplement Micro-Transactions
- **Product Catalog**: Curated supplement catalog with safety disclaimers
- **Purchase Flow**: Complete purchase session management
- **Safety Checks**: Purchase limits and safety validations
- **Order Management**: Full order tracking and status updates

## Architecture

### Core Services

#### ChatService
Main service for handling chat interactions:
```typescript
const chatService = createChatService(vytalSyncService);
const response = await chatService.handleIncomingMessage(
  userMessage,
  includeVitals,
  userId
);
```

#### SupplementService
Handles supplement catalog and purchases:
```typescript
const supplementService = new SupplementService();
const products = await supplementService.getRelevantProducts(intent);
const purchase = await supplementService.startPurchaseSession(productId, userId);
```

### Key Components

1. **Intent Classification**: Categorizes user messages into appropriate wellness domains
2. **Risk Evaluation**: Assesses message content and vitals for safety concerns
3. **Response Generation**: Creates appropriate, safe responses
4. **Vitals Integration**: Optional health data context from wearables
5. **Supplement Commerce**: Safe supplement sales with compliance checks

## Usage Examples

### Basic Chat
```typescript
import { createChatService } from './lib/chat';
import { VytalSyncService } from './lib/vytal-sync/vytal-sync-service';

const vytalSyncService = new VytalSyncService(config);
const chatService = createChatService(vytalSyncService);

// Handle user message
const response = await chatService.handleIncomingMessage(
  "I'm having trouble sleeping",
  true, // include vitals
  "user123"
);

console.log(response.message); // AI response
console.log(response.intent); // "sleep"
console.log(response.riskLevel); // "low"
```

### Supplement Purchase
```typescript
// Get relevant supplements
const supplements = await supplementService.getRelevantProducts('sleep');

// Start purchase
const session = await supplementService.startPurchaseSession(
  'supp_melatonin',
  'user123'
);

// Complete purchase
const order = await supplementService.finalizePurchase(
  session.sessionId,
  'user123'
);
```

## Safety Rules

### ✅ What the System CAN Do
- Provide general wellness guidance
- Share evidence-based health tips
- Offer stress management techniques
- Suggest sleep hygiene practices
- Provide general nutrition information
- Sell supplements with appropriate disclaimers
- Redirect to emergency services when needed

### ❌ What the System MUST NOT Do
- Diagnose medical conditions
- Provide treatment instructions
- Claim supplements cure diseases
- Sell supplements during emergency situations
- Replace professional medical advice
- Interpret medical test results

## Intent Categories

### Emergency
- Keywords: suicide, chest pain, heart attack, can't breathe, severe pain
- Action: Immediate emergency redirect

### Sleep
- Keywords: sleep, insomnia, tired, fatigue, bedtime
- Response: Sleep hygiene and general guidance

### Stress
- Keywords: stress, anxiety, overwhelmed, panic, worried
- Response: Stress management techniques

### Nutrition
- Keywords: diet, food, eat, meal, healthy eating
- Response: General nutrition guidance

### Supplements
- Keywords: supplement, vitamin, magnesium, buy supplements
- Response: General supplement information + product offers

### Wellness
- Keywords: wellness, health, healthy, energy, mood
- Response: General wellness tips

## Risk Assessment

### Emergency Risk
- Immediate danger indicators
- Severe medical symptoms
- Self-harm expressions

### High Risk
- Elevated heart rate (>120 bpm)
- Low blood oxygen (<90%)
- Severe emotional distress

### Medium Risk
- Mild vitals abnormalities
- Moderate emotional distress
- General health concerns

### Low Risk
- General wellness questions
- Lifestyle improvement requests
- Information seeking

## Supplement Catalog

### Categories
- **Sleep**: Melatonin, Magnesium
- **Stress**: Ashwagandha, L-Theanine
- **General**: Vitamin D, Omega-3, Vitamin C
- **Energy**: B-Complex

### Safety Features
- Purchase limits (3 per product per 30 days)
- Age restrictions
- Contraindication warnings
- Quality disclaimers

## React Integration

```tsx
import { WellnessChat } from './components/Chat/WellnessChat';

function App() {
  return (
    <WellnessChat 
      userId="user123"
      className="h-96"
    />
  );
}
```

## Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_PAYMENT_PROVIDER=stripe
REACT_APP_EMERGENCY_PHONE=911
REACT_APP_CRISIS_TEXT=741741
```

### Chat Config
```typescript
const config: ChatConfig = {
  maxMessagesPerSession: 100,
  sessionTimeoutMinutes: 60,
  enableVitalsIntegration: true,
  enableSupplementSales: true,
  emergencyContacts: {
    phone: '911',
    textLine: '741741',
    website: 'https://www.crisistextline.org'
  }
};
```

## Compliance Notes

- **HIPAA**: Not designed to handle PHI
- **FDA**: Supplements sold as dietary supplements, not drugs
- **FTC**: No misleading health claims
- **COPPA**: Not intended for users under 13

## Emergency Procedures

1. **Detection**: System detects emergency keywords or vitals
2. **Immediate Response**: Provides emergency contact information
3. **Logging**: Logs incident for review
4. **Follow-up**: Recommends professional help

## Monitoring & Analytics

Track:
- Message volume and response times
- Intent distribution
- Risk level occurrences
- Supplement conversion rates
- Emergency incidents

## Future Enhancements

- Multi-language support
- Voice integration
- Video consultations
- Prescription integration
- Insurance coverage checks
- Healthcare provider referrals
