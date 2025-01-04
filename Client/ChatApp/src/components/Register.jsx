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

  const backend = import.meta.env.VITE_BACKEND;

  const generateAvatars = async () => {
    if (!name) {
      setError('Please enter a name to generate avatars.');
      return;
    }
  
    setError('');
    setLoading(true); // Start loading animation
    // setAvatars([]); // Clear existing avatars while loading
  
    const avatarUrls = Array.from({ length: 4 }, () =>
      `https://api.multiavatar.com/${encodeURIComponent(name + Math.random().toString(36).substring(2))}.svg`
    );
  
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
      setLoading(false); // End loading animation
    }
  };
  

  const handleRegister = async () => {
    if (!selectedAvatar) {
      setError('Please select an avatar.');
      return;
    }
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
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="Register">
      <div className="RegisterContainer">
        <h1>ChatSphere</h1>
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
            {loading ? <span className="loading-spinner"></span> : 'Regenerate Avatars'}
            </button>
          </div>
        )}

        <button onClick={handleRegister}>Register</button>
        <h3>
          Already Existing User? <a href="/#/login">Login</a>
        </h3>
        {error && <p className='error'>{error}</p>}
      </div>
    </div>
  );
};

export default Register;
