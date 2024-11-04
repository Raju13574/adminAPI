import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState({ 
    username: '', 
    email: '', 
    emailOrUsername: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await onLogin(userData.emailOrUsername, userData.password);
      } else {
        // Registration logic
        const response = await API.post('/users/register', {
          username: userData.username,
          email: userData.email,
          password: userData.password
        });
        console.log('Registration successful:', response.data);
        // Automatically log in the user after successful registration
        await login(userData.email, userData.password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('AuthForm: Error during submission:', err);
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {isLogin ? 'Welcome Back' : 'Join NeXTerChat API'}
        </h2>
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 text-sm font-medium ${isLogin ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 text-sm font-medium ${!isLogin ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {isLogin ? (
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
              value={userData.emailOrUsername}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-pink-100 focus:border-pink-300 text-gray-800"
              required
            />
          ) : (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={userData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-pink-100 focus:border-pink-300 text-gray-800"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-pink-100 focus:border-pink-300 text-gray-800"
                required
              />
            </>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-pink-100 focus:border-pink-300 text-gray-800"
            required
          />
          <motion.button
            type="submit"
            className="w-full px-4 py-2 text-white font-semibold bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </motion.button>
        </form>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm text-center">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLogin && (
          <p className="mt-4 text-sm text-center">
            <Link to="/forgot-password" className="text-pink-600 hover:text-pink-800 transition-colors">
              Forgot your password?
            </Link>
          </p>
        )}
        
        <p className="mt-8 text-sm text-gray-500 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-pink-600 hover:text-pink-800 transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthForm;
