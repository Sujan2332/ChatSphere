import React, { useState, useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../SocketContext';
import axios from 'axios';
import jwt_decode from 'jwt-decode';  
import { useParams, useLocation } from 'react-router-dom';
import "../styles/ChatRoom.css";

const ChatRoom = ({ token }) => {
  const { chatId } = useParams();
  const socket = useContext(SocketContext);
  const { state } = useLocation();
  const receiverName = state?.receiverName;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  
  const firstRender = useRef(true);  // Track first render to avoid socket listener re-setup

  useEffect(() => {
    // Fetch chat and participants details along with messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setMessages(response.data.messages); // Set the fetched messages
          setParticipants(response.data.chat?.participants || []); // Set participants list safely
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    if (firstRender.current) {
      socket.emit('joinRoom', chatId);
      
      socket.on('receiveMessage', (newMessage) => {
        setMessages((prevMessages) => {
          const content = newMessage.content || 'No content available';
          const senderId = newMessage.sender;

          // Deriving the sender's name from the participants or messages list
          const senderName = prevMessages.find(msg => msg.sender === senderId)?.senderName || 'Unknown';
          
          // Determine if senderName matches the receiverName
          const displaySenderName = senderName === receiverName ? 'You' : senderName;

          // Avoid duplicates
          const messageExists = prevMessages.some(msg => msg.content === content && msg.senderName === displaySenderName);
          
          if (!messageExists) {
            return [...prevMessages, { senderName: displaySenderName, content }];
          }
          return prevMessages;
        });
      });

      firstRender.current = false;
    }

    fetchMessages();

    // Cleanup function to remove the socket listener when component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, chatId, token, receiverName,messages]);

  const handleSendMessage = async () => {
    try {
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id;

      const sender = participants.find(p => p._id.toString() === userId.toString());
      const senderName = sender ? sender.name : 'You';

      socket.emit('sendMessage', { roomId: chatId, content: message, sender: userId });

      // Send the message to backend (to be saved in the database)
      await axios.post('http://localhost:5000/api/chats/message', { chatId, text: message }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header" >
      <i class="fa-regular fa-comment"></i>
        <span className="receiver-name">{receiverName}</span> - <span className="sender-name">You</span>
      </div>

      <div className="messages">
        {messages.map((msg, index) => {
          const isReceiver = msg.senderName === receiverName;
          return (
            <div 
              key={index} 
              className={`message ${isReceiver ? 'receiver' : 'sender'}`}
            >
              <div className="message-text">
                <strong>{msg.senderName || 'You'}</strong>:<br/> {msg.content || msg._doc.text || 'No content available'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
