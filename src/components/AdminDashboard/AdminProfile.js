import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { User, Settings, HelpCircle, LogOut, Key, ChevronDown, X } from 'react-feather';
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../../api/admin';

const AdminProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const [adminData, setAdminData] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isViewingProfile, setIsViewingProfile] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileData, setProfileData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      console.log('Fetching admin profile...');
      const response = await getAdminProfile();
      console.log('Admin profile response:', response);
      setAdminData(response.data.admin);
      setProfileData({ username: response.data.admin.username, email: response.data.admin.email });
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setError('Failed to fetch admin profile. Please try again.');
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      await changeAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess('Password changed successfully');
      setTimeout(() => {
        setPasswordSuccess('');
        setIsChangingPassword(false);
      }, 1500);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      const response = await updateAdminProfile(profileData);
      setAdminData(response.data.admin);
      setProfileSuccess('Profile updated successfully');
      fetchAdminProfile(); // Refresh the profile data
      setTimeout(() => {
        setProfileSuccess('');
        setIsViewingProfile(false);
      }, 1500);
    } catch (error) {
      setProfileError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const userInitial = adminData?.username ? adminData.username[0].toUpperCase() : 'A';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-blue-100 rounded-full pl-1 pr-3 py-1 focus:outline-none hover:bg-blue-200 transition duration-150"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
          {userInitial}
        </div>
        <span className="text-sm font-medium text-blue-800">Admin</span>
        <ChevronDown className="h-4 w-4 text-blue-500" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-10">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                {userInitial}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{adminData?.username}</p>
                <p className="text-xs text-gray-500">{adminData?.email}</p>
                <p className="text-xs font-medium text-indigo-600">Senior Administrator</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsViewingProfile(true)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            <User className="mr-3 h-4 w-4 text-gray-400" />
            View Profile
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150">
            <Settings className="mr-3 h-4 w-4 text-gray-400" />
            Account Settings
          </button>
          <button 
            onClick={() => setIsChangingPassword(true)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            <Key className="mr-3 h-4 w-4 text-gray-400" />
            Change Password
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150">
            <HelpCircle className="mr-3 h-4 w-4 text-gray-400" />
            Help & Support
          </button>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150"
          >
            <LogOut className="mr-3 h-4 w-4 text-red-500" />
            Logout
          </button>
        </div>
      )}

      {isChangingPassword && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="mb-3 w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="mb-3 w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="mb-3 w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-sm mb-3">{passwordSuccess}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewingProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-lg shadow-lg">
            <button
              onClick={() => {
                setIsViewingProfile(false);
                setProfileSuccess('');
                setProfileError('');
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">View/Edit Profile</h3>
            {profileError && <p className="text-red-500 text-sm mb-4">{profileError}</p>}
            {profileSuccess && <p className="text-green-500 text-sm mb-4">{profileSuccess}</p>}
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsViewingProfile(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
