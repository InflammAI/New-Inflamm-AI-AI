// src/constants/allowedHealthTopics.ts

/**
 * Allowed Health Topics for AI Chat System
 * Defines approved health topics that the AI can safely discuss
 * with evidence-based information and appropriate disclaimers
 */

export interface HealthTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  keywords: string[];
  requiresDisclaimer: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  relatedConditions: string[];
  evidenceLevel: 'strong' | 'moderate' | 'emerging';
}

export const ALLOWED_HEALTH_TOPICS: HealthTopic[] = [
  // General Health & Wellness
  {
    id: 'general-wellness',
    name: 'General Health & Wellness',
    category: 'General',
    description: 'Overall health maintenance, preventive care, and wellness strategies',
    keywords: ['health', 'wellness', 'prevention', 'lifestyle', 'healthy living'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: [],
    evidenceLevel: 'strong'
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Diet',
    category: 'Lifestyle',
    description: 'Balanced diet, nutrients, healthy eating patterns, and dietary guidelines',
    keywords: ['nutrition', 'diet', 'food', 'eating', 'nutrients', 'vitamins', 'minerals'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['diabetes', 'heart disease', 'obesity'],
    evidenceLevel: 'strong'
  },
  {
    id: 'exercise',
    name: 'Physical Activity & Exercise',
    category: 'Lifestyle',
    description: 'Exercise benefits, types of physical activity, fitness guidelines',
    keywords: ['exercise', 'fitness', 'workout', 'physical activity', 'sports', 'training'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['heart disease', 'diabetes', 'obesity', 'mental health'],
    evidenceLevel: 'strong'
  },
  {
    id: 'sleep',
    name: 'Sleep Health',
    category: 'Lifestyle',
    description: 'Sleep quality, sleep disorders, sleep hygiene, and rest importance',
    keywords: ['sleep', 'insomnia', 'rest', 'sleep hygiene', 'sleep quality'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['mental health', 'heart disease', 'immune function'],
    evidenceLevel: 'strong'
  },
  {
    id: 'stress-management',
    name: 'Stress Management',
    category: 'Mental Health',
    description: 'Stress reduction techniques, coping strategies, and mental wellness',
    keywords: ['stress', 'anxiety', 'relaxation', 'meditation', 'mindfulness', 'coping'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['anxiety disorders', 'depression', 'heart disease'],
    evidenceLevel: 'strong'
  },

  // Inflammation Related Topics
  {
    id: 'inflammation-basics',
    name: 'Inflammation Basics',
    category: 'Inflammation',
    description: 'What inflammation is, acute vs chronic inflammation, inflammatory response',
    keywords: ['inflammation', 'inflammatory', 'acute inflammation', 'chronic inflammation'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['arthritis', 'heart disease', 'diabetes', 'autoimmune diseases'],
    evidenceLevel: 'strong'
  },
  {
    id: 'anti-inflammatory-diet',
    name: 'Anti-inflammatory Diet',
    category: 'Inflammation',
    description: 'Foods that reduce inflammation, anti-inflammatory eating patterns',
    keywords: ['anti-inflammatory', 'diet', 'foods', 'nutrition inflammation', 'omega-3'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['arthritis', 'heart disease', 'autoimmune diseases'],
    evidenceLevel: 'moderate'
  },
  {
    id: 'arthritis',
    name: 'Arthritis & Joint Health',
    category: 'Musculoskeletal',
    description: 'Types of arthritis, joint health, pain management, mobility',
    keywords: ['arthritis', 'joint pain', 'joint health', 'rheumatoid arthritis', 'osteoarthritis'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['inflammation', 'autoimmune diseases', 'chronic pain'],
    evidenceLevel: 'strong'
  },

  // Cardiovascular Health
  {
    id: 'heart-health',
    name: 'Heart & Cardiovascular Health',
    category: 'Cardiovascular',
    description: 'Heart disease prevention, cardiovascular health, blood pressure, cholesterol',
    keywords: ['heart', 'cardiovascular', 'blood pressure', 'cholesterol', 'heart disease'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['inflammation', 'diabetes', 'obesity'],
    evidenceLevel: 'strong'
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure',
    category: 'Cardiovascular',
    description: 'Blood pressure management, hypertension, monitoring, lifestyle factors',
    keywords: ['blood pressure', 'hypertension', 'high blood pressure', 'bp'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['heart disease', 'kidney disease', 'stroke'],
    evidenceLevel: 'strong'
  },

  // Metabolic Health
  {
    id: 'diabetes-prevention',
    name: 'Diabetes Prevention & Management',
    category: 'Metabolic',
    description: 'Type 2 diabetes prevention, blood sugar management, lifestyle interventions',
    keywords: ['diabetes', 'blood sugar', 'glucose', 'insulin', 'prediabetes'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['heart disease', 'obesity', 'inflammation'],
    evidenceLevel: 'strong'
  },
  {
    id: 'weight-management',
    name: 'Weight Management',
    category: 'Metabolic',
    description: 'Healthy weight management, obesity prevention, metabolic health',
    keywords: ['weight', 'obesity', 'BMI', 'weight loss', 'metabolism'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['diabetes', 'heart disease', 'joint problems'],
    evidenceLevel: 'strong'
  },

  // Mental Health
  {
    id: 'mental-health-basics',
    name: 'Mental Health Basics',
    category: 'Mental Health',
    description: 'Mental health awareness, emotional well-being, psychological health',
    keywords: ['mental health', 'emotional health', 'psychological well-being', 'mood'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['stress', 'anxiety', 'depression'],
    evidenceLevel: 'strong'
  },
  {
    id: 'anxiety-management',
    name: 'Anxiety Management',
    category: 'Mental Health',
    description: 'Anxiety symptoms, coping strategies, relaxation techniques',
    keywords: ['anxiety', 'worry', 'panic', 'nervousness', 'anxiety management'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['stress', 'depression', 'mental health'],
    evidenceLevel: 'strong'
  },

  // Immune System
  {
    id: 'immune-health',
    name: 'Immune System Health',
    category: 'Immune',
    description: 'Immune function, immune support, infection prevention',
    keywords: ['immune', 'immunity', 'infection', 'immune system', 'resistance'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['inflammation', 'autoimmune diseases', 'infections'],
    evidenceLevel: 'moderate'
  },

  // Preventive Health
  {
    id: 'preventive-care',
    name: 'Preventive Health Care',
    category: 'Preventive',
    description: 'Health screenings, check-ups, preventive measures, early detection',
    keywords: ['prevention', 'screening', 'check-up', 'early detection', 'preventive care'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: [],
    evidenceLevel: 'strong'
  },
  {
    id: 'vaccinations',
    name: 'Vaccinations & Immunizations',
    category: 'Preventive',
    description: 'Vaccine benefits, immunization schedules, disease prevention',
    keywords: ['vaccine', 'vaccination', 'immunization', 'shots', 'disease prevention'],
    requiresDisclaimer: true,
    riskLevel: 'low',
    relatedConditions: ['infectious diseases'],
    evidenceLevel: 'strong'
  },

  // Women's Health
  {
    id: 'womens-health-basics',
    name: 'Women\'s Health Basics',
    category: 'Women\'s Health',
    description: 'General women\'s health topics, reproductive health, hormonal health',
    keywords: ['women\'s health', 'female health', 'reproductive health', 'hormones'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['hormonal disorders', 'reproductive conditions'],
    evidenceLevel: 'strong'
  },

  // Men's Health
  {
    id: 'mens-health-basics',
    name: 'Men\'s Health Basics',
    category: 'Men\'s Health',
    description: 'General men\'s health topics, prostate health, testosterone',
    keywords: ['men\'s health', 'male health', 'prostate', 'testosterone'],
    requiresDisclaimer: true,
    riskLevel: 'medium',
    relatedConditions: ['prostate conditions', 'hormonal disorders'],
    evidenceLevel: 'strong'
  }
];

// Categories for organization
export const HEALTH_CATEGORIES = {
  'General': 'General Health & Wellness',
  'Lifestyle': 'Lifestyle & Prevention',
  'Mental Health': 'Mental & Emotional Health',
  'Inflammation': 'Inflammation & Immune Health',
  'Cardiovascular': 'Heart & Blood Vessels',
  'Metabolic': 'Metabolism & Energy',
  'Musculoskeletal': 'Bones, Joints & Muscles',
  'Immune': 'Immune System',
  'Preventive': 'Preventive Care',
  'Women\'s Health': 'Women\'s Specific Health',
  'Men\'s Health': 'Men\'s Specific Health'
};

// Risk level definitions
export const RISK_LEVELS = {
  'low': 'General wellness information with minimal risk',
  'medium': 'Health conditions requiring professional guidance',
  'high': 'Serious health conditions requiring immediate medical attention'
};

// Evidence level definitions
export const EVIDENCE_LEVELS = {
  'strong': 'Well-established scientific consensus',
  'moderate': 'Growing evidence with some consensus',
  'emerging': 'Early research with limited consensus'
};

// Helper functions
export function isAllowedTopic(query: string): boolean {
  const lowercaseQuery = query.toLowerCase();
  return ALLOWED_HEALTH_TOPICS.some(topic => 
    topic.keywords.some(keyword => 
      lowercaseQuery.includes(keyword.toLowerCase())
    )
  );
}

export function findRelevantTopics(query: string): HealthTopic[] {
  const lowercaseQuery = query.toLowerCase();
  return ALLOWED_HEALTH_TOPICS.filter(topic =>
    topic.keywords.some(keyword => 
      lowercaseQuery.includes(keyword.toLowerCase())
    )
  );
}

export function getTopicById(id: string): HealthTopic | undefined {
  return ALLOWED_HEALTH_TOPICS.find(topic => topic.id === id);
}

export function getTopicsByCategory(category: string): HealthTopic[] {
  return ALLOWED_HEALTH_TOPICS.filter(topic => topic.category === category);
}

export function getHighRiskTopics(): HealthTopic[] {
  return ALLOWED_HEALTH_TOPICS.filter(topic => topic.riskLevel === 'high');
}

export function getTopicsNeedingDisclaimer(): HealthTopic[] {
  return ALLOWED_HEALTH_TOPICS.filter(topic => topic.requiresDisclaimer);
}

// Default disclaimer text
export const DEFAULT_MEDICAL_DISCLAIMER = 
  "This information is for educational purposes only and should not replace professional medical advice. " +
  "Always consult with qualified healthcare providers for personalized medical guidance, diagnosis, or treatment. " +
  "In case of medical emergency, contact emergency services immediately.";

// Emergency warning keywords
export const EMERGENCY_KEYWORDS = [
  'emergency', 'suicide', 'self harm', 'overdose', 'chest pain', 'difficulty breathing',
  'severe bleeding', 'loss of consciousness', 'stroke symptoms', 'heart attack'
];

export function requiresEmergencyResponse(query: string): boolean {
  const lowercaseQuery = query.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => 
    lowercaseQuery.includes(keyword)
  );
}

export const EMERGENCY_RESPONSE = 
  "If you are experiencing a medical emergency, please call emergency services immediately (911 in the US) " +
  "or go to the nearest emergency room. This is not a substitute for emergency medical care.";
