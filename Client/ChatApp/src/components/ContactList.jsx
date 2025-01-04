import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/ContactList.css";
import profile from "../assets/profile.jpg";

const ContactList = ({ setUser }) => {
  const [contacts, setContacts] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const backend = import.meta.env.VITE_BACKEND;

  const handleLogout = () => {
    setUser(null); // Clear the user state
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('user')
    navigate('/#/login'); // Navigate to login page
  };

  // Fetch the token from localStorage when the component mounts (only once)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');  // Redirect to login if no token found
    } else {
      setToken(storedToken);  // Set token in state if available
    }
  }, [navigate]);

  // Fetch contacts and available users when the token is available
  useEffect(() => {
    if (token) {
      const fetchContactsAndUsers = async () => {
        setLoading(true)
        try {
          // Fetch contacts
          const contactsResponse = await axios.get(`${backend}/api/users/contacts`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setContacts(contactsResponse.data.contacts);

          // Fetch available users
          const usersResponse = await axios.get(`${backend}/api/users/available`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAvailableUsers(usersResponse.data.users);
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally{
          setLoading(false)
        }
      };

      fetchContactsAndUsers();
    }
  }, [token]);  // This will run only when the token changes

  // Send an invitation to a user
  const sendInvitation = async (mobile) => {
    try {
      await axios.post(
        `${backend}/api/invitations/send`,
        { mobile },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Invitation sent!');
    } catch (err) {
      console.error('Error sending invitation:', err);
    }
  };

  // Start a chat with a user
  const startChat = async (userId, receiverName) => {
    try {
      const response = await axios.post(
        `${backend}/api/chats/createOrFetch`,
        { participantId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { chatId } = response.data;
      console.log('Navigating to chat room with chatId:', chatId, 'and receiverName:', receiverName);
      navigate(`/chat/${chatId}`, { state: { receiverName } });
    } catch (err) {
      console.error('Error starting chat:', err);
    }
  };

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  return (
    <div className='ContactList'>
      <div>
        <button className='logout' onClick={handleLogout}>
          <i className="fa-solid fa-power-off"></i>
        </button>
        <h2 style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px", marginBottom: "20px" }}>
          <svg width="40px" height="40px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="black" />
              </filter>
            </defs>
            <rect width="48" height="48" fill="white" fill-opacity="0.01" />
            <circle cx="24" cy="24" r="20" stroke="white" stroke-width="4" stroke-linejoin="round" filter="url(#f1)" />
            <path d="M4.40002 20C6.2531 29.129 14.3242 36 24 36C33.6758 36 41.7468 29.129 43.5999 20" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)" />
            <path d="M5.66418 16C8.7504 23.0636 15.7987 28 24 28C32.2013 28 39.2496 23.0636 42.3358 16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)" />
            <path d="M7.99854 12C11.6474 16.8578 17.4567 20 24 20C30.5433 20 36.3526 16.8578 40.015 12" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)" />
            <path d="M11.998 8C15.341 10.5116 19.4967 12 24 12C28.5033 12 32.659 10.5116 36.0019 8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)" />
          </svg>
          ChatSphere
        </h2>
        <h2 style={{ border: "2px solid white", borderLeft: "none", borderRight: "none" }}>
          <i className="fa-regular fa-comments"></i> Chats
        </h2>

        <ul>
          {contacts.map((contact) => (
            <li key={contact._id}>
              {contact.name} - {contact.isRegistered ? 'Registered' : 'Not Registered'}
              {!contact.isRegistered && (
                <button onClick={() => sendInvitation(contact.mobile)}>Invite</button>
              )}
              {contact.isRegistered && (
                <button onClick={() => startChat(contact._id, contact.name)}>Chat</button>
              )}
            </li>
          ))}
        </ul>

        <h3>Available Users :</h3>
        <ul>
        {loading && (
        <div className="loading" style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
          <div className='loader'></div>
        </div>
      )}
          {availableUsers.map((user) => (
            <li className='availableusers' key={user._id}>
              <img src={user.avatar ? user.avatar : profile} alt={user.avatar} width="50px" style={{ borderRadius: "50%" }} />
              {user.name} <br />
              {user.mobile}
              <button onClick={() => startChat(user._id, user.name)}>Chat</button>
            </li>
          ))}
        </ul>
      </div>

      <div className='user'>
        <h2>Hi,</h2>
        <h2>{loggedUser?.name}</h2>
        <img src={loggedUser?.avatar || profile} alt="" style={{ border: "none", width: "50px", height: "50px", borderRadius: "50%" }} />
      </div>
    </div>
  );
};

export default ContactList;
