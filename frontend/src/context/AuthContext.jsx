import React, { createContext, useState, useEffect, useCallback } from 'react';
import Loading from '../components/Common/Loading';
import api from '../utils/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // Loading state
  // Update initial state
  const [auth, setAuth] = useState(() => {
    try {
      const storedAuth = localStorage.getItem('auth');
      if (!storedAuth) return { token: null, userId: null, username: null, email: null };

      const parsedAuth = JSON.parse(storedAuth);
      // Validate stored auth data
      if (!parsedAuth.token || !parsedAuth.userId || !parsedAuth.username) {
        localStorage.removeItem('auth');
        return { token: null, userId: null, username: null, email: null };
      }
      return parsedAuth;
    } catch (error) {
      localStorage.removeItem('auth');
      return { token: null, userId: null, username: null, email: null };
    }
  });

  // Update logout function
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('auth');
      setAuth({ token: null, userId: null, username: null, email: null });

    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  // Update login function to include email
  const login = async (token, userId, username, email) => {
    if (!token || !userId || !username) {
      throw new Error('Invalid login data: Missing required fields');
    }

    const authData = { token, userId, username, email };
    try {
      localStorage.setItem('auth', JSON.stringify(authData));
      setAuth(authData);
    } catch (error) {
      console.error('Error saving auth state:', error);
      throw error;
    }
  };

  // Initial setup effect
  useEffect(() => {
    try {
      // Validate current auth state
      if (!auth?.token) {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [auth?.token, logout]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;