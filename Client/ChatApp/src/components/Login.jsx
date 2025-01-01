import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Register.css"
const Login = ({ setUser }) => {
  const [emailOrMobile, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const backend = import.meta.env.VITE_BACKEND;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backend}/api/users/login`, { emailOrMobile, password });
      setUser(response.data.token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='Register'>
      <div className='RegisterContainer'>

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
        ChatSphere
        </h1>
      <input
        type="email"
        placeholder="Email"
        value={emailOrMobile}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <h3>Dont You Have An Account ? <a href="/register">Signup</a></h3>
      {error && <p>{error}</p>}
    </div>
    </div>
  );
};

export default Login;
