import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

import Logo from '../../assets/logo.png';
import { Users, BarChart2, Settings, Activity, Database, Layout } from 'react-feather';
import AdminDashboardContent from './AdminDashboardContent';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import ActivityLog from './ActivityLog';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [apiUsageStats, setApiUsageStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [subscriptionMetrics, setSubscriptionMetrics] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'activity', icon: Activity, label: 'Activity Log' },
    { id: 'database', icon: Database, label: 'Database' },
  ];

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!authLoading) {
        if (!user) {
          navigate('/login', { replace: true });
        } else if (!user.isAdmin) {
          navigate('/', { replace: true });
        } else {
          await fetchAdminData();
        }
      }
    };

    checkAdminStatus();
  }, [user, authLoading, navigate]);

  const fetchAdminData = async () => {
    if (!user || !user.isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch admin dashboard data here
      // Update state with fetched data
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data. Please try again later.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left navigation - fixed */}
      <div className="w-56 bg-white shadow-md overflow-y-auto flex flex-col border-r fixed h-full z-10">
        {/* Logo and company name */}
        <div 
          className="p-3 flex flex-col items-center border-b cursor-pointer hover:bg-gray-100"
          onClick={handleHomeClick}
        >
          <img src={Logo} alt="NeXterChat API Logo" className="h-8 w-auto mb-1" />
          <span className="text-base font-bold text-[#33207a] text-center">Admin Panel</span>
        </div>

        {/* Navigation items */}
        <nav className="mt-4 px-3 flex-grow">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-3 py-2 text-left mb-1 rounded-md transition-colors duration-150 ${
                activeTab === item.id
                  ? 'bg-[#33207a] text-white'
                  : 'text-[#33207a] hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex flex-col ml-56 flex-grow">
        {/* Top bar with logout button */}
        <div className="bg-white p-3 flex items-center justify-between border-b">
          <h1 className="text-xl font-semibold text-[#33207a]">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <AdminDashboardContent stats={dashboardStats} />}
          {activeTab === 'users' && <UserManagement users={users} />}
          {activeTab === 'analytics' && <Analytics apiUsageStats={apiUsageStats} userStats={userStats} />}
          {activeTab === 'activity' && <ActivityLog />}
          {/* Add other tab components as needed */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
