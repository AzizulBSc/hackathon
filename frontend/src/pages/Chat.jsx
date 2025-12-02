import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await chatService.getHistory();
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);

    // Optimistically add user message
    const tempUserMsg = {
      id: Date.now(),
      message: userMessage,
      is_bot_response: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await chatService.sendMessage(userMessage);
      // Replace temp message with real one and add bot response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { ...response.data.userMessage, is_bot_response: false },
        { ...response.data.botResponse, is_bot_response: true },
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: 'Sorry, I encountered an error. Please try again.',
          is_bot_response: true,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear chat history?')) {
      try {
        await chatService.clearHistory();
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear chat history:', error);
      }
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="page-header">
        <h1>AI Assistant</h1>
        <button onClick={handleClearHistory} className="btn btn-secondary">
          Clear History
        </button>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h2>🤖 SmartSupport AI</h2>
          <p>Ask me anything about our services, common issues, or how to use the platform!</p>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>👋</p>
              <h3>Welcome to SmartSupport AI!</h3>
              <p style={{ marginTop: '10px' }}>
                I can help you with common questions, ticket information, and general support.
              </p>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['How do I create a ticket?', 'What are your support hours?', 'Help with password reset'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '20px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.is_bot_response ? 'bot' : 'user'}`}>
              <div className="chat-bubble">
                {msg.message}
              </div>
              <span className="chat-time">{formatTime(msg.created_at)}</span>
            </div>
          ))}

          {loading && (
            <div className="chat-message bot">
              <div className="chat-bubble">
                <span style={{ opacity: 0.7 }}>Typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !inputValue.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
