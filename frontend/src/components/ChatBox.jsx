import React, { useState, useRef, useEffect } from 'react';
import '../css/Chatbox.css';
import assistantImg from '../img/Customer.png';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m Ava, your virtual assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef(null); // ✅ define the actual ref

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('http://localhost:5000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      }, 600);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong!' }]);
    }

    setInput('');
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-left">
        <img src={assistantImg} alt="Assistant" className="assistant-img" />
      </div>

      <div className="chat-container">
        <div className="chat-header">💬 Customer Support</div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="chat-input-form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
