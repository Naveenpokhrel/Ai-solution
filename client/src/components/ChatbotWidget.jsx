import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config/config.js';

export default function ChatbotWidget({ solutions, navigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to AI-Solutions. I am your virtual FAQ and service recommendation helper.", isBot: true },
    { id: 2, text: "Please click on one of the quick options below, or type your custom questions.", isBot: true, isOptions: true }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendText = async (textToSend) => {
    const userMsg = { id: Date.now(), text: textToSend, isBot: false };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const botMsg = { id: Date.now() + 1, text: data.reply, isBot: true };

      const replyLower = data.reply.toLowerCase();
      if (replyLower.includes('contact') || replyLower.includes('consultation') || replyLower.includes('inquiry')) {
        botMsg.hasNavAction = true;
        botMsg.navTarget = "contact";
        botMsg.navText = "Go to Contact Us Page";
      } else if (replyLower.includes('services') || replyLower.includes('solutions') || replyLower.includes('pricing')) {
        botMsg.hasNavAction = true;
        botMsg.navTarget = "services";
        botMsg.navText = "Go to Services Page";
      } else if (replyLower.includes('projects') || replyLower.includes('case studies') || replyLower.includes('portfolio')) {
        botMsg.hasNavAction = true;
        botMsg.navTarget = "projects";
        botMsg.navText = "Go to Projects Page";
      }

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot API failed, using fallback:", err);
      let reply = "I'm having trouble connecting to the AI brain right now. For technical discussions, please contact our team via the Contact Us page!";
      const textLower = textToSend.toLowerCase();
      if (textLower.includes('faq') || textLower.includes('hours') || textLower.includes('location')) {
        reply = "AI-Solutions is open Monday - Friday, 9:00 AM - 6:00 PM PST. Our office is located in Silicon Valley, CA.";
      } else if (textLower.includes('service') || textLower.includes('solutions')) {
        reply = "We offer cloud infrastructure setup, custom enterprise software, and predictive analytics. You can learn more on our Services page.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionClick = (opt) => {
    handleSendText(opt);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    handleSendText(userText);
  };

  return (
    <div className="chatbot-widget">
      {/* Bubble button */}
      <div
        className={`chatbot-bubble ${hasUnread ? 'chatbot-bubble-unread' : ''}`}
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
      >
        {isOpen ? '💬' : '🤖'}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-status-indicator"></span>
              AI-Solutions Support
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.isBot ? 'chat-msg-bot' : 'chat-msg-user'}`}>
                {msg.text}

                {/* Render quick options */}
                {msg.isOptions && (
                  <div className="chatbot-options">
                    <button className="chat-opt-btn" onClick={() => handleOptionClick("View Business FAQs")}>🕒 View Business FAQs</button>
                    <button className="chat-opt-btn" onClick={() => handleOptionClick("Recommend Services")}>💻 Recommend Services</button>
                    <button className="chat-opt-btn" onClick={() => handleOptionClick("How to Contact an Engineer")}>✉ How to Contact</button>
                  </div>
                )}

                {/* Render dynamic page switcher link */}
                {msg.hasNavAction && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => { navigateTo(msg.navTarget); setIsOpen(false); }}
                    >
                      {msg.navText}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg chat-msg-typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask a question..."
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chatbot-send-btn">➔</button>
          </form>
        </div>
      )}
    </div>
  );
}
