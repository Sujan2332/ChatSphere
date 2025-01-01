import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // HashRouter

import Login from './components/Login';
import Register from './components/Register';
import ContactList from './components/ContactList';
import ChatRoom from './components/ChatRoom';

const App = () => {
  const [user, setUser] = useState(null); // user token

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
                <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
                  <div>
                    <ContactList token={user} setUser={setUser} />
                  </div>
                  {/* Right side: Chat Room */}
                  <div style={{ flex: 2 }}>
                    {/* This Outlet will be replaced with the ChatRoom component */}
                    <Outlet />
                  </div>
                </div>
              }
            >
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

export default App;
