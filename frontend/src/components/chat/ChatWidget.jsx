import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, MapPin, Send, Minimize2 } from 'lucide-react';
import CitySelector from './CitySelector';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [showCitySelector, setShowCitySelector] = useState(true);
  const messagesEndRef = useRef(null);

  const {
    messages,
    isTyping,
    sendMessage,
    initializeChat,
    clearChat
  } = useChat(selectedCity);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize chat when city is selected
  useEffect(() => {
    if (selectedCity && !showCitySelector) {
      initializeChat();
    }
  }, [selectedCity, showCitySelector, initializeChat]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCitySelector(false);
  };

  const handleCityChange = () => {
    setShowCitySelector(true);
    clearChat();
  };

  const handleSendMessage = (message) => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  // Chat window content
  const renderChatContent = () => {
    if (showCitySelector) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Select Your Location
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Choose a city in Goa to get personalized air quality insights
            </p>
            <CitySelector onCitySelect={handleCitySelect} />
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">AirAlert AI Assistant</h3>
                <p className="text-xs text-blue-100">
                  {selectedCity} • Air Quality Expert
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCityChange}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Change City"
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌬️</div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Hi! I'm your Air Quality Assistant
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Ask me about air quality, health recommendations, or outdoor activities in {selectedCity}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="text-xs text-gray-500">Try asking:</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Is it safe to exercise outside?",
                        "What's the current AQI?",
                        "Should I wear a mask today?"
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </>
        )}
      </>
    );
  };

  return (
    <>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6 mx-auto" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 sm:w-96 sm:h-[500px]">
          {renderChatContent()}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
