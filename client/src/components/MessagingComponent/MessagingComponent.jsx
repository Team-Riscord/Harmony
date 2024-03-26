import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './MessagingComponent.css';  // Ensure you have a corresponding CSS file for styling

const socket = io('http://localhost:8800'); // Adjust this to your server's address and port

const MessagingComponent = () => {
    const navigate = useNavigate();
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const fetchMessages = async () => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                navigate('/login'); // Redirect non-logged users to login page
                return;
            }
    
            try {
                const response = await fetch('http://localhost:8800/messages'); // Adjust this if your API endpoint is different
                const data = await response.json();
                if (response.ok) {
                    setMessages(data.reverse()); // Reverse the order of fetched messages
                } else {
                    throw new Error(data.message || 'Could not fetch messages');
                }
            } catch (error) {
                console.error('Fetch messages error:', error);
            }
        };
    
        fetchMessages();

        socket.on('receive_message', (newMessage) => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [navigate]); // Add other dependencies as needed
const sendMessage = () => {
    if (currentMessage.trim() !== '') {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const now = new Date().toISOString(); // Current time for optimistic UI update
        const messageData = {
            sender_id: userData.id,
            receiver_id: 2,
            message_text: currentMessage, // Frontend sends this
            created_at: now
        };
        socket.emit('send_message', messageData);
        setMessages(prevMessages => [...prevMessages, messageData]);
        setCurrentMessage('');
    }
};

    const formatMessageTime = (msg) => {
        const dateTimeString = msg.created_at || msg.time;
        return new Date(dateTimeString).toLocaleTimeString();
    };
    return (
        <div className="messaging-container">
            <div className="messages-list">
            {messages.map((msg, index) => (
                <div key={index} className={`message-item ${msg.sender_id === JSON.parse(localStorage.getItem('userData')).id ? 'my-message' : 'their-message'}`}>
                    <p>{msg.message_text}</p>
                    <span className="message-time">{formatMessageTime(msg)}</span>
                </div>
            ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    id="Meassage"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default MessagingComponent; 