import React, { useState } from 'react';
import './ChatPage.css';
import userLogo from './guy.jpg';
import botLogo from './bot.jpg';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const sendMessage = async () => {
        const userMessage = { text: inputText, isUser: true };
        setMessages([...messages, userMessage]);

        const response = await fetch('http://127.0.0.1:5000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: inputText })
        });

        const data = await response.json();
        const botMessage = { text: data.answer, isUser: false };
        setMessages(messages => [...messages, botMessage]);

        setInputText('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Chat section */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <h2 style={{ marginTop: '30px' }}>Find the restaurant that best matches your requests</h2>
                <div className="messages-container">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.isUser ? 'user' : 'bot'}`}
                        >
                            <img
                                src={message.isUser ? userLogo : botLogo}
                                alt={message.isUser ? 'User' : 'Bot'}
                                className="avatar"
                            />
                            <div className="message-text">{message.text}</div>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your preferences... (cuisine style, city/ location...)"
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
