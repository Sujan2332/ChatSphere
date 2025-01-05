import React, { useState, useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../SocketContext';
import axios from 'axios';
import jwt_decode from 'jwt-decode';  
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "../styles/ChatRoom.css";

const ChatRoom = () => {
  const { chatId } = useParams();
  const socket = useContext(SocketContext);
  const { state } = useLocation();
  const receiverName = state?.receiverName;
  const [loading,setLoading] = useState(false)

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const firstRender = useRef(true);  // Track first render to avoid socket listener re-setup

  console.log(messages)
  const backend = import.meta.env.VITE_BACKEND;
 // Reference for the messages container
  const inputRef = useRef(null);
  const containerRef = useRef(null); // Create a reference for the message container

  useEffect(() => {
    // Scroll to the bottom of the container whenever messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]); 

  const navigate = useNavigate();

  // Function to scroll to the botto
  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // Handle case when token is not available
      navigate('/login'); // Redirect to login page if no token
      return;
    }

    // Fetch chat and participants details along with messages
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${backend}/api/chats/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setMessages(response.data.messages); // Set the fetched messages
          setParticipants(response.data.chat?.participants || []); // Set participants list safely
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally{
        setLoading(false)
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
  }, [socket, chatId, receiverName, messages]);

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      if (!token) return;

      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id;

      const sender = participants.find(p => p._id.toString() === userId.toString());
      const senderName = sender ? sender.name : 'You';

      socket.emit('sendMessage', { roomId: chatId, content: message, sender: userId });

      // Send the message to backend (to be saved in the database)
      await axios.post(`${backend}/api/chats/message`, { chatId, text: message }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleGoBack = () => {
    navigate(`/contact`); // Go back to the previous page
  };

  useEffect(() => {
    // scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Handle resize or keyboard appearance on mobile devices
    const handleKeyboardVisibility = () => {
      // Wait for the keyboard to be displayed and adjust the scroll position
      if (window.innerHeight < 500 && inputRef.current) {
        // Adjust the scroll position to keep the input bar visible when keyboard is open
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };

    // Listen for resize events (useful for detecting when the keyboard appears)
    window.addEventListener('resize', handleKeyboardVisibility);
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleKeyboardVisibility);
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <i className="fa-solid fa-arrow-left" style={{cursor:"pointer"}} onClick={handleGoBack}></i>
        {/* <i className="fa-regular fa-comment"></i> */}
        <span className="receiver-name">{receiverName}</span>
      </div>
      <div className="messages" ref={containerRef}> 
        {messages.map((msg, index) => {
          const isReceiver = msg.senderName === receiverName;
          return (
            <div key={index} className={`message ${isReceiver ? 'receiver' : 'sender'}`}>
              <div className="message-text">
                <strong>{msg.senderName || 'You'}</strong>: 
                <p>{msg.content || msg._doc.text || 'No content available'}</p>
              </div>
            </div>
          );
        })}
      </div>
      {loading && (
        <div className='loading' style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
          <div className='loader'></div>
        </div>
      )}
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }}}
        />
        <button onClick={handleSendMessage} className='send'><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  );
};

export default ChatRoom;
