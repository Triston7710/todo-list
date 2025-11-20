import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      const userId = newSocket.id;
      setCurrentUserId(userId);
      newSocket.emit('join-chat', localStorage.getItem('token') || 'anonymous');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    newSocket.on('receive-message', (data) => {
      // Only add message if it's not from current user (to avoid duplicates)
      // If it's from current user, it's already added locally
      if (data.socketId !== newSocket.id) {
        setMessages(prev => [...prev, { ...data, isSent: false }]);
      }
    });

    newSocket.on('user-joined', (userId) => {
      console.log('User joined:', userId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    const messageData = {
      text: message,
      user: 'You',
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      isSent: true
    };

    // Add message immediately to show it as sent
    setMessages(prev => [...prev, messageData]);
    
    // Send to server
    socket.emit('send-message', messageData);
    setMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Real-time Chat</h2>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.isSent || msg.socketId === currentUserId;
            return (
              <div key={index} className={`message ${isOwnMessage ? 'sent-message' : 'received-message'}`}>
                <div className="message-header">
                  <span className="message-user">
                    {isOwnMessage ? '📤 You' : '📥 Other User'}
                  </span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;


