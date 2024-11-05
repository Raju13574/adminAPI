import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
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

const MetricCard = ({ title, value, trend, trendValue, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 flex items-center ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-500" />
        </div>
      )}
    </div>
  </div>
);

const LanguageUsageCard = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Language Usage</h3>
    <div className="space-y-4">
      {Object.entries(data).map(([language, stats]) => (
        <div key={language} className="flex items-center">
          <div className="w-24 flex-shrink-0">
            <span className="text-sm font-medium">{language}</span>
          </div>
          <div className="flex-grow">
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-indigo-500 rounded-full"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
          <div className="w-20 text-right">
            <span className="text-sm text-gray-500">{stats.percentage}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChartTypeSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="line">Line Chart</option>
    <option value="area">Area Chart</option>
    <option value="bar">Bar Chart</option>
    <option value="composed">Composed Chart</option>
    <option value="smooth">Smooth Line</option>
    <option value="stepped">Stepped Line</option>
    <option value="scatter">Scatter Plot</option>
  </select>
);

const ExecutionTrendsChart = React.memo(({ data, timeRange, chartType = 'line' }) => {
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
        minute: '2-digit'
      });
    }
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">
            {new Date(label).toLocaleString()}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.name}:</span>
              <span>
                {entry.value} {entry.name.toLowerCase() === 'credits' ? 'credits' : 'executions'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get metrics excluding timestamp
  const metrics = Object.keys(data[0] || {}).filter(
    key => !['timestamp', 'displayTime'].includes(key)
  );

  // Define common axis props
  const commonAxisProps = [
    <CartesianGrid 
      key="grid"
      strokeDasharray="3 3" 
      vertical={false} 
      stroke="#E5E7EB" 
      opacity={0.5}
    />,
    <XAxis 
      key="x-axis"
      dataKey="timestamp"
      tickFormatter={formatXAxis}
      type="number"
      domain={['dataMin', 'dataMax']}
      scale="time"
      stroke="#9CA3AF"
      tickLine={false}
      axisLine={false}
      dy={10}
      tick={{ fontSize: 12 }}
    />,
    <YAxis 
      key="y-axis"
      allowDecimals={false}
      domain={[0, 'auto']}
      axisLine={false}
      tickLine={false}
      stroke="#9CA3AF"
      dx={-10}
      tick={{ fontSize: 12 }}
    />,
    <Tooltip 
      key="tooltip"
      content={<CustomTooltip />}
      cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
    />,
    <Legend 
      key="legend"
      formatter={(value) => value.toUpperCase()}
      iconType="circle"
      wrapperStyle={{
        paddingTop: '20px'
      }}
    />
  ];

  // Get line color based on metric
  const getLineColor = (metric) => {
    switch (metric.toLowerCase()) {
      case 'total': return '#4F46E5';    // Indigo
      case 'credits': return '#10B981';   // Emerald
      case 'c': return '#818CF8';         // Light Indigo
      case 'java': return '#34D399';      // Light Emerald
      case 'cpp': return '#FB7185';       // Light Rose
      case 'python': return '#FBBF24';    // Light Amber
      default: return '#A78BFA';          // Light Purple
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonAxisProps}
            {metrics.map((metric) => (
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={getLineColor(metric)}
                fill={`url(#gradient-${metric})`}
                strokeWidth={2}
                name={metric.toUpperCase()}
              />
            ))}
          </AreaChart>
        );
      // ... other chart type cases ...
      default:
        return (
          <LineChart {...commonProps}>
            {commonAxisProps}
            {metrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={getLineColor(metric)}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: '#fff',
                  strokeWidth: 2,
                  fill: getLineColor(metric)
                }}
                name={metric.toUpperCase()}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
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
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

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

    // Add interpolation for smoother curves
    const interpolateData = (baseData) => {
      const result = [];
      for (let i = 0; i < baseData.length - 1; i++) {
        const current = baseData[i];
        const next = baseData[i + 1];
        result.push(current);

        // Add intermediate points for smoother curves
        if (next.timestamp - current.timestamp > interval) {
          const steps = Math.min(5, Math.floor((next.timestamp - current.timestamp) / interval));
          for (let step = 1; step < steps; step++) {
            const progress = step / steps;
            const interpolatedPoint = {
              timestamp: current.timestamp + (next.timestamp - current.timestamp) * progress,
              ...Object.keys(current).reduce((acc, key) => {
                if (key !== 'timestamp') {
                  acc[key] = current[key] + (next[key] - current[key]) * progress;
                }
                return acc;
              }, {})
            };
            result.push(interpolatedPoint);
          }
        }
      }
      result.push(baseData[baseData.length - 1]);
      return result;
    };

    return interpolateData(baseData.sort((a, b) => a.timestamp - b.timestamp));
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Analytics</h1>
            <p className="text-gray-500 mt-1">Monitor your code execution metrics</p>
          </div>
          <div className="flex gap-4">
            <ChartTypeSelect value={chartType} onChange={setChartType} />
            <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Executions"
            value={analyticsData?.summary?.totalExecutions.toLocaleString()}
            trend="up"
            trendValue="12.5% vs last period"
          />
          <MetricCard
            title="Success Rate"
            value={analyticsData?.summary?.successRate}
            trend="up"
            trendValue="2.1% vs last period"
          />
          <MetricCard
            title="Credits Used"
            value={analyticsData?.summary?.totalCreditsUsed.toLocaleString()}
            trend="down"
            trendValue="5% vs last period"
          />
          <MetricCard
            title="Avg Response Time"
            value="245ms"
            trend="down"
            trendValue="12ms improvement"
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Execution Trends - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Execution Trends</h3>
            <ExecutionTrendsChart 
              data={executionTrendsData}
              timeRange={timeRange}
              chartType={chartType}
            />
          </div>

          {/* Language Distribution - Takes up 1 column */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={languageChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {languageChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Language Usage Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LanguageUsageCard data={analyticsData?.summary?.languageBreakdown} />
          
          {/* Success/Failure Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Success/Failure Metrics</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData?.summary?.languageBreakdown || {}).map(([lang, data]) => (
                <div key={lang} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{lang}</span>
                    <span className="text-sm text-gray-500">
                      {((data.successful / (data.successful + data.failed)) * 100).toFixed(1)}% Success
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(data.successful / (data.successful + data.failed)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIUsageDashboard;
