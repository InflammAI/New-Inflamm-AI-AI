'use client';

import { useAI } from '@/contexts/AIContext';
import { Box, TextField, IconButton, Paper, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Button } from '@mui/material';
import { Send, SmartToy, Person } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChat = () => {
  const { messages, isTyping, sendMessage, clearConversation } = useAI();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    await sendMessage(input);
    setInput('');
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          InflammAI Assistant
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{
            bgcolor: 'action.hover',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <Box 
            component="span" 
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isTyping ? 'success.main' : 'text.disabled',
              display: 'inline-block'
            }} 
          />
          {isTyping ? 'AI is typing...' : 'Online'}
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          p: 2,
          bgcolor: 'background.default',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.2)',
          },
        }}
      >
        <List sx={{ width: '100%', maxWidth: '800px', mx: 'auto' }}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: message.sender === 'user' ? 100 : -100 }}
                transition={{ duration: 0.3 }}
              >
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    px: 0,
                    py: 1.5,
                  }}
                >
                  <ListItemAvatar 
                    sx={{
                      minWidth: 40,
                      alignSelf: 'flex-start',
                      ...(message.sender === 'user' && { ml: 1, mr: 0 }),
                    }}
                  >
                    {message.sender === 'ai' ? (
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                        <SmartToy />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ bgcolor: 'grey.500', width: 36, height: 36 }}>
                        <Person />
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      backgroundColor: message.sender === 'ai' ? 'primary.light' : 'grey.100',
                      color: message.sender === 'ai' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: message.sender === 'ai' 
                        ? '18px 18px 18px 4px' 
                        : '18px 18px 4px 18px',
                      ml: message.sender === 'ai' ? 0 : 'auto',
                      mr: message.sender === 'ai' ? 'auto' : 0,
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {message.text}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      display="block" 
                      textAlign="right"
                      mt={1}
                      color={message.sender === 'ai' ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </ListItem>
                {index < messages.length - 1 && <Divider variant="inset" component="li" sx={{ my: 1 }} />}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </List>
      </Box>
      
      <Box 
        component="form" 
        onSubmit={handleSend}
        sx={{ 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            multiline
            maxRows={4}
            disabled={isTyping}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                bgcolor: 'background.paper',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <IconButton 
            type="submit" 
            color="primary" 
            disabled={!input.trim() || isTyping}
            sx={{
              alignSelf: 'flex-end',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            <Send />
          </IconButton>
        </Box>
        <Box mt={1} textAlign="right">
          <Button 
            size="small" 
            color="inherit"
            onClick={clearConversation}
            disabled={messages.length <= 1}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              color: 'text.secondary',
              '&:hover': {
                textDecoration: 'underline',
                bgcolor: 'transparent',
              },
            }}
          >
            Clear conversation
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AIChat;
