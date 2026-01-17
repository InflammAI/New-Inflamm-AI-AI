// Simple chat service using only internal wellness responses
import { getWellnessResponse, searchWellnessContent, type WellnessResponse } from './wellness-responses';
import { getWellnessAssessment, searchWellnessAssessment, type WellnessAssessmentResponse } from './wellness-assessment';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'assistant';
}

export interface ChatResponse {
  message: string;
  intent: string;
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  suggestions?: string[];
}

export class SimpleChatService {
  private messages: ChatMessage[] = [];
  
  constructor() {
    // Initialize with welcome message
    this.addMessage({
      id: 'welcome',
      content: 'Hi, I\'m Flammy! Your wellness assistant. I\'m here to help with health, sleep, stress, nutrition, and quick micro-transactions. How can I help today?',
      timestamp: Date.now(),
      sender: 'assistant'
    });
  }

  async handleIncomingMessage(message: string): Promise<ChatResponse> {
    // Add user message
    this.addMessage({
      id: `user_${Date.now()}`,
      content: message,
      timestamp: Date.now(),
      sender: 'user'
    });

    // Classify intent based on keywords
    const intent = this.classifyIntent(message);
    
    // Get appropriate response
    const response = this.generateResponse(intent, message);
    
    // Add assistant response
    this.addMessage({
      id: `assistant_${Date.now()}`,
      content: response.message,
      timestamp: Date.now(),
      sender: 'assistant'
    });

    return response;
  }

  private classifyIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Check for mini-offers first
    if (lowerMessage.includes('view mini-offers') || lowerMessage.includes('mini-offers')) {
      return 'mini-offers';
    }
    
    // Check for mini-offer purchase responses
    if (lowerMessage === 'yes' || lowerMessage === 'purchase' || lowerMessage === 'pls do') {
      return 'mini-offer-purchase-yes';
    }
    
    if (lowerMessage === 'no' || lowerMessage === "don't purchase" || lowerMessage === "don't") {
      return 'mini-offer-purchase-no';
    }
    
    // Check for wellness check first
    if (lowerMessage.includes('check my wellness') || lowerMessage.includes('check your wellness')) {
      return 'wellness-check';
    }
    
    // Check for wellness scale responses (1-5)
    if (lowerMessage === '1' || lowerMessage === '2' || lowerMessage === '3' || lowerMessage === '4' || lowerMessage === '5') {
      return 'wellness-scale';
    }
    
    // Check for quick stress tip requests
    if (lowerMessage.includes('give a quick stress tip') || 
        lowerMessage.includes('give me a quick stress tip') || 
        lowerMessage.includes('get a quick stress tip')) {
      return 'quick-stress-tip';
    }
    
    // Simple keyword-based intent classification
    if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || 
        lowerMessage.includes('discomfort') || lowerMessage.includes('feeling')) {
      return 'assessment';
    }
    if (lowerMessage.includes('sleep') || lowerMessage.includes('rest') || 
        lowerMessage.includes('tired') || lowerMessage.includes('insomnia')) {
      return 'sleep';
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || 
        lowerMessage.includes('worry') || lowerMessage.includes('overwhelm')) {
      return 'stress';
    }
    if (lowerMessage.includes('food') || lowerMessage.includes('eat') || 
        lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
      return 'nutrition';
    }
    if (lowerMessage.includes('exercise') || lowerMessage.includes('movement') || 
        lowerMessage.includes('activity') || lowerMessage.includes('fitness')) {
      return 'physical';
    }
    
    return 'general';
  }

  private generateResponse(intent: string, message: string): ChatResponse {
    // Handle wellness check initiation
    if (intent === 'wellness-check') {
      return {
        message: "Let's do a quick wellness check!\nHow are you feeling today on a scale of 1–5?",
        intent: 'wellness-check',
        riskLevel: 'low',
        suggestions: ['1 - Very low', '2 - Low', '3 - Okay', '4 - Good', '5 - Great']
      };
    }
    
    // Handle mini-offers
    if (intent === 'mini-offers') {
      return {
        message: "Here is today's mini-offer:\n\nRelax Pack – $0.99\n\nWant to purchase?",
        intent: 'mini-offers',
        riskLevel: 'low',
        suggestions: ['Yes, purchase', 'No, don\'t purchase', 'Transaction Terminated!']
      };
    }
    
    // Handle mini-offer purchase yes
    if (intent === 'mini-offer-purchase-yes') {
      return {
        message: "Transaction Successful!",
        intent: 'mini-offer-purchase-yes',
        riskLevel: 'low',
        suggestions: ['View more offers', 'Check your wellness']
      };
    }
    
    // Handle mini-offer purchase no
    if (intent === 'mini-offer-purchase-no') {
      return {
        message: "Transaction Terminated!",
        intent: 'mini-offer-purchase-no',
        riskLevel: 'low',
        suggestions: ['View more offers', 'Check your wellness']
      };
    }
    
    // Handle quick stress tip requests
    if (intent === 'quick-stress-tip') {
      return {
        message: "Here's a quick stress-relief tip:\nTry a slow inhale for 4 seconds, hold for 2, exhale for 6.\nWant me to guide you through it?",
        intent: 'quick-stress-tip',
        riskLevel: 'low',
        suggestions: ['Yes, guide me', 'No thanks', 'Another tip']
      };
    }
    
    // Handle wellness scale responses
    if (intent === 'wellness-scale') {
      const scale = parseInt(message);
      switch (scale) {
        case 1:
          return {
            message: "I'm really sorry you're feeling this low.\nLet's take things gently. Would you like a calming exercise, someone to talk to, or just a moment to breathe together?",
            intent: 'wellness-scale',
            riskLevel: 'medium',
            suggestions: ['Calming exercise', 'Talk to someone', 'Breathe together']
          };
        case 2:
          return {
            message: "Sounds like it's been a rough day.\nI'm here for you — would you prefer a quick mood-lift tip or a relaxing breathing technique?",
            intent: 'wellness-scale',
            riskLevel: 'low',
            suggestions: ['Mood-lift tip', 'Breathing technique']
          };
        case 3:
          return {
            message: "Alright, you're somewhere in the middle today. Let's aim to boost your energy a bit.\nWould you like a healthy snack idea, a stretch suggestion, or a stress tip?",
            intent: 'wellness-scale',
            riskLevel: 'low',
            suggestions: ['Healthy snack idea', 'Stretch suggestion', 'Stress tip']
          };
        case 4:
          return {
            message: "Nice! It sounds like you're doing pretty well today.\nWant a little something to keep the good momentum going?",
            intent: 'wellness-scale',
            riskLevel: 'low',
            suggestions: ['Keep momentum going', 'Wellness boost']
          };
        case 5:
          return {
            message: "Love to hear that! 💛 You're feeling great today.\nWant to keep that energy going with a quick challenge or a wellness boost?",
            intent: 'wellness-scale',
            riskLevel: 'low',
            suggestions: ['Quick challenge', 'Wellness boost']
          };
        default:
          return {
            message: "Please respond with a number from 1 to 5 to let me know how you're feeling.",
            intent: 'wellness-scale',
            riskLevel: 'low',
            suggestions: ['1 - Very low', '2 - Low', '3 - Okay', '4 - Good', '5 - Great']
          };
      }
    }
    
    // First check for assessment content
    const assessmentResults = searchWellnessAssessment(message);
    if (assessmentResults.length > 0) {
      return {
        message: assessmentResults[0].content,
        intent: 'assessment',
        riskLevel: 'low',
        suggestions: ['Continue monitoring your symptoms', 'Seek professional care if symptoms worsen']
      };
    }
    
    // Search for general wellness content
    const searchResults = searchWellnessContent(message);
    if (searchResults.length > 0) {
      return {
        message: searchResults[0].content,
        intent: intent,
        riskLevel: 'low',
        suggestions: this.getSuggestionsForIntent(intent)
      };
    }
    
    // Fallback to category-based response
    const categoryMap: Record<string, string> = {
      'sleep': 'sleep',
      'stress': 'mental',
      'nutrition': 'nutrition',
      'physical': 'physical',
      'general': 'physical'
    };
    
    const category = categoryMap[intent] || 'physical';
    const response = getWellnessResponse(category);
    
    if (response) {
      return {
        message: response.content,
        intent: intent,
        riskLevel: 'low',
        suggestions: this.getSuggestionsForIntent(intent)
      };
    }
    
    // Default fallback
    return {
      message: 'I\'m here to support your wellness journey. Could you tell me more about what you\'re experiencing so I can provide more specific guidance?',
      intent: 'general',
      riskLevel: 'low',
      suggestions: ['Try asking about sleep, stress, nutrition, or general wellness']
    };
  }

  private getSuggestionsForIntent(intent: string): string[] {
    const suggestions: Record<string, string[]> = {
      'assessment': ['Monitor your symptoms', 'Practice self-care', 'Seek professional help if needed'],
      'sleep': ['Maintain consistent sleep schedule', 'Create relaxing bedtime routine', 'Limit screen time before bed'],
      'stress': ['Practice deep breathing', 'Take regular breaks', 'Consider mindfulness exercises'],
      'nutrition': ['Stay hydrated', 'Eat balanced meals', 'Listen to your body\'s hunger cues'],
      'physical': ['Start with gentle movement', 'Find activities you enjoy', 'Listen to your body'],
      'general': ['Focus on small, consistent changes', 'Be patient with yourself', 'Celebrate progress']
    };
    
    return suggestions[intent] || suggestions['general'];
  }

  private addMessage(message: ChatMessage): void {
    this.messages.push(message);
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  clearMessages(): void {
    this.messages = [];
  }
}
