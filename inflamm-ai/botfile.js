module.exports = {
  version: '10.51.10',
  botId: 'health-assistant',
  botName: 'Health Assistant',
  description: 'A compassionate health assistant that provides general medical guidance and support',
  botUrl: 'http://localhost:3000',
  
  // Server configuration
  server: {
    host: 'localhost',
    port: 3000
  },
  
  // Database configuration
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgres://postgres:122802Kele@localhost:5432/inflamm_ai'
  },
  
  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-here',
    cors: {
      enabled: true,
      origins: ['http://localhost:5000', 'http://localhost:3000']
    }
  },
  
  // Modules configuration
  modules: {
    'basic-skills': {
      enabled: true
    },
    'nlu': {
      enabled: true,
      languages: ['en']
    },
    'dialog': {
      enabled: true
    },
    'actions': {
      enabled: true
    },
    'qna': {
      enabled: true
    },
    'analytics': {
      enabled: false
    }
  },
  
  // Health assistant specific configuration
  healthAssistant: {
    emergencyKeywords: ['emergency', '911', 'urgent', 'can\'t breathe', 'chest pain', 'severe bleeding'],
    medicalDisclaimer: 'I am not a medical professional. Please consult with a healthcare provider for medical advice.',
    maxConversationLength: 20,
    responseDelay: 500 // milliseconds for natural typing effect
  }
};
