import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await API.get('/users/profile');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      console.log('AuthContext: Attempting login with:', { emailOrUsername, password });
      const response = await API.post('/users/login', { emailOrUsername, password });
      console.log('AuthContext: Login response:', response.data);
      const { token, user } = response.data;
      
      if (!token || !user) {
        console.error('AuthContext: Invalid response structure', response.data);
        return null;
      }
      
      localStorage.setItem('authToken', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('AuthContext: Setting user:', user);
      setUser(user);
      return user;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      if (error.response) {
        console.log('AuthContext: Error response:', error.response.data);
        console.log('AuthContext: Error status:', error.response.status);
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    delete API.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (username, email) => {
    try {
      const response = await API.put('/users/profile', { username, email });
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};