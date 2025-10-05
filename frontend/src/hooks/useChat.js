import { useState, useCallback, useEffect } from 'react';
import { airQualityAPI } from '../services/api';
import geminiService from '../services/geminiService';
import chatService from '../services/chatService';

export const useChat = (selectedCity) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize chat session when city is selected
  const initializeChat = useCallback(async () => {
    if (!selectedCity || isInitialized) return;

    try {
      setIsTyping(true);
      
      // Get current air quality data for the selected city
      const response = await airQualityAPI.getLocationData(selectedCity);
      const data = response.data?.data || response.data;
      
      setCurrentData(data);
      
      // Create welcome message
      const welcomeMessage = chatService.createWelcomeMessage(selectedCity, data);
      
      setMessages([welcomeMessage]);
      setIsInitialized(true);
      
      // Check Gemini service health
      const serviceHealth = await geminiService.checkServiceHealth();
      if (!serviceHealth.available) {
        console.warn('Gemini service unavailable, using fallback responses');
      }
      
    } catch (error) {
      console.error('Error initializing chat:', error);
      const errorMessage = {
        id: Date.now(),
        text: `Hello! I'm your AirAlert AI assistant for ${selectedCity}. I'm ready to help with air quality questions! 🌬️`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };
      setMessages([errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [selectedCity, isInitialized]);

  // Send message to AI
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isTyping) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get fresh data if needed
      let dataToUse = currentData;
      if (!dataToUse || chatService.shouldRefreshData(currentData)) {
        try {
          const response = await airQualityAPI.getLocationData(selectedCity);
          dataToUse = response.data?.data || response.data;
          setCurrentData(dataToUse);
        } catch (error) {
          console.warn('Failed to refresh data, using cached data:', error);
        }
      }

      // Process message and get AI response
      const aiResponse = await chatService.processMessage(
        messageText,
        dataToUse,
        selectedCity,
        messages
      );

      // Add AI response
      const assistantMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        data: aiResponse.data,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        status: 'delivered',
        confidence: aiResponse.confidence,
        source: aiResponse.source
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update user message status
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. 🔄",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        status: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      // Update user message status to error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'error' }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, [currentData, selectedCity, messages, isTyping]);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentData(null);
    setIsInitialized(false);
    setChatSession(null);
  }, []);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    if (!selectedCity) return;

    try {
      setIsTyping(true);
      const response = await airQualityAPI.getLocationData(selectedCity);
      const data = response.data?.data || response.data;
      setCurrentData(data);

      // Add system message about data refresh
      const systemMessage = {
        id: Date.now(),
        text: `Data refreshed for ${selectedCity}`,
        sender: 'system',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsTyping(false);
    }
  }, [selectedCity]);

  // Get chat statistics
  const getChatStats = useCallback(() => {
    const userMessages = messages.filter(m => m.sender === 'user').length;
    const assistantMessages = messages.filter(m => m.sender === 'assistant').length;
    const totalMessages = userMessages + assistantMessages;
    
    return {
      totalMessages,
      userMessages,
      assistantMessages,
      averageResponseTime: 0, // Could be calculated
      sessionDuration: messages.length > 0 
        ? new Date() - new Date(messages[0].timestamp)
        : 0
    };
  }, [messages]);

  // Auto-refresh data every 10 minutes
  useEffect(() => {
    if (!selectedCity || !isInitialized) return;

    const interval = setInterval(() => {
      if (currentData && chatService.shouldRefreshData(currentData)) {
        refreshData();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [selectedCity, isInitialized, currentData, refreshData]);

  return {
    messages,
    isTyping,
    currentData,
    sendMessage,
    initializeChat,
    clearChat,
    refreshData,
    getChatStats,
    isInitialized
  };
};

export default useChat;
