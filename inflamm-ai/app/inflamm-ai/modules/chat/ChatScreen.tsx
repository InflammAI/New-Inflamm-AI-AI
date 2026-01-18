'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

// Simple mock chat service
const createChatService = () => ({
  handleIncomingMessage: async (message: string) => {
    // Check for wellness check trigger
    if (message.toLowerCase().includes('check your wellness')) {
      return {
        message: "Let's do a quick wellness check!\nHow are you feeling today on a scale of 1–5?\n\n1️⃣ Very low\n2️⃣ Low\n3️⃣ Somewhere in the middle\n4️⃣ Good\n5️⃣ Great"
      };
    }

    // Check for mini-offers trigger
    if (message.toLowerCase().includes('view mini-offers')) {
      return {
        message: "Here is today's mini-offer:\n\nRelax Pack – $0.99\n\nWant to purchase?"
      };
    }

    // Check for stress tip trigger
    if (message.toLowerCase().includes('quick stress tip') || 
        message.toLowerCase().includes('give a quick stress tip') || 
        message.toLowerCase().includes('give me a quick stress tip') || 
        message.toLowerCase().includes('get a quick stress tip')) {
      return {
        message: "Here's a quick stress-relief tip:\nTry a slow inhale for 4 seconds, hold for 2, exhale for 6.\n\nWant me to guide you through it?"
      };
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate contextual response
    const responses = [
      "I understand your concern. Based on what you've shared, it sounds like you're paying attention to your health, which is great. While I can't provide specific medical advice, I can suggest some general wellness practices that might help.",
      "Thank you for sharing that with me. It's always good to be proactive about health matters. Remember that I provide general information only, and you should consult with healthcare professionals for personalized advice.",
      "I appreciate you reaching out about this. Health concerns can be worrying, but taking steps to understand them is important. Consider keeping track of any patterns or changes you notice.",
      "That's a thoughtful question. Many people have similar health questions. While I can offer general wellness information, your healthcare provider would be the best person to give you personalized guidance.",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      message: `${randomResponse}\n\n*Disclaimer: This is general information only and not a substitute for professional medical advice. Please consult with healthcare providers for your specific health concerns.*`
    };
  }
});

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
}

interface VitalNotification {
  id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi, I\'m Flammy! Your wellness assistant. I\'m here to help with health, sleep, stress, nutrition, and quick micro-transactions. How can I help today?',
      timestamp: new Date(),
    },
  ]);
  const [suggestions] = useState<string[]>([
    'View mini-offers',
    'Check your wellness',
    'Get a quick stress tip'
  ]);
  const [showWellnessCheck, setShowWellnessCheck] = useState(false);
  const [wellnessResponse, setWellnessResponse] = useState<number | null>(null);
  const [showMiniOffer, setShowMiniOffer] = useState(false);
  const [offerPurchased, setOfferPurchased] = useState<boolean | null>(null);

  const handleWellnessResponse = (rating: number) => {
    setWellnessResponse(rating);
    setShowWellnessCheck(false);
    
    let response = '';
    switch (rating) {
      case 1:
        response = "I'm really sorry you're feeling this low.\nLet's take things gently. Would you like a calming exercise, someone to talk to, or just a moment to breathe together?";
        break;
      case 2:
        response = "Sounds like it's been a rough day.\nI'm here for you — would you prefer a quick mood-lift tip or a relaxing breathing technique?";
        break;
      case 3:
        response = "Alright, you're somewhere in the middle today.\nLet's aim to boost your energy a bit.\nWould you like a healthy snack idea, a stretch suggestion, or a stress tip?";
        break;
      case 4:
        response = "Nice! It sounds like you're doing pretty well today.\nWant a little something to keep the good momentum going?";
        break;
      case 5:
        response = "Love to hear That! 💛 You're feeling great today.\nWant to keep that energy going with a quick challenge or a wellness boost?";
        break;
      default:
        response = "Thank you for sharing! Let's work together to improve your wellness.";
    }
    
    const wellnessMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, wellnessMessage]);
  };

  const handleMiniOfferResponse = (response: string) => {
    const lowerResponse = response.toLowerCase();
    let purchaseResponse = '';
    
    if (lowerResponse.includes('yes') || lowerResponse.includes('purchase') || lowerResponse.includes('pls do')) {
      purchaseResponse = "Transaction Successful!";
      setOfferPurchased(true);
    } else if (lowerResponse.includes('no') || lowerResponse.includes('don\'t purchase') || lowerResponse.includes('don\'t')) {
      purchaseResponse = "Transaction Terminated!";
      setOfferPurchased(false);
    } else {
      purchaseResponse = "Please respond with 'Yes' or 'No' to proceed with the purchase.";
      return;
    }
    
    const offerMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: purchaseResponse,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, offerMessage]);
    setShowMiniOffer(false);
  };
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [includeVitals, setIncludeVitals] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [vitalNotifications, setVitalNotifications] = useState<VitalNotification[]>([
    {
      id: 'notif-1',
      type: 'Respiratory Rate',
      message: 'Decline in Respiratory Rate',
      severity: 'medium',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<ReturnType<typeof createChatService> | null>(null);

  useEffect(() => {
    // Initialize simple chat service
    chatServiceRef.current = createChatService();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendNotificationToChat = (notification: VitalNotification) => {
    const notificationMessage = `I've received an alert about my ${notification.type}: ${notification.message}. Can you help me understand what this might mean and what I should do?`;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: notificationMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setVitalNotifications(prev => prev.filter(n => n.id !== notification.id));
    
    // Trigger AI response
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're concerned about the ${notification.type.toLowerCase()} alert. A decline in respiratory rate can indicate several things, but it's important to consider the context:\n\n• Normal respiratory rate for adults is typically 12-20 breaths per minute\n• A lower rate might indicate improved respiratory efficiency or could be a concern depending on your baseline\n• If you're feeling well, this might not be alarming\n• However, if accompanied by symptoms like dizziness, shortness of breath, or confusion, it would be wise to consult a healthcare provider\n\n*This is general information only. Please consult with healthcare professionals for personalized medical advice.*`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateAIResponse = async (userInput: string): Promise<{ content: string }> => {
    try {
      console.log('Chat processing:', userInput);
      
      // Check if this is a wellness check response
      if (showWellnessCheck && wellnessResponse !== null) {
        // Handle wellness rating selection
        handleWellnessResponse(wellnessResponse);
        return { content: '' };
      }
      
      // Check if this is a mini-offer response
      if (showMiniOffer) {
        handleMiniOfferResponse(userInput);
        return { content: '' };
      }
      
      // Build conversation history with system prompt
      let prompt = `
User message:
"${userInput}"

Instructions:
- Be empathetic and calm
- Do NOT diagnose
- Explain in simple terms
- Suggest when to see a doctor
- Include safety disclaimer
`;

      // Add vitals context if enabled
      if (includeVitals) {
        const notification = vitalNotifications[0]; // Get the first notification
        if (notification) {
          prompt += `\nVitals alert: ${notification.message}`;
        }
      }

      // Add image context if uploaded
      if (selectedImage) {
        prompt += `\nUser uploaded an image related to symptoms.`;
      }

      const history = [
        {
          role: "system",
          content: "You are a compassionate health assistant. Provide general medical guidance only."
        },
        ...messages.slice(-10).map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          content: msg.content
        }))
      ];

      // Create an initial empty message for streaming
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      // Add the message immediately to start showing typing
      setMessages(prev => [...prev, assistantMessage]);

      let fullResponse = '';

      // Use simple chat service for wellness responses
      if (chatServiceRef.current) {
        const response = await chatServiceRef.current.handleIncomingMessage(userInput);
        
        // Update the message with the response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: response.message }
              : msg
          )
        );

        console.log('Response complete, response length:', response.message.length);

        // Validate the response
        if (!response.message || typeof response.message !== "string") {
          throw new Error("Invalid response");
        }

        return { content: response.message };
      }

      // Return empty response if no chat service
      return { content: '' };

    } catch (error) {
      console.error('Error in generateAIResponse:', error);
      return {
        content: "I'm having a little trouble connecting right now, but I'm still here for you! 🫂 Please don't let technical issues stop you from taking care of your health. If you're worried about something, it's always better to be safe and check with a healthcare provider.\n\nWhy don't you try asking me again? I'll do my best to help you sort through whatever's on your mind. Your health journey is important, and I'm honored to be part of it! 💪"
      };
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      // Generate AI response with NCBI integration
      await generateAIResponse(input);
      setIsTyping(false);
      
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m having some trouble with that question. Could you try asking it a different way? I\'m here to help with general health questions and can guide you on when to seek medical care.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setIsTyping(false);
    } 
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] relative md:h-full">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-gray-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-[var(--accent-orange)]" />
            <h1 className="text-xl font-semibold text-white">Health Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-20 md:pb-4">
          <AnimatePresence>
            {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white'
                    : 'bg-[var(--surface)] text-white border border-gray-800'
                }`}
              >
                {message.image && (
                  <div className="mb-2">
                    <img 
                      src={message.image} 
                      alt="Uploaded image" 
                      className="max-w-full h-auto rounded-lg"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-[var(--muted)]'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Suggestion buttons - show only after welcome message */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  if (suggestion === 'Check your wellness') {
                    setShowWellnessCheck(true);
                    setInput('Check your wellness');
                    // Trigger send after a brief delay to allow state update
                    setTimeout(() => {
                      const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
                      handleSend(formEvent);
                    }, 100);
                  } else if (suggestion === 'View mini-offers') {
                    setShowMiniOffer(true);
                    setInput('View mini-offers');
                    // Trigger send after a brief delay to allow state update
                    setTimeout(() => {
                      const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
                      handleSend(formEvent);
                    }, 100);
                  } else {
                    setInput(suggestion);
                    // Trigger send after a brief delay to allow state update
                    setTimeout(() => {
                      const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
                      handleSend(formEvent);
                    }, 100);
                  }
                }}
                className="px-4 py-2 bg-[var(--surface)] text-white border border-gray-800 rounded-lg hover:border-[var(--accent-orange)] transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Wellness Check UI */}
        {showWellnessCheck && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--surface)] border border-gray-800 rounded-2xl p-6 mx-4 max-w-md"
          >
            <h3 className="text-lg font-semibold text-white mb-4">How are you feeling today?</h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  onClick={() => setWellnessResponse(rating)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    wellnessResponse === rating
                      ? 'bg-[var(--accent-orange)] border-[var(--accent-orange)] text-white scale-105'
                      : 'bg-[var(--surface)] border-gray-800 text-gray-300 hover:border-[var(--accent-orange)] hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{rating}</div>
                    <div className="text-xs">
                      {rating === 1 && 'Very Low'}
                      {rating === 2 && 'Low'}
                      {rating === 3 && 'Somewhere in the middle'}
                      {rating === 4 && 'Good'}
                      {rating === 5 && 'Great'}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <div className="flex justify-center">
              <motion.button
                onClick={() => setShowWellnessCheck(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Skip
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Mini-offers UI */}
        {showMiniOffer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--surface)] border border-gray-800 rounded-2xl p-6 mx-4 max-w-md"
          >
            <div className="text-center mb-6">
              <div className="text-2xl mb-2">🛍️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Today's Mini-Offer</h3>
              <div className="bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] rounded-lg p-4 mb-4">
                <div className="text-white">
                  <div className="text-xl font-bold mb-1">Relax Pack</div>
                  <div className="text-2xl font-bold">$0.99</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">Want to purchase?</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => {
                    setInput('Yes');
                    setTimeout(() => {
                      const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
                      handleSend(formEvent);
                    }, 100);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Yes
                </motion.button>
                <motion.button
                  onClick={() => {
                    setInput('No');
                    setTimeout(() => {
                      const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
                      handleSend(formEvent);
                    }, 100);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  No
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-[var(--surface)] rounded-2xl px-4 py-3 border border-gray-800">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mobile Input */}
      <div className="flex-shrink-0 bg-[var(--surface)] border-t border-gray-800 md:hidden pb-4">
        <form onSubmit={handleSend} className="p-4">
          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-3 p-2 bg-[var(--bg)] rounded-lg border border-gray-800">
              <div className="flex items-center gap-2">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="w-12 h-12 object-cover rounded"
                />
                <span className="text-sm text-[var(--muted)] flex-1">Image selected</span>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what's on your mind... How are you feeling today?"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] text-white placeholder-[var(--muted)] border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
              disabled={isTyping}
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-3 rounded-lg bg-[var(--bg)] text-[var(--muted)] hover:text-white border border-gray-800 hover:border-gray-700 transition-colors focus:outline-none focus:border-[var(--accent-orange)]"
              disabled={isTyping}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 12 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </button>
            
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Desktop Input */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0">
        <form onSubmit={handleSend} className="p-4 pb-6 bg-[var(--surface)] border-t border-gray-800">
          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-3 p-2 bg-[var(--bg)] rounded-lg border border-gray-800">
              <div className="flex items-center gap-2">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="w-12 h-12 object-cover rounded"
                />
                <span className="text-sm text-[var(--muted)] flex-1">Image selected</span>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what's on your mind... How are you feeling today?"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] text-white placeholder-[var(--muted)] border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
              disabled={isTyping}
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-3 rounded-lg bg-[var(--bg)] text-[var(--muted)] hover:text-white border border-gray-800 hover:border-gray-700 transition-colors focus:outline-none focus:border-[var(--accent-orange)]"
              disabled={isTyping}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 12 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </button>
            
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};
