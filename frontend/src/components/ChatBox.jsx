import React, { useState, useRef, useEffect } from 'react';
import '../css/Chatbox.css';
import assistantImg from '../img/Customer.png';

const ChatBox = () => {
  // Chat messages ka state - ye sab messages store karta hai
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m Eva, your intelligent shopping assistant. How can I help you today?', suggestions: ['How do I place an order?', 'What payment methods do you accept?', 'How can I track my order?', 'How do I contact support?'] }
  ]);

  // User input ka state - jo user type karega
  const [input, setInput] = useState('');

  // Typing indicator ka state - jab Eva type kar rahi hai
  const [isTyping, setIsTyping] = useState(false);

  // Suggestions ka state - Eva ke suggestions store karta hai
  const [suggestions, setSuggestions] = useState([]);

  // Online/offline status ka state - server connected hai ya nahi
  const [isOnline, setIsOnline] = useState(true);

  // Connection status ka state - checking, online, offline
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Chat box ka reference - auto scroll ke liye
  const chatBoxRef = useRef(null);

  // Server connection check karta hai har 30 seconds mein
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Server se suggestions fetch karke check karta hai connection
        const response = await fetch('http://localhost:5000/chat/suggestions', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          setIsOnline(true);
          setConnectionStatus('online');
        } else {
          setIsOnline(false);
          setConnectionStatus('offline');
        }
      } catch (error) {
        // Agar error aata hai to offline mark karta hai
        setIsOnline(false);
        setConnectionStatus('offline');
      }
    };

    // Pehle ek baar check karta hai
    checkConnection();

    // Har 30 seconds mein check karta hai
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  // Chat box ko automatically scroll karta hai bottom pe
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages, isTyping]);

  // Clear chat button ka function - sab messages delete kar deta hai
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([
        { sender: 'bot', text: 'Chat history cleared! How can I help you today?', suggestions: ['How do I place an order?', 'What payment methods do you accept?', 'How can I track my order?', 'How do I contact support?'] }
      ]);
    }
  };

  // Message send karne ka function - user ka message server ko bhejta hai
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Agar input empty hai to kuch nahi karta

    // User ka message add karta hai chat mein
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); // Input field ko clear karta hai
    setIsTyping(true); // Typing indicator show karta hai

    try {
      // Server ko message bhejta hai
      const res = await fetch('http://localhost:5000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();

      // 1 second delay ke baad Eva ka reply show karta hai
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: data.reply,
          suggestions: data.suggestions || []
        }]);
      }, 1000);
    } catch (error) {
      // Agar error aata hai to error message show karta hai
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, something went wrong! Please try again.',
        suggestions: ['How do I place an order?', 'Contact support', 'Track my order']
      }]);
    }
  };

  // Suggestion click karne ka function - suggestion ko input mein daalta hai
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  // Quick action buttons ka function - predefined questions ke liye
  const handleQuickAction = async (action) => {
    // Different actions ke liye different responses
    const actionMessages = {
      'How do I place an order?': 'order',
      'What payment methods do you accept?': 'payment',
      'How can I track my order?': 'tracking',
      'How do I request a refund?': 'refund',
      'How do I cancel an order?': 'cancel',
      'How do I update my profile?': 'profile',
      'What are your delivery options?': 'delivery',
      'How do I contact support?': 'contact'
    };

    // User ka message add karta hai
    const userMsg = { sender: 'user', text: action };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Server ko action bhejta hai
      const res = await fetch('http://localhost:5000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: action })
      });
      const data = await res.json();

      // Eva ka reply show karta hai
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: data.reply,
          suggestions: data.suggestions || []
        }]);
      }, 1000);
    } catch (error) {
      // Error handling
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, something went wrong! Please try again.',
        suggestions: ['How do I place an order?', 'Contact support', 'Track my order']
      }]);
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Left side - Eva ki image aur info */}
      <div className="chat-left">
        <img src={assistantImg} alt="Assistant" className="assistant-img" />
        <div className="assistant-info">
          <h3>Eva</h3>
          <p>Your AI Shopping Assistant</p>
          {/* Online/offline status indicator */}
          <div className="status-indicator">
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
            {connectionStatus === 'checking' ? 'Checking...' : isOnline ? 'Online' : 'Offline'}
          </div>
          {/* Connection warning agar offline hai */}
          {!isOnline && (
            <div className="connection-warning">
              ⚠️ Connection issues detected
            </div>
          )}
        </div>
      </div>

      {/* Right side - Chat container */}
      <div className="chat-container">
        {/* Chat header - title aur clear button */}
        <div className="chat-header">
          <div className="header-content">
            <span className="header-icon">💬</span>
            <span>Customer Support</span>
            {/* Offline badge agar offline hai */}
            {!isOnline && <span className="offline-badge">Offline</span>}
          </div>
          <div className="header-actions">
            {/* Clear chat button */}
            <button
              className="action-btn"
              title="Clear Chat"
              onClick={handleClearChat}
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Chat messages area - sab messages yahan show hote hain */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              <div className="message-content">
                {msg.text}
              </div>
              {/* Eva ke suggestions agar hain */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="message-suggestions">
                  {msg.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-btn"
                      onClick={() => handleQuickAction(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator - jab Eva type kar rahi hai */}
          {isTyping && (
            <div className="chat-message bot typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* Quick action buttons - common questions ke liye */}
        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('How do I place an order?')}
          >
            📦 Order Help
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('What payment methods do you accept?')}
          >
            💳 Payment
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('How can I track my order?')}
          >
            📍 Track Order
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('How do I contact support?')}
          >
            🆘 Support
          </button>
        </div>

        {/* Input form - user message type karne ke liye */}
        <form onSubmit={handleSend} className="chat-input-form">
          <div className="input-wrapper">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isOnline ? "Type your message..." : "Chat is offline..."}
              className="chat-input"
              disabled={!isOnline} // Offline hai to disabled
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!input.trim() || !isOnline} // Empty ya offline hai to disabled
            >
              ➤
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
