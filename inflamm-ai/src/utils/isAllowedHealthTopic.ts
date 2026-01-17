// src/utils/isAllowedHealthTopic.ts

import { ALLOWED_HEALTH_TOPICS, HealthTopic, EMERGENCY_KEYWORDS, requiresEmergencyResponse } from "../constants/allowedHealthTopics";

export function isAllowedHealthTopic(query: string): boolean {
  const q = query.toLowerCase();
  return ALLOWED_HEALTH_TOPICS.some(topic => q.includes(topic.name.toLowerCase()) || 
    topic.keywords.some(keyword => q.includes(keyword.toLowerCase()))
  );
}

/**
 * Health Topic Validation Utility
 * Determines if user queries are within allowed health topics
 * and provides safety checks for medical advice
 */

export interface TopicValidationResult {
  isAllowed: boolean;
  isEmergency: boolean;
  relevantTopics: HealthTopic[];
  riskLevel: 'low' | 'medium' | 'high';
  requiresDisclaimer: boolean;
  confidence: number; // 0-1 scale
  suggestedAction: 'respond' | 'redirect' | 'emergency' | 'decline';
  message?: string;
}

/**
 * Main validation function for health topics
 */
export function validateHealthTopic(query: string): TopicValidationResult {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for emergency situations first
  if (requiresEmergencyResponse(normalizedQuery)) {
    return {
      isAllowed: false,
      isEmergency: true,
      relevantTopics: [],
      riskLevel: 'high',
      requiresDisclaimer: true,
      confidence: 1.0,
      suggestedAction: 'emergency',
      message: 'This appears to be a medical emergency. Please call emergency services immediately or go to the nearest emergency room.'
    };
  }

  // Find relevant topics
  const relevantTopics = findRelevantTopics(normalizedQuery);
  
  // No relevant topics found
  if (relevantTopics.length === 0) {
    return {
      isAllowed: false,
      isEmergency: false,
      relevantTopics: [],
      riskLevel: 'low',
      requiresDisclaimer: false,
      confidence: 0.0,
      suggestedAction: 'decline',
      message: 'I can only provide information on specific health topics. Please ask about general health, nutrition, exercise, mental health, or preventive care.'
    };
  }

  // Calculate confidence based on keyword matches
  const confidence = calculateConfidence(normalizedQuery, relevantTopics);
  
  // Determine highest risk level among relevant topics
  const highestRiskLevel = getHighestRiskLevel(relevantTopics);
  
  // Check if any topic requires disclaimer
  const requiresDisclaimer = relevantTopics.some(topic => topic.requiresDisclaimer);
  
  // Determine suggested action based on risk and confidence
  const suggestedAction = determineSuggestedAction(highestRiskLevel, confidence);

  return {
    isAllowed: true,
    isEmergency: false,
    relevantTopics,
    riskLevel: highestRiskLevel,
    requiresDisclaimer,
    confidence,
    suggestedAction
  };
}

/**
 * Find topics relevant to the query
 */
function findRelevantTopics(query: string): HealthTopic[] {
  return ALLOWED_HEALTH_TOPICS.filter(topic => {
    // Check if any keyword matches
    const hasKeywordMatch = topic.keywords.some(keyword => 
      query.includes(keyword.toLowerCase())
    );
    
    // Check if topic name matches
    const hasNameMatch = query.includes(topic.name.toLowerCase());
    
    // Check if description contains relevant terms
    const hasDescriptionMatch = topic.description.toLowerCase().split(' ').some(word => 
      word.length > 4 && query.includes(word.toLowerCase())
    );
    
    return hasKeywordMatch || hasNameMatch || hasDescriptionMatch;
  });
}

/**
 * Calculate confidence score for topic matching
 */
function calculateConfidence(query: string, topics: HealthTopic[]): number {
  let totalMatches = 0;
  let totalKeywords = 0;
  
  topics.forEach(topic => {
    topic.keywords.forEach(keyword => {
      totalKeywords++;
      if (query.includes(keyword.toLowerCase())) {
        totalMatches++;
      }
    });
  });
  
  // Add weight for exact topic name matches
  topics.forEach(topic => {
    if (query.includes(topic.name.toLowerCase())) {
      totalMatches += 2; // Extra weight for name matches
    }
  });
  
  return totalKeywords > 0 ? Math.min(totalMatches / totalKeywords, 1.0) : 0;
}

/**
 * Get the highest risk level from relevant topics
 */
function getHighestRiskLevel(topics: HealthTopic[]): 'low' | 'medium' | 'high' {
  if (topics.some(topic => topic.riskLevel === 'high')) return 'high';
  if (topics.some(topic => topic.riskLevel === 'medium')) return 'medium';
  return 'low';
}

/**
 * Determine suggested action based on risk and confidence
 */
function determineSuggestedAction(
  riskLevel: 'low' | 'medium' | 'high', 
  confidence: number
): 'respond' | 'redirect' | 'emergency' | 'decline' {
  if (riskLevel === 'high') {
    return 'redirect'; // Redirect to professional care
  }
  
  if (confidence < 0.3) {
    return 'decline'; // Too low confidence, decline
  }
  
  if (riskLevel === 'medium' && confidence < 0.6) {
    return 'redirect'; // Medium risk with low confidence
  }
  
  return 'respond'; // Safe to respond
}

/**
 * Quick check if topic is allowed (boolean only)
 */
export function isTopicAllowed(query: string): boolean {
  const result = validateHealthTopic(query);
  return result.isAllowed && !result.isEmergency;
}

/**
 * Get relevant topics for a query
 */
export function getRelevantTopics(query: string): HealthTopic[] {
  const result = validateHealthTopic(query);
  return result.relevantTopics;
}

/**
 * Check if query requires medical disclaimer
 */
export function requiresMedicalDisclaimer(query: string): boolean {
  const result = validateHealthTopic(query);
  return result.requiresDisclaimer;
}

/**
 * Get risk level for a query
 */
export function getQueryRiskLevel(query: string): 'low' | 'medium' | 'high' {
  const result = validateHealthTopic(query);
  return result.riskLevel;
}

/**
 * Check if query is about emergency medical situation
 */
export function isEmergencyQuery(query: string): boolean {
  return requiresEmergencyResponse(query.toLowerCase());
}

/**
 * Filter inappropriate medical queries
 */
export function filterMedicalQuery(query: string): {
  filtered: boolean;
  reason?: string;
  action: 'respond' | 'redirect' | 'emergency' | 'decline';
} {
  const result = validateHealthTopic(query);
  
  return {
    filtered: !result.isAllowed || result.isEmergency,
    reason: result.message,
    action: result.suggestedAction
  };
}

/**
 * Suggest alternative phrasing for declined queries
 */
export function suggestAlternativePhrasing(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const suggestions: string[] = [];
  
  // Common patterns and their alternatives
  const alternatives = [
    {
      pattern: /diagnose|diagnosis|what do i have/,
      suggestions: ['general information about symptoms', 'when to see a doctor', 'common health conditions']
    },
    {
      pattern: /treatment|cure|how to treat/,
      suggestions: ['general management strategies', 'lifestyle approaches', 'medical treatment options overview']
    },
    {
      pattern: /prescription|medication|drug/,
      suggestions: ['medication information', 'drug interactions', 'general treatment approaches']
    },
    {
      pattern: /specific dose|dosage|how much/,
      suggestions: ['general dosage guidelines', 'medication safety', 'consulting healthcare providers']
    }
  ];
  
  alternatives.forEach(({ pattern, suggestions: alt }) => {
    if (pattern.test(normalizedQuery)) {
      suggestions.push(...alt);
    }
  });
  
  // Add general health topic suggestions
  if (suggestions.length === 0) {
    suggestions.push(
      'general health and wellness',
      'nutrition and healthy eating',
      'exercise and physical activity',
      'stress management',
      'sleep health',
      'preventive care'
    );
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
}

/**
 * Generate response based on validation result
 */
export function generateValidationResponse(result: TopicValidationResult): string {
  switch (result.suggestedAction) {
    case 'emergency':
      return '🚨 **MEDICAL EMERGENCY** 🚨\n\nPlease call emergency services immediately (911 in the US) or go to the nearest emergency room. Do not wait for online assistance in emergency situations.';
    
    case 'decline':
      const suggestions = suggestAlternativePhrasing('');
      return `I can only provide information on specific health topics. Try asking about:\n\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nRemember: I'm not a substitute for professional medical advice.`;
    
    case 'redirect':
      return `This topic requires professional medical guidance. While I can provide general information, please consult with a healthcare provider for personalized advice about ${result.relevantTopics[0]?.name.toLowerCase() || 'this health topic'}.`;
    
    case 'respond':
      return ''; // Empty response means proceed with normal response
      default:
        return 'I apologize, but I cannot provide information on this topic. Please consult with a healthcare professional.';
  }
}
