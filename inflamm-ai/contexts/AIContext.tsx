'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type AIContextType = {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
};

const AIContext = createContext<AIContextType | null>(null);

// Mock AI responses
const aiResponses = [
  "I've analyzed your health data. You're doing great with your step count today!",
  "Based on your sleep pattern, I recommend trying to go to bed 30 minutes earlier.",
  "Your heart rate looks good. Keep up the good work with your exercise routine!",
  "I see you've been consistent with your water intake. Great job!",
  "Would you like me to help you convert your health points to INFLAMM tokens?",
];

export const AIProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your InflammAI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Generate a response from the AI
  const generateAIResponse = useCallback((userMessage: string) => {
    // Simple keyword matching for demo purposes
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('token') || lowerMessage.includes('point')) {
      return "I can help you convert your health points to INFLAMM tokens. Would you like to proceed with the conversion?";
    } else if (lowerMessage.includes('step') || lowerMessage.includes('walk')) {
      return "Your step count is looking great today! Keep it up!";
    } else if (lowerMessage.includes('sleep')) {
      return "I notice your sleep duration is good, but you could improve sleep quality by maintaining a consistent sleep schedule.";
    } else if (lowerMessage.includes('heart') || lowerMessage.includes('rate')) {
      return "Your heart rate is within a healthy range. Regular exercise helps maintain good heart health.";
    } else if (lowerMessage.includes('water') || lowerMessage.includes('hydrat')) {
      return "You're doing well with hydration. Remember to drink water throughout the day.";
    } else {
      // Return a random response if no keywords match
      return aiResponses[Math.floor(Math.random() * aiResponses.length)];
    }
  }, []);

  // Send a message and get AI response
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate AI response
      const aiText = generateAIResponse(text);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  }, [generateAIResponse]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hello! I'm your InflammAI assistant. How can I help you today?",
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return (
    <AIContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearConversation,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === null) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
