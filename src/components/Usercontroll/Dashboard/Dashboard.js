import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import API from '../../../api/config';
import { useAuth } from '../../../auth/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { User, LayoutDashboard, Lock, ChevronDown, CreditCard, HelpCircle, Zap, Wallet, Code, Clock, Globe, Terminal, RefreshCw, Coins, LogOut, ArrowUp } from 'lucide-react';
import { Layout, Users as UsersIcon, BarChart2, Activity, Database, Bell, Search, Menu, Mail, Home, ChevronLeft, ChevronRight, List, Settings, DollarSign, UserPlus } from 'react-feather';
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
  const { query } = useParams();
  const location = useLocation();
  
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'free',
    status: 'active',
    creditsPerDay: 15,
    remainingCredits: 15,
    validUntil: null,
    features: []
  });

  // New state variables
  const [selectedEndpoint, setSelectedEndpoint] = useState('compile');
  const [usageData, setUsageData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [credits, setCredits] = useState(null);
  const [totalCalls, setTotalCalls] = useState(null);
  const [accountStatus, setAccountStatus] = useState({
    status: 'active',
    endDate: null,
    usagePercentage: 0
  });

  const [timeUntilRenewal, setTimeUntilRenewal] = useState('Calculating...');

  const [apiUsage, setApiUsage] = useState({
    totalExecutions: 0
  });

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadEmails, setUnreadEmails] = useState(3);

  const [usageAnalytics, setUsageAnalytics] = useState({
    daily: [
      { name: 'Mon', executions: 45, errors: 2 },
      { name: 'Tue', executions: 52, errors: 1 },
      { name: 'Wed', executions: 38, errors: 3 },
      { name: 'Thu', executions: 65, errors: 2 },
      { name: 'Fri', executions: 48, errors: 1 },
      { name: 'Sat', executions: 30, errors: 0 },
      { name: 'Sun', executions: 25, errors: 1 },
    ]
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    responseTime: [
      { time: '10:00', value: 120 },
      { time: '11:00', value: 140 },
      { time: '12:00', value: 115 },
      { time: '13:00', value: 180 },
      { time: '14:00', value: 130 },
      { time: '15:00', value: 125 },
    ],
    successRate: 98.5,
    avgResponseTime: 135
  });

  const [recentCompilations] = useState([
    { filename: 'main.py', language: 'python', time: '2 mins ago', status: 'success' },
    { filename: 'app.js', language: 'javascript', time: '5 mins ago', status: 'success' },
    { filename: 'index.html', language: 'html', time: '10 mins ago', status: 'success' },
    { filename: 'style.css', language: 'css', time: '15 mins ago', status: 'success' },
    { filename: 'script.js', language: 'javascript', time: '20 mins ago', status: 'success' },
    { filename: 'main.cpp', language: 'cpp', time: '25 mins ago', status: 'success' },
    { filename: 'style.css', language: 'css', time: '30 mins ago', status: 'success' },
    { filename: 'script.js', language: 'javascript', time: '35 mins ago', status: 'success' },
    { filename: 'main.py', language: 'python', time: '40 mins ago', status: 'success' },
    { filename: 'app.js', language: 'javascript', time: '45 mins ago', status: 'success' },
  ]);

  const [popularLanguages] = useState([
    { name: 'Python', usage: 60, bgColor: 'bg-blue-500', progressColor: 'bg-blue-300', icon: <Code className="w-6 h-6" /> },
    { name: 'JavaScript', usage: 50, bgColor: 'bg-yellow-500', progressColor: 'bg-yellow-300', icon: <Code className="w-6 h-6" /> },
    { name: 'Java', usage: 40, bgColor: 'bg-green-500', progressColor: 'bg-green-300', icon: <Code className="w-6 h-6" /> },
    { name: 'C++', usage: 30, bgColor: 'bg-purple-500', progressColor: 'bg-purple-300', icon: <Code className="w-6 h-6" /> },
    { name: 'C', usage: 20, bgColor: 'bg-red-500', progressColor: 'bg-red-300', icon: <Code className="w-6 h-6" /> }
  ]);

  // First, update the user state to include name
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      navigate(`/dashboard/search/${query}`);
    } else {
      navigate('/dashboard');
    }
  };

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

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const menuItems = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'integrations', icon: Zap, label: 'Integrations' },
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

  // Update the fetchUserData function to set user data
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

      // Set user data including name
      setUserData({
        name: userResponse.data.name || userResponse.data.username,
        email: userResponse.data.email,
        username: userResponse.data.username
      });

      setSubscriptionData({
        plan: subscriptionResponse.data.plan,
        status: subscriptionResponse.data.status,
        creditsPerDay: subscriptionResponse.data.creditsPerDay,
        remainingCredits: subscriptionResponse.data.creditsRemaining,
        validUntil: subscriptionResponse.data.validUntil,
        features: subscriptionResponse.data.features
      });

      setAccountStatus({
        status: subscriptionResponse.data.status,
        endDate: subscriptionResponse.data.validUntil,
        usagePercentage: Math.round((subscriptionResponse.data.creditsRemaining / subscriptionResponse.data.creditsPerDay) * 100)
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
          <div className="space-y-6">
            {/* Dashboard Title with enhanced styling */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Usage Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-gray-500 text-sm">Welcome back,</span>
                  <span className="font-medium text-blue-600">
                    {capitalizeFirstLetter(userData?.name || userData?.username || 'User')}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1"></div>
                </div>
              </div>

              {/* Updated date display with year and refined design */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full border border-blue-100/50 shadow-sm">
                <Clock className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-blue-600">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-xs text-blue-400">
                    {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Account Status Card */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 group hover:shadow-lg transition-all duration-300 border border-violet-100">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-50 rounded-full blur-2xl opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-r from-violet-200 to-violet-400"></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-violet-50 rounded-xl border border-violet-100 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Account Status</h3>
                    <p className="text-sm text-slate-500">{subscriptionData.plan}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Plan Usage</span>
                    <span className="text-violet-600 font-medium">
                      {Math.round((subscriptionData.remainingCredits / subscriptionData.creditsPerDay) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-violet-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-400 rounded-full"
                      style={{
                        width: `${Math.round((subscriptionData.remainingCredits / subscriptionData.creditsPerDay) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-slate-600">Valid Until</span>
                    <span className="text-violet-600 font-medium">
                      {subscriptionData.validUntil ? formatDate(subscriptionData.validUntil) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credits Card */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 group hover:shadow-lg transition-all duration-300 border border-blue-100">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-r from-blue-200 to-blue-400"></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 group-hover:scale-110 transition-transform">
                    <Coins className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Credits</h3>
                    <p className="text-sm text-slate-500">Daily Limit: {subscriptionData.creditsPerDay}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-800">
                      {subscriptionData.remainingCredits}
                    </span>
                    <span className="text-sm text-slate-500">/ {subscriptionData.creditsPerDay}</span>
                    <div className="ml-2 px-2 py-0.5 bg-blue-50 rounded-full text-xs text-blue-600 font-medium">
                      {Math.round((subscriptionData.remainingCredits / subscriptionData.creditsPerDay) * 100)}% left
                    </div>
                  </div>
                  <div className="h-2 w-full bg-blue-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${(subscriptionData.remainingCredits / subscriptionData.creditsPerDay) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-600">Renews in:</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">{timeUntilRenewal}</span>
                  </div>
                </div>
              </div>

              {/* API Usage Card */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 group hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-r from-emerald-200 to-emerald-400"></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Executions</h3>
                    <p className="text-sm text-slate-500">Today's Activity</p>
                  </div>
                </div>
                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-slate-800">{apiUsage.totalExecutions}</span>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span className="text-sm text-slate-600">Real-time</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-600 font-medium">↑ {apiUsage.successRate}%</span>
                    <span className="text-slate-500">success rate</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {usageAnalytics.daily.map((day, i) => (
                      <div key={i} className="h-1 rounded-full bg-emerald-100">
                        <div 
                          className="h-full bg-emerald-400 rounded-full" 
                          style={{width: `${(day.executions / Math.max(...usageAnalytics.daily.map(d => d.executions))) * 100}%`}}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between mt-1">
                    <span>Mon</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Quick Compile Card */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 group hover:shadow-lg transition-all duration-300 border border-amber-100">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-r from-amber-200 to-amber-400"></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-100 group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Quick Compile</h3>
                    <p className="text-sm text-slate-500">Start Coding</p>
                  </div>
                </div>
                <select 
                  className="w-full px-3 py-2 mb-3 rounded-xl bg-white border border-amber-100 
                    text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Select language</option>
                  {popularLanguages.map((lang, index) => (
                    <option key={index} value={lang.name.toLowerCase()}>{lang.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => selectedLanguage && navigate(`/ide?language=${selectedLanguage}`)}
                  className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100
                    text-slate-700 font-medium transition-colors flex items-center justify-center gap-2"
                  disabled={!selectedLanguage}
                >
                  <Terminal className="w-4 h-4" />
                  Open Code Editor
                </button>
              </div>
            </div>

            {/* Recent Compilations & Popular Languages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Recent Compilations - Takes 2 columns */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Recent Compilations</h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
                </div>
                <div className="space-y-4">
                  {recentCompilations.slice(0, 5).map((compilation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          compilation.language === 'python' ? 'bg-blue-100 text-blue-600' :
                          compilation.language === 'javascript' ? 'bg-yellow-100 text-yellow-600' :
                          compilation.language === 'java' ? 'bg-orange-100 text-orange-600' :
                          compilation.language === 'cpp' ? 'bg-purple-100 text-purple-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{compilation.filename}</p>
                          <p className="text-sm text-slate-500">{compilation.language}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">{compilation.time}</span>
                        <div className={`h-2 w-2 rounded-full ${
                          compilation.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Languages - Takes 1 column */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Popular Languages</h2>
                  <select className="text-sm border-0 bg-transparent text-slate-600">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>All Time</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {popularLanguages.map((lang, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${lang.bgColor.replace('500', '100')} ${lang.bgColor.replace('500', '600')}`}>
                            {lang.icon}
                          </div>
                          <span className="font-medium text-slate-700">{lang.name}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-600">{lang.usage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${lang.progressColor} transition-all duration-500`}
                          style={{ width: `${lang.usage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'wallet':
        return <WalletContent 
          balance={balance} 
          transactions={transactions}
        />;

      case 'billing':
        return <BillingContent onTabChange={setActiveTab} />;

      case 'notifications':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
            {/* Add your notifications content */}
          </div>
        );

      case 'integrations':
        return <Integrations />;

      case 'ide':
        return <IDEComponent 
          selectedLanguage={selectedLanguage}
          popularLanguages={popularLanguages}
        />;

      case 'api-usage':
        return <APIUsageDashboard 
          usageData={usageData}
          performanceMetrics={performanceMetrics}
          usageAnalytics={usageAnalytics}
        />;

      default:
        return <div>Page not found</div>;
    }
  };

  useEffect(() => {
    // Update the active tab based on the URL path
    const path = location.pathname.split('/')[2]; // Get the section after /dashboard/
    if (path && path !== 'search') {
      setActiveTab(path);
    }
  }, [location]);

  useEffect(() => {
    // Handle search query changes
    if (query) {
      setSearchQuery(query);
      // Implement your search logic here
    }
  }, [query]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const userInitial = user.email ? user.email[0].toUpperCase() : 'U';

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Modern Left Sidebar - Adjusted width */}
      <div className={`fixed left-0 h-full bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out z-20 
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}> {/* Increased collapsed width from w-16 to w-20 */}
        
        {/* Logo Section */}
        <div className="h-16 flex items-center px-4 border-b border-slate-200">
          {!isSidebarCollapsed && (
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => navigate('/')} // Direct navigation to home
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NeXter
              </span>
            </div>
          )}
          {/* Show small logo when collapsed */}
          {isSidebarCollapsed && (
            <div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer mx-auto"
              onClick={() => navigate('/')} // Direct navigation to home
            >
              <Zap className="w-6 h-6 text-white" /> {/* Increased icon size */}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-2 space-y-1.5 h-[calc(100%-120px)]"> {/* Adjusted height to make room for bottom button */}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
                ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              <div className={`flex items-center justify-center ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                <item.icon className={`w-5 h-5 ${isSidebarCollapsed ? '' : 'mr-3'}`} /> {/* Increased icon size */}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}
              {!isSidebarCollapsed && activeTab === item.id && (
                <div className="ml-auto">
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Button - At bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area - Adjusted margin */}
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}> {/* Adjusted margin to match new width */}
        {/* Modern Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 z-10 flex items-center justify-between px-4 md:px-6" 
          style={{ left: isSidebarCollapsed ? '5rem' : '16rem' }}>
          
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search..."
                className="w-48 sm:w-64 md:w-72 px-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 
                  transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Right Section - Made responsive */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
            {/* Notifications */}
            <button className="relative p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>

            {/* Messages - Hidden on mobile */}
            <button className="hidden sm:relative sm:block p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
              <Mail className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

            {/* Profile Section */}
            <ProfileContent />
          </div>
        </header>

        {/* Content Area */}
        <main className="pt-16 px-4 md:px-6 pb-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
