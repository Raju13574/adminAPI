import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../api/config';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];

const TimeRangeSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="5m">Last 5 minutes</option>
    <option value="15m">Last 15 minutes</option>
    <option value="30m">Last 30 minutes</option>
    <option value="1h">Last 1 hour</option>
    <option value="6h">Last 6 hours</option>
    <option value="12h">Last 12 hours</option>
    <option value="24h">Last 24 hours</option>
    <option value="7d">Last 7 days</option>
    <option value="30d">Last 30 days</option>
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
  </select>
);

const StatCard = ({ title, value, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const ExecutionTrendsChart = React.memo(({ data, timeRange }) => {
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '7d' || timeRange === '30d') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else if (timeRange === '24h') {
      return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  };

  // Get all available metrics excluding timestamp and displayTime
  const metrics = Object.keys(data[0] || {}).filter(
    key => !['timestamp', 'displayTime'].includes(key)
  );

  // Custom colors for specific metrics
  const getLineColor = (metric) => {
    switch (metric.toLowerCase()) {
      case 'total': return '#4F46E5';  // Indigo
      case 'credits': return '#10B981'; // Green
      case 'python': return '#F59E0B';  // Yellow
      case 'javascript': return '#EC4899'; // Pink
      case 'java': return '#8B5CF6';    // Purple
      case 'cpp': return '#EF4444';     // Red
      default: return COLORS[metrics.indexOf(metric) % COLORS.length];
    }
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            type="number"
            domain={['dataMin', 'dataMax']}
            scale="time"
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis 
            allowDecimals={false}
            domain={[0, 'auto']}
          />
          <Tooltip
            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
            formatter={(value, name) => [
              `${value} ${name.toLowerCase() === 'credits' ? 'credits' : 'executions'}`,
              name.toUpperCase()
            ]}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            formatter={(value) => value.toUpperCase()}
            iconType="circle"
          />
          {metrics.map((metric) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={getLineColor(metric)}
              strokeWidth={2}
              name={metric.toUpperCase()}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

const getIntervalMilliseconds = (interval) => {
  const units = {
    'm': 60 * 1000,           // minute in milliseconds
    'h': 60 * 60 * 1000,      // hour in milliseconds
    'd': 24 * 60 * 60 * 1000  // day in milliseconds
  };

  switch (interval) {
    case '5m': return 5 * 60 * 1000;
    case '15m': return 15 * 60 * 1000;
    case '30m': return 30 * 60 * 1000;
    case '1h': return 60 * 60 * 1000;
    case '6h': return 6 * 60 * 60 * 1000;
    case '12h': return 12 * 60 * 60 * 1000;
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d': return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    case 'weekly': return 7 * 24 * 60 * 60 * 1000;
    case 'monthly': return 30 * 24 * 60 * 60 * 1000;
    default: return 60 * 1000; // default to 1 minute
  }
};

const APIUsageDashboard = () => {
  const [timeRange, setTimeRange] = useState('15m');
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize the transformed data to prevent unnecessary recalculations
  const executionTrendsData = React.useMemo(() => {
    if (!analyticsData?.executionMetrics) return [];
    
    // Get all unique languages from all metrics
    const allLanguages = new Set();
    analyticsData.executionMetrics.forEach(metric => {
      Object.keys(metric.byLanguage || {}).forEach(lang => allLanguages.add(lang.toLowerCase()));
    });

    // Create array of all time points for the selected range
    const now = new Date();
    const timePoints = [];
    const interval = timeRange === '7d' ? 24 * 60 * 60 * 1000 : // 1 day interval for 7d
                     timeRange === '30d' ? 24 * 60 * 60 * 1000 : // 1 day interval for 30d
                     timeRange === '1h' ? 5 * 60 * 1000 : // 5 min interval for 1h
                     timeRange === '24h' ? 60 * 60 * 1000 : // 1 hour interval for 24h
                     60 * 1000; // 1 minute interval for others

    const duration = getIntervalMilliseconds(timeRange);

    for (let time = now.getTime() - duration; time <= now.getTime(); time += interval) {
      timePoints.push(time);
    }

    // Create base data for all time points
    const baseData = timePoints.map(timestamp => ({
      timestamp,
      total: 0,
      credits: 0,
      ...Array.from(allLanguages).reduce((acc, lang) => ({
        ...acc,
        [lang]: 0
      }), {})
    }));

    // Merge actual data with base data
    analyticsData.executionMetrics.forEach(metric => {
      const timestamp = new Date(metric.timestamp).getTime();
      const closestTimePoint = timePoints.reduce((prev, curr) => 
        Math.abs(curr - timestamp) < Math.abs(prev - timestamp) ? curr : prev
      );

      const dataPoint = baseData.find(d => d.timestamp === closestTimePoint);
      if (dataPoint) {
        dataPoint.total = metric.total || 0;
        dataPoint.credits = metric.totalCredits || 0;
        Object.entries(metric.byLanguage || {}).forEach(([lang, data]) => {
          dataPoint[lang.toLowerCase()] = data.total || 0;
        });
      }
    });

    return baseData.sort((a, b) => a.timestamp - b.timestamp);
  }, [analyticsData, timeRange]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const fetchData = async () => {
      try {
        const response = await API.getAnalyticsData(timeRange);
        if (isMounted) {
          setAnalyticsData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Adjust refresh interval based on time range
    const refreshInterval = 
      timeRange === '5m' ? 5000 :
      timeRange === '15m' ? 15000 :
      timeRange === '30m' ? 30000 :
      timeRange === '1h' ? 60000 :
      300000;

    intervalId = setInterval(fetchData, refreshInterval);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [timeRange]);

  const languageChartData = analyticsData?.summary?.languageBreakdown
    ? Object.entries(analyticsData.summary.languageBreakdown).map(([language, data]) => ({
        name: language.toUpperCase(),
        value: data.total,
        successful: data.successful,
        failed: data.failed
      }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Usage Analytics</h1>
            <p className="text-gray-500">Monitor your API usage and performance metrics</p>
          </div>
          <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Executions" 
            value={analyticsData?.summary?.totalExecutions.toLocaleString() || '0'} 
          />
          <StatCard 
            title="Success Rate" 
            value={analyticsData?.summary?.successRate || '0%'} 
          />
          <StatCard 
            title="Credits Used" 
            value={analyticsData?.summary?.totalCreditsUsed.toLocaleString() || '0'} 
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'languages'
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Languages
          </button>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'overview' ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Execution Trends</h3>
              <ExecutionTrendsChart 
                data={executionTrendsData} 
                timeRange={timeRange}
              />
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} executions`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIUsageDashboard;
