import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'; // HashRouter
import profile from "./assets/profile.jpg"
import Login from './components/Login';
import Register from './components/Register';
import ContactList from './components/ContactList';
import ChatRoom from './components/ChatRoom';
import Robot from '../src/assets/robot.gif';

const App = () => {
  const [user, setUser] = useState(null); // User token
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the user state from localStorage on initial load
    }
  }, []); // Run once when the component mounts

  useEffect(() => {
    // Check screen size to determine if it's mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile screen size threshold
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {!user && (
          <>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Protected Routes */}
        {user && (
          <>
            <Route
              path="/"
              element={
                isMobile ? (
                  // Mobile view: Stack ContactList and Outlet vertically
                  <MobileLayout user={user} setUser={setUser} />
                ) : (
                  // Desktop view: Side-by-side layout
                  <DesktopLayout user={user} setUser={setUser} />
                )
              }
            >
              <Route path="/contacts" element={<ContactList token={user} setUser={setUser} />} />
              <Route path="/chat/:chatId" element={<ChatRoom token={user} />} />
            </Route>

            {/* Redirect if no matching route */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

const DesktopLayout = ({ user, setUser }) => {
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' ,background:"black"}}>
      <div style={{ borderRight: '1px solid #ccc' }}>
        <ContactList token={user} setUser={setUser} />
      </div>
      <div style={{ flex: 2 }}>
        {isWelcomePage ? (
          <div
            style={{
              height: '100vh',
              background: 'black',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={Robot} alt="Robot" style={{ marginTop: '-100px' }} />
            <h1 style={{ color: 'white', marginTop: '-100px' }}>
              Welcome, {user.name} {/* Use the 'user' state directly */}
            </h1>
            <img src={user.avatar ? user.avatar : profile} alt="User Avatar" width="100px" />
            <h2 style={{ marginTop: '30px' }}>Please Select a Chat  To Start Messaging.</h2>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

const MobileLayout = ({ user, setUser }) => {
  const location = useLocation();

  return (
    <div style={{ height: '100vh' }}>
      {location.pathname === '/contacts' ? (
        <ContactList token={user} setUser={setUser} />
      ) : location.pathname.startsWith('/chat/') ? (
        <div style={{ height: '100vh' }}>
          <Outlet />
        </div>
      ) : (
        <ContactList token={user} setUser={setUser} />
      )}
    </div>
  );
};

export default App;
