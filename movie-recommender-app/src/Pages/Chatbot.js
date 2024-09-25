import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for send button
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat box whenever messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message, isUserMessage) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { text: message, isUserMessage }
    ]);
  };

  const sendMessage = async () => {
    if (inputValue.trim() !== '') {
      addMessage(inputValue, true); // Add user message to the chat
      const messageToSend = inputValue;
      setIsLoading(true); // Set loading state

      try {
        const response = await axios.post('http://localhost:5000/api/chat', { message: messageToSend });
        const botReply = response.data.response; // Adjusted based on your Flask API response
        addMessage(botReply, false); // Add bot reply to the chat
      } catch (error) {
        console.error(error);
        addMessage("Error sending message. Please try again.", false);
      } finally {
        setInputValue(''); // Clear the input
        setIsLoading(false); // Reset loading state
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mt-5">
      <h1 style={{ color: 'white' }}>Chat Bot</h1>
      <div className="chat-box mt-3" ref={chatBoxRef} style={{ height: '300px', overflowY: 'scroll', backgroundColor: '#f1f1f1', padding: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} className={`mt-3 p-3 rounded ${message.isUserMessage ? 'user-message' : 'bot-message'}`} style={{ backgroundColor: message.isUserMessage ? '#007bff' : '#484848', color: 'white' }}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="form-group mt-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Type your message here"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading} // Disable input during loading
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={sendMessage}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default Chat;
