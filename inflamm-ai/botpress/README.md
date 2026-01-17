# Health Assistant Bot

## Overview
A compassionate health assistant that provides general medical guidance and support.

## Features
- Symptom recognition and assessment
- Health advice and recommendations
- Emergency detection and guidance
- Empathetic and supportive conversations
- Medical disclaimer and safety warnings

## Setup Instructions

### 1. Install Botpress
```bash
npm install -g botpress
```

### 2. Create Bot
```bash
botpress create health-assistant
cd health-assistant
```

### 3. Configure Bot
- Set up intents for health-related conversations
- Create entities for symptoms, body parts, severity
- Design conversation flows for common health scenarios
- Add emergency detection and escalation

### 4. Start Botpress Server
```bash
botpress start
```

### 5. Configure Environment
```bash
# Copy .env.botpress to .env.local
cp .env.botpress .env.local

# Update with your Botpress configuration
BOTPRESS_URL=http://localhost:3000
BOTPRESS_API_KEY=your-actual-api-key
BOTPRESS_BOT_ID=your-bot-id
```

## Intents to Create

### Health Concerns
- `health_concern`: General health questions
- `symptom_headache`: Headache-related concerns
- `symptom_fever`: Fever and temperature issues
- `symptom_cough`: Cough and respiratory concerns
- `symptom_pain`: General pain complaints

### Emergency Detection
- `emergency`: Emergency medical situations
- `urgent_care`: Urgent but non-emergency situations

### Health Advice
- `ask_exercise`: Exercise and fitness advice
- `ask_nutrition`: Diet and nutrition guidance
- `ask_sleep`: Sleep and rest recommendations
- `ask_stress`: Stress management and mental health

### General
- `greet`: Greetings and introductions
- `goodbye`: Farewells and closing
- `thank`: Expressions of gratitude
- `out_of_scope`: Non-health related queries

## Conversation Flows

### Emergency Flow
1. Detect emergency keywords
2. Ask for clarification
3. Provide immediate guidance
4. Recommend emergency services

### Symptom Assessment Flow
1. Acknowledge concern
2. Ask clarifying questions
3. Provide general advice
4. Recommend professional care if needed

### Health Advice Flow
1. Understand the health topic
2. Provide evidence-based information
3. Suggest practical steps
4. Include safety disclaimers

## Safety Features
- Always include medical disclaimers
- Never provide specific diagnoses
- Recommend professional medical care
- Emergency detection and escalation
- Clear limitations of AI assistant

## Integration
The bot integrates with the Next.js application through the `/api/botpress` endpoint, providing real-time health assistance to users.
