import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Register.css";

const Register = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatar,setAvatar] = useState(false)

  const backend = import.meta.env.VITE_BACKEND;

  const generateAvatars = async () => {
    if (!name) {
      setError('Please enter a name to generate avatars.');
      return;
    }
  
    setError('');
    setAvatar(true); // Start loading animation
    // setAvatars([]); // Clear existing avatars while loading
  
    // const avatarUrls = Array.from({ length: 4 }, () =>
    //   `https://api.multiavatar.com/${encodeURIComponent(name + Math.random().toString(36).substring(2))}.svg`
    // );
        // const avatarUrls = Array.from({ length: 4 }, (_, index) => {
    //   const seed = encodeURIComponent(name + Math.random().toString(36).substring(2) + index);
    //   const robohashUrl = `https://robohash.org/${seed}.svg`;
    //   return [robohashUrl];
    // }).flat();

    
    const sets = ['set2', 'set1', 'set1', 'set2'];
    const avatarUrls = await Promise.all(sets.map((set) => {
      return fetch(`https://cors-anywhere.herokuapp.com/https://robohash.org/${encodeURIComponent(name + Math.random().toString(36).substring(2))}.png?set=${set}`, {
        headers: {
          origin: 'https://robohash.org',
        },
      }).then(response => response.url);
    }));
    
  
    try {
      // Fetch all avatars in parallel, allowing for partial failures
      const avatarResponses = await Promise.allSettled(
        avatarUrls.map((url) =>
          axios.get(url, { responseType: 'text' }).then((res) => ({ url, svg: res.data }))
        )
      );
  
      // Filter successful responses
      const successfulAvatars = avatarResponses
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
  
      if (successfulAvatars.length === 0) {
        setError('Failed to generate avatars. Try Refreshing Page.');
      } else {
        setAvatars(successfulAvatars); // Set successful avatars
      }
    } catch (err) {
      console.error('Error fetching avatars:', err);
      setError('Failed to generate avatars. Refresh Page.');
    } finally {
      setAvatar(false); // End loading animation
    }
  };
  

  const handleRegister = async () => {
    if (!selectedAvatar) {
      setError('Please select an avatar.');
      return;
    }
    setLoading(true)
    try {
      const response = await axios.post(`${backend}/api/users/register`, {
        name,
        email,
        password,
        mobile,
        avatar: selectedAvatar, // Include the selected avatar
      });
      setUser(response.data.token);
      localStorage.setItem('token',response.data.token)
      localStorage.setItem('user',JSON.stringify(response.data.user))
      window.location.reload()
    } catch (err) {
      setError(err.response.data.message || `An Error Occurred: ${err.message}`);
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="Register">
      {loading && (
        <div className='loader-overlay'>
          <div className='loader'></div>
        </div>
      )}
      <div className="RegisterContainer" style={{height:"85vh"}}>
        <h1>
        <svg width="40px" height="40px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="black" />
    </filter>
  </defs>
  <rect width="48" height="48" fill="white" fill-opacity="0.01"/>
  <path d="M48 0H0V48H48V0Z" fill="white" fill-opacity="0.01"/>
  <circle cx="24" cy="24" r="20" stroke="white" stroke-width="4" stroke-linejoin="round" filter="url(#f1)"/>
  <path d="M4.40002 20C6.2531 29.129 14.3242 36 24 36C33.6758 36 41.7468 29.129 43.5999 20" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)"/>
  <path d="M5.66418 16C8.7504 23.0636 15.7987 28 24 28C32.2013 28 39.2496 23.0636 42.3358 16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)"/>
  <path d="M7.99854 12C11.6474 16.8578 17.4567 20 24 20C30.5433 20 36.3526 16.8578 40.015 12" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)"/>
  <path d="M11.998 8C15.341 10.5116 19.4967 12 24 12C28.5033 12 32.659 10.5116 36.0019 8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#f1)"/>
</svg>
          ChatSphere</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={generateAvatars} // Generate avatars when the user enters their name
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        {/* Display avatars */}
        {avatars.length > 0 && (
          <div className="AvatarSelection">
            <p>Select an Avatar:</p>
            <div className="AvatarGrid">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`Avatar ${selectedAvatar === avatar.url ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar.url)}
                >
                  <img src={avatar.url} alt={`Avatar ${index}`} />
                </div>
              ))}
            </div>
            <button className="RegenerateButton" onClick={generateAvatars} disabled={loading}>
            {avatar ? <span className="loading-spinner"></span> : 'Regenerate Avatars'}
            </button>
          </div>
        )}

        <button onClick={handleRegister}>Register</button>
        <h3>
          Already Existing User? <a href="/#/login">Login</a>
        </h3>
        {error && <p className='error' style={{color:"red"}}>{error}</p>}
      </div>
    </div>
  );
};

export default Register;
