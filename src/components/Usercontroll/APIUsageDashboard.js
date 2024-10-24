import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../api/config';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const Card = ({ children, className }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-4 border-b border-gray-700">{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

const CardDescription = ({ children }) => (
  <p className="text-gray-400 mt-1">{children}</p>
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-gray-800 text-white border border-gray-700 rounded p-2"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const Tabs = ({ children }) => (
  <div className="w-full">{children}</div>
);

const TabsList = ({ children }) => (
  <div className="flex bg-gray-800 rounded-t-lg">{children}</div>
);

const TabsTrigger = ({ children, isActive, onClick }) => (
  <button
    className={`flex-1 py-2 px-4 text-center ${
      isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TabsContent = ({ children, isActive }) => (
  isActive ? <div className="mt-4">{children}</div> : null
);

const APIUsageDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('usage');
  const [overallUsage, setOverallUsage] = useState(null);
  const [apiUsageData, setApiUsageData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchAPIUsageData = async () => {
      try {
        const overallResponse = await API.getOverallUsage();
        setOverallUsage(overallResponse.data);

        const apiUsageResponse = await API.getApiUsageAnalytics();
        setApiUsageData(apiUsageResponse.data);

        const languageResponse = await API.getLanguageAnalytics();
        setLanguageData(languageResponse.data);

        const performanceResponse = await API.getPerformanceAnalytics();
        setPerformanceData(performanceResponse.data);
      } catch (error) {
        console.error('Error fetching API usage data:', error);
      }
    };

    fetchAPIUsageData();
    const intervalId = setInterval(fetchAPIUsageData, 60000); // Fetch every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-indigo-400">Compiler API Analytics</CardTitle>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '24h', label: 'Last 24 hours' },
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
            ]}
          />
        </div>
        <CardDescription>
          Comprehensive overview of API usage, language distribution, and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs>
          <TabsList>
            <TabsTrigger isActive={activeTab === 'usage'} onClick={() => setActiveTab('usage')}>Usage</TabsTrigger>
            <TabsTrigger isActive={activeTab === 'languages'} onClick={() => setActiveTab('languages')}>Languages</TabsTrigger>
            <TabsTrigger isActive={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>Performance</TabsTrigger>
          </TabsList>
          <TabsContent isActive={activeTab === 'usage'}>
            <Card>
              <CardHeader>
                <CardTitle>API Calls and Errors</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Legend />
                    <Bar dataKey="calls" fill="#4f46e5" name="API Calls" />
                    <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent isActive={activeTab === 'languages'}>
            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent isActive={activeTab === 'performance'}>
            <Card>
              <CardHeader>
                <CardTitle>API Response Time</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="time" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="responseTime" stroke="#8884d8" name="Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default APIUsageDashboard;
