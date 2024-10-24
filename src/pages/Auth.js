import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthForm from '../components/AuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleLogin = async (emailOrUsername, password) => {
    try {
      const loggedInUser = await login(emailOrUsername, password);
      if (loggedInUser) {
        if (loggedInUser.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show an error message)
    }
  };

  if (user) {
    navigate(user.isAdmin ? '/admin/dashboard' : '/dashboard');
    return null;
  }

  return <AuthForm onLogin={handleLogin} />;
};

export default Auth;
