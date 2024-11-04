import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Layout, Users as UsersIcon, BarChart2, Activity, Database, Bell, Search, Menu, Mail, Home, ChevronLeft, ChevronRight, List, Settings, DollarSign, UserPlus } from 'react-feather';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import AdminProfile from './AdminProfile';
import axios from 'axios';
import Users from './Users';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const [unreadEmails, setUnreadEmails] = useState(3);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await axios.get('/api/admin/dashboard-stats');
      const usersResponse = await axios.get('/api/admin/top-users?limit=5&sortBy=usage');
      setDashboardStats(statsResponse.data.data);
      setTopUsers(usersResponse.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'users', icon: UsersIcon, label: 'Users' },
    { id: 'components', icon: Database, label: 'Components' },
    { id: 'icons', icon: Activity, label: 'Icons' },
    { id: 'lists', icon: List, label: 'Lists' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  if (!user || !user.isAdmin) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-purple-800 text-white transition-all duration-300 ease-in-out flex flex-col ${
        isSidebarCollapsed ? 'w-16' : 'w-56'
      }`}>
        <div 
          className="flex items-center justify-center h-16 bg-purple-900 cursor-pointer" 
          onClick={handleHomeClick}
        >
          <Home className="h-6 w-6 text-white" />
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 ease-in-out
                ${activeTab === item.id 
                  ? 'bg-purple-700 text-white border-l-4 border-white' 
                  : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                }
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={`w-5 h-5 ${isSidebarCollapsed ? '' : 'mr-3'}`} />
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full px-2 py-1 text-sm font-medium bg-purple-700 rounded-lg hover:bg-purple-600 transition-colors duration-200"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10 h-16">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center space-x-3">
              <button onClick={toggleSidebar} className="text-gray-500 hover:text-purple-600 focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  className="pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-purple-300" 
                  type="text" 
                  placeholder="Search..." 
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-purple-600 focus:outline-none relative">
                <Mail className="h-6 w-6" />
                {unreadEmails > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadEmails}
                  </span>
                )}
              </button>
              <button className="text-gray-500 hover:text-purple-600 focus:outline-none relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </button>
              <AdminProfile />
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {activeTab === 'dashboard' && (
              <>
                <h3 className="text-gray-700 text-3xl font-medium mb-6">Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <DashboardCard 
                    title="API Calls" 
                    value={dashboardStats?.daily?.apiCalls || 0} 
                    icon={<Activity className="h-8 w-8" />}
                    color="bg-blue-500"
                  />
                  <DashboardCard 
                    title="New Users" 
                    value={dashboardStats?.daily?.newUsers || 0} 
                    icon={<UserPlus className="h-8 w-8" />}
                    color="bg-green-500"
                  />
                  <DashboardCard 
                    title="Weekly Revenue" 
                    value={`$${dashboardStats?.weekly?.revenue?.toFixed(2) || '0.00'}`} 
                    icon={<DollarSign className="h-8 w-8" />}
                    color="bg-purple-500"
                  />
                  <DashboardCard 
                    title="Monthly API Calls" 
                    value={dashboardStats?.monthly?.apiCalls || 0} 
                    icon={<BarChart2 className="h-8 w-8" />}
                    color="bg-yellow-500"
                  />
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <ChartCard title="API Usage Trend" chart={
                    <BarChart data={[
                      {name: 'Daily', apiCalls: dashboardStats?.daily?.apiCalls || 0},
                      {name: 'Weekly', apiCalls: dashboardStats?.weekly?.apiCalls || 0},
                      {name: 'Monthly', apiCalls: dashboardStats?.monthly?.apiCalls || 0}
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Bar dataKey="apiCalls" fill="#4f46e5" />
                    </BarChart>
                  } />
                  <ChartCard title="Top Languages" chart={
                    <PieChart>
                      <Pie
                        data={dashboardStats?.topLanguages || []}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {dashboardStats?.topLanguages?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  } />
                </div>

                {/* Top Users List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <h4 className="text-gray-600 text-lg font-medium p-4 bg-gray-50 border-b">Top Users</h4>
                  <div className="divide-y divide-gray-200">
                    {topUsers.map((user, index) => (
                      <div key={index} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg mr-4">
                            {user._id.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user._id}</div>
                            <div className="text-sm text-gray-500">User ID: {user._id}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Usage: <span className="font-semibold">{user.totalUsage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {activeTab === 'users' && <Users />}
          </div>
        </main>
      </div>
    </div>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardCard = ({ title, value, icon, color }) => (
  <div className={`rounded-lg shadow p-6 flex items-center ${color}`}>
    <div className="p-3 rounded-full bg-white mr-4">
      {React.cloneElement(icon, { className: `h-8 w-8 ${color.replace('bg-', 'text-')}` })}
    </div>
    <div>
      <h4 className="text-2xl font-semibold text-white">{value}</h4>
      <div className="text-white opacity-75">{title}</div>
    </div>
  </div>
);

const ChartCard = ({ title, chart }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h4 className="text-lg font-semibold mb-4 text-gray-700">{title}</h4>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {chart}
      </ResponsiveContainer>
    </div>
  </div>
);

export default AdminDashboard;
