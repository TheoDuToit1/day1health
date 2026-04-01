import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageRenderer from './MessageRenderer';
import { StructuredMessage } from '../types/messageTypes';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | StructuredMessage;
  timestamp: Date;
}

interface ChatWidgetProps {
  apiUrl?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  welcomeMessage?: string;
  size?: 'compact' | 'large';
}

export default function ChatWidget({
  apiUrl = '/api/chat',
  position = 'bottom-right',
  theme = 'light',
  welcomeMessage = "Hi! I'm here to help you find the perfect health plan. What can I help you with today?",
  size = 'compact',
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: uuidv4(),
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, welcomeMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: textToSend,
          context: {
            currentPage: window.location.pathname,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Log the response for debugging
      console.log('API Response:', data);

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.reply, // This is now a StructuredMessage
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: {
          messageType: 'text',
          content: {
            text: "I'm sorry, I'm having trouble connecting right now. Please try again or call us at 0876 100 600."
          }
        },
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleAction = (action: string, data?: any) => {
    console.log('Action triggered:', action, data);
    // Handle different actions
    switch (action) {
      case 'capture_lead':
        sendMessage('I would like to get a quote');
        break;
      case 'show_comparison':
        sendMessage('Compare plans');
        break;
      case 'view_plan':
        sendMessage(`Tell me more about ${data?.plan}`);
        break;
      default:
        sendMessage(action.replace(/_/g, ' '));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 bottom-4' 
    : 'left-4 bottom-4';

  const themeClasses = theme === 'dark'
    ? 'bg-gray-800 text-white'
    : 'bg-white text-gray-900';

  const sizeClasses = size === 'large'
    ? 'w-[500px] h-[700px]'
    : 'w-96 h-[600px]';

  const buttonSizeClasses = size === 'large'
    ? 'p-5 text-lg'
    : 'p-4';

  const iconSizeClasses = size === 'large'
    ? 'w-7 h-7'
    : 'w-6 h-6';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full ${buttonSizeClasses} shadow-lg transition-all duration-200 flex items-center gap-2`}
          aria-label="Open chat"
        >
          <svg
            className={iconSizeClasses}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className={`font-medium ${size === 'large' ? 'text-lg' : ''}`}>Chat with us</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`${themeClasses} ${sizeClasses} rounded-lg shadow-2xl flex flex-col`}
        >
          {/* Header */}
          <div className={`bg-blue-600 text-white ${size === 'large' ? 'p-5' : 'p-4'} rounded-t-lg flex justify-between items-center`}>
            <div>
              <h3 className={`font-bold ${size === 'large' ? 'text-xl' : 'text-lg'}`}>Day1Health Assistant</h3>
              <p className={`${size === 'large' ? 'text-base' : 'text-sm'} text-blue-100`}>We're here to help!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded p-1"
              aria-label="Close chat"
            >
              <svg
                className={iconSizeClasses}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto ${size === 'large' ? 'p-5 space-y-5' : 'p-4 space-y-4'}`}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`${
                    message.role === 'user' 
                      ? 'max-w-[80%] bg-blue-600 text-white rounded-lg p-3' 
                      : 'max-w-[90%]'
                  }`}
                >
                  {message.role === 'user' ? (
                    <>
                      <p className={`${size === 'large' ? 'text-base' : 'text-sm'} whitespace-pre-wrap`}>{message.content as string}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </>
                  ) : (
                    <div className={`rounded-lg ${size === 'large' ? 'p-4' : 'p-3'} ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <MessageRenderer 
                        message={message.content}
                        onQuickReply={handleQuickReply}
                        onAction={handleAction}
                      />
                      <p className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`${size === 'large' ? 'p-5' : 'p-4'} border-t border-gray-200`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 rounded-lg ${size === 'large' ? 'px-5 py-3 text-base' : 'px-4 py-2'} border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className={`bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg ${size === 'large' ? 'px-5 py-3' : 'px-4 py-2'} transition-colors`}
                aria-label="Send message"
              >
                <svg
                  className={size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Day1Health AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
