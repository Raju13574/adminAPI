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
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (token && storedUser) {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete API.defaults.headers.common['Authorization'];
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
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('AuthContext: Setting user:', user);
      setUser(user);
      return user; // Return the user object
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
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
