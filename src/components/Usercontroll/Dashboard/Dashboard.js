import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/config';
import { useAuth } from '../../../auth/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { User, LayoutDashboard, Lock, Bell, ChevronDown, CreditCard, HelpCircle, Activity, Zap, Wallet, Home, Settings, Code, Clock, Globe, Terminal, RefreshCw, Coins, LogOut, BarChart2 } from 'lucide-react';
import ProfileContent from '../ProfileContent';
import SecurityContent from '../SecurityContent';
import BillingContent from '../BillingContent';
import Integrations from '../Integrations';
import WalletContent from '../WalletContent';
import Logo from '../../../assets/logo.png'; // Adjust the path as needed
import IDEComponent from '../IDEComponent';
import APIUsageDashboard from '../APIUsageDashboard';

const Card = ({ children, className }) => <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const CardContent = ({ children }) => <div className="p-4">{children}</div>;
const Button = ({ children, className, ...props }) => <button className={`px-4 py-2 rounded ${className}`} {...props}>{children}</button>;
const Alert = ({ children, className }) => <div className={`p-4 rounded ${className}`}>{children}</div>;
const AlertTitle = ({ children }) => <h4 className="font-bold mb-2">{children}</h4>;
const AlertDescription = ({ children }) => <p>{children}</p>;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const calculateTimeUntilRenewal = (renewalDate) => {
  if (!renewalDate) return 'N/A';
  
  const now = new Date();
  const renewal = new Date(renewalDate);
  const timeUntilRenewal = renewal - now;
  
  if (timeUntilRenewal < 0) return 'Expired';
  
  const hours = Math.floor(timeUntilRenewal / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilRenewal % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeUntilRenewal % (1000 * 60)) / 1000);
  
  return `${hours}h ${minutes}m ${seconds}s`;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    status: 'Active',
    plan: 'Free',
    creditsPerDay: 50,
    remainingCredits: 50,
    renewalDate: new Date(new Date().setHours(24, 0, 0, 0)), // Next midnight
  });

  // New state variables
  const [selectedEndpoint, setSelectedEndpoint] = useState('compile');
  const [usageData, setUsageData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [credits, setCredits] = useState(null);
  const [totalCalls, setTotalCalls] = useState(null);
  const [accountStatus, setAccountStatus] = useState({
    status: 'Active',
    plan: 'Free',
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // One year from now
  });

  const [timeUntilRenewal, setTimeUntilRenewal] = useState('Calculating...');

  const [apiUsage, setApiUsage] = useState({
    totalExecutions: 0
  });

  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const updateTimeUntilRenewal = () => {
      const now = new Date();
      const renewalTime = new Date(now);
      renewalTime.setHours(24, 0, 0, 0); // Set to next midnight

      const diff = renewalTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilRenewal(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimeUntilRenewal();
    const timer = setInterval(updateTimeUntilRenewal, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchApiUsage = async () => {
      try {
        const response = await API.get('/usage');
        setApiUsage({
          totalExecutions: response.data.totalExecutions
        });
      } catch (error) {
        console.error('Error fetching API usage:', error);
      }
    };

    fetchApiUsage(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchApiUsage();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' }, 
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'integrations', icon: Zap, label: 'Integrations' },
    { id: 'activity', icon: Activity, label: 'Activity Log' },
    { id: 'ide', icon: Code, label: 'IDE' },
    { id: 'api-usage', icon: BarChart2, label: 'API Usage' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [userResponse, subscriptionResponse, transactionsResponse] = await Promise.all([
        API.get('/users/profile', { headers }),
        API.get('/subscription/status', { headers }),
        API.get('/users/transactions', { headers })
      ]);

      setSubscriptionData({
        status: subscriptionResponse.data.status,
        plan: subscriptionResponse.data.plan,
        creditsPerDay: subscriptionResponse.data.creditsPerDay,
        remainingCredits: subscriptionResponse.data.remainingCredits,
        renewalDate: new Date(subscriptionResponse.data.renewalDate),
      });

      setAccountStatus({
        status: subscriptionResponse.data.status,
        plan: subscriptionResponse.data.plan,
        startDate: new Date(subscriptionResponse.data.startDate),
        endDate: new Date(subscriptionResponse.data.endDate)
      });

      setBalance(userResponse.data.balance || 0);
      setTransactions(transactionsResponse.data);
      
      // Update other state variables
      setCredits(subscriptionResponse.data.remainingCredits);
      setAccountStatus({
        status: subscriptionResponse.data.status,
        plan: subscriptionResponse.data.plan,
        startDate: subscriptionResponse.data.startDate,
        endDate: subscriptionResponse.data.endDate
      });

      // You may need to add API calls for usageData, languageData, and performanceData
    } catch (err) {
      console.error('Error fetching user data:', err);
      if (err.response?.status === 404) {
        setError('User data not found. Please try logging in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch user data. Please try again later.');
      }
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      const intervalId = setInterval(fetchUserData, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');  // Navigate to the home page
  };

  const getPageTitle = () => {
    return activeTab === 'dashboard' ? 'Dashboard' : '';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{accountStatus.status}</p>
                <p className="text-xs opacity-80">Plan: {capitalizeFirstLetter(accountStatus.plan)}</p>
                <p className="text-xs opacity-80">Start Date: {formatDate(accountStatus.startDate)}</p>
                <p className="text-xs opacity-80">End Date: {formatDate(accountStatus.endDate)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  Remaining Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{subscriptionData.remainingCredits}</p>
                <p className="text-xs opacity-80">Daily Limit: {subscriptionData.creditsPerDay}</p>
                <p className="text-xs opacity-80">Renews in: {timeUntilRenewal}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 shadow-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  API Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{apiUsage.totalExecutions}</p>
                <p className="text-sm mt-2">Total Executions</p>
                <div className="mt-1 flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  <span className="text-xs">Last updated: Just now</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-600 to-pink-700 shadow-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-6 w-6 mr-2" />
                  Quick Compile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <select 
                  className="w-full mb-2 bg-white text-black p-2 rounded"
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  value={selectedLanguage}
                >
                  <option value="">Select language</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </select>
                <Button 
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    if (selectedLanguage) {
                      navigate(`/ide?language=${selectedLanguage}`);
                    }
                  }}
                  disabled={!selectedLanguage}
                >
                  Open Code Editor
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'wallet':
        return <WalletContent />;
      case 'profile':
        return <ProfileContent />;
      case 'security':
        return <SecurityContent />;
      case 'billing':
        return <BillingContent />;
      case 'integrations':
        return <Integrations user={user} />;
      case 'ide':
        return <IDEComponent language={selectedLanguage} inDashboard={true} />;
      case 'api-usage':
        console.log('Rendering APIUsageDashboard');
        return <APIUsageDashboard />;
      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const userInitial = user.email ? user.email[0].toUpperCase() : 'U';

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
          <span className="text-base font-bold text-[#33207a] text-center">NeXterChat API</span>
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

        {/* Removed Logout button from here */}
      </div>

      {/* Main content area with user profile - adjusted for fixed sidebar and top bar */}
      <div className="flex-1 flex flex-col ml-56">
        {/* Top bar with user profile - now fixed */}
        <div className="bg-white p-3 flex items-center justify-end border-b fixed top-0 right-0 left-56 z-10">
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">{user.email}</span>
            <button 
              className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content area - add padding-top to account for fixed top bar */}
        <div className="flex-1 overflow-y-auto bg-white p-4 pt-16">
          {error && <div className="error-message mb-4 text-red-500">{error}</div>}
          {successMessage && <div className="success-message mb-4 text-green-500">{successMessage}</div>}
          <h1 className="text-2xl font-bold text-[#33207a] mb-4">
            {getPageTitle()}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
