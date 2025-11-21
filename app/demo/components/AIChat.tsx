import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Symptom = {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
};

type Condition = {
  id: string;
  name: string;
  likelihood: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
};

const POSSIBLE_CONDITIONS: Record<string, Condition> = {
  cold: {
    id: '1',
    name: 'Common Cold',
    likelihood: 'medium',
    description: 'Viral infection of the nose and throat.',
    recommendations: ['Rest', 'Stay hydrated', 'Over-the-counter cold medicine']
  },
  flu: {
    id: '2',
    name: 'Influenza (Flu)',
    likelihood: 'high',
    description: 'Viral infection that attacks the respiratory system.',
    recommendations: ['Rest', 'Antiviral medication if caught early', 'Stay hydrated']
  },
  migraine: {
    id: '3',
    name: 'Migraine',
    likelihood: 'medium',
    description: 'Recurrent headache that can cause severe throbbing pain.',
    recommendations: ['Rest in a quiet, dark room', 'Over-the-counter pain relievers', 'Stay hydrated']
  },
  anxiety: {
    id: '4',
    name: 'Anxiety',
    likelihood: 'low',
    description: 'Feelings of worry, anxiety, or fear that are strong enough to interfere with daily activities.',
    recommendations: ['Practice deep breathing', 'Exercise regularly', 'Consider speaking with a professional']
  }
};

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  file?: File | null;
};

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSymptomsChecker, setShowSymptomsChecker] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [possibleConditions, setPossibleConditions] = useState<Condition[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: 'Hello! I\'m your AI Health Assistant. How can I help you today?',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && !selectedFile) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      ...(selectedFile && { file: selectedFile }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    const fileWasSelected = !!selectedFile;
    setSelectedFile(null);
    setIsTyping(true);

    // Simulate AI response after a short delay
    setTimeout(() => {
      let response = '';
      
      if (fileWasSelected) {
        // Special response when a file is uploaded
        response = "I see you've shared a health file. I can help analyze this data. " + 
                  "Would you like me to provide insights about this information?\n\n" +
                  "You can also send this health data to `0xd084...F4D1`";
      } else {
        // Regular responses for text messages
        const aiResponses = [
          "I understand you're interested in your health data. Let me analyze your recent activity...",
          "Based on your health metrics, I can provide some personalized recommendations.",
          "That's a great question! Let me check your health history to give you the best advice.",
          "I've analyzed your sleep patterns and activity levels. Would you like some suggestions for improvement?",
          "Your recent workout was impressive! Would you like to know how it contributed to your health goals?"
        ];
        response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const addSymptom = () => {
    if (!currentSymptom.trim()) return;
    
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: currentSymptom,
      severity: 'moderate',
      duration: '1-3 days'
    };
    
    setSymptoms(prev => [...prev, newSymptom]);
    setCurrentSymptom('');
    
    // Simulate finding possible conditions based on symptoms
    setTimeout(() => {
      const conditions = Object.values(POSSIBLE_CONDITIONS);
      const randomConditions = [];
      const count = Math.min(2 + Math.floor(Math.random() * 2), conditions.length);
      
      const usedIndices = new Set();
      while (randomConditions.length < count) {
        const index = Math.floor(Math.random() * conditions.length);
        if (!usedIndices.has(index)) {
          randomConditions.push(conditions[index]);
          usedIndices.add(index);
        }
      }
      
      setPossibleConditions(randomConditions);
    }, 1000);
  };
  
  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
    if (symptoms.length <= 1) {
      setPossibleConditions([]);
    }
  };
  
  const toggleSymptomsChecker = () => {
    setShowSymptomsChecker(!showSymptomsChecker);
    if (!showSymptomsChecker) {
      setSymptoms([]);
      setPossibleConditions([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">AI Health Assistant</h2>
            <p className="text-sm text-orange-100">Ask me anything about your health data</p>
          </div>
          <button
            onClick={toggleSymptomsChecker}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              showSymptomsChecker 
                ? 'bg-white text-orange-600' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {showSymptomsChecker ? 'Hide Symptoms Checker' : 'Check Symptoms'}
          </button>
        </div>
      </div>

      {/* Symptoms Checker */}
      {showSymptomsChecker && (
        <div className="border-b border-gray-200 p-4 bg-orange-50">
          <h3 className="font-medium text-orange-800 mb-3">Symptoms Checker</h3>
          
          <div className="flex mb-3">
            <input
              type="text"
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSymptom()}
              placeholder="Enter a symptom (e.g., headache, fever)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={addSymptom}
              className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
          
          {symptoms.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium text-gray-700">Your Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center bg-white px-3 py-1 rounded-full text-sm border border-orange-200">
                    <span>{symptom.name}</span>
                    <button 
                      onClick={() => removeSymptom(symptom.id)}
                      className="ml-2 text-orange-500 hover:text-orange-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {possibleConditions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Possible Conditions:</h4>
              <div className="space-y-3">
                {possibleConditions.map((condition) => (
                  <div key={condition.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-gray-900">{condition.name}</h5>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        condition.likelihood === 'high' ? 'bg-red-100 text-red-800' :
                        condition.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {condition.likelihood === 'high' ? 'High Likelihood' :
                         condition.likelihood === 'medium' ? 'Moderate Likelihood' : 'Low Likelihood'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Recommendations:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {condition.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Note:</span> This is not a diagnosis. Please consult a healthcare professional for medical advice.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Messages */}
      <div className={`flex-1 p-4 overflow-y-auto ${showSymptomsChecker ? 'h-1/2' : 'h-full'} bg-gray-50`}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow rounded-tl-none'
                  }`}
                >
                  {message.file ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">📎 {message.file.name}</p>
                      <p className="text-xs text-orange-100">Click to view file</p>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">
                      {message.content.split('`').map((part, i) => 
                        i % 2 === 0 ? part : <code key={i} className="bg-gray-100 px-1 rounded">{part}</code>
                      )}
                    </div>
                  )}
                  <p className={`text-xs mt-1 text-right ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-1 p-2 w-16 bg-white rounded-lg shadow"
              >
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isTyping}
          />
          <label className="flex items-center px-3 py-2 text-gray-600 hover:text-orange-500 cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </label>
          <button
            type="submit"
            disabled={!inputValue.trim() && !selectedFile || isTyping}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transform rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-xs text-center text-gray-500">
          Ask about your health data, activity, or get personalized recommendations
        </p>
      </form>
    </div>
  );
}
