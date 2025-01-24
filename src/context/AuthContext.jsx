// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Store user data in localStorage when it changes
  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
    setCurrentUser(userData);
  };

  // Helper function to determine redirect path based on user role
  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/user/dashboard';
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setUser, getRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);