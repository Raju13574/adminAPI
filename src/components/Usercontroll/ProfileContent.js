import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

const ProfileContent = () => {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (username === user.username && email === user.email) {
      setMessage('No changes detected. Please update your details.');
      return;
    }

    try {
      await updateProfile(username, email);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
      {message && <p className={message.includes('successfully') ? 'text-green-500' : 'text-red-500 mb-4'}>{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileContent;
