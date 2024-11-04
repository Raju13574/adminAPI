import React, { useState, useEffect } from 'react';
import { getAPIUsageStats, getUserStatistics, getSubscriptionMetrics, getTopUsers } from '../../api/admin';

const Analytics = () => {
  const [apiUsageStats, setApiUsageStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [subscriptionMetrics, setSubscriptionMetrics] = useState(null);
  const [topUsers, setTopUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [apiUsageResponse, userStatsResponse, subscriptionMetricsResponse, topUsersResponse] = await Promise.all([
          getAPIUsageStats(),
          getUserStatistics(),
          getSubscriptionMetrics(),
          getTopUsers()
        ]);

        setApiUsageStats(apiUsageResponse.data.data);
        setUserStats(userStatsResponse.data.data);
        setSubscriptionMetrics(subscriptionMetricsResponse.data.data);
        setTopUsers(topUsersResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <div>Loading analytics data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">API Usage</h3>
        <p>Total Calls: {apiUsageStats.totalCalls}</p>
        <p>Most Used Language: {apiUsageStats.mostUsedLanguage}</p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">User Statistics</h3>
        <p>Total Users: {userStats.totalUsers}</p>
        <h4 className="text-lg font-semibold mt-2">Users by Plan:</h4>
        <ul>
          {userStats.usersByPlan.map((plan, index) => (
            <li key={index}>{plan._id}: {plan.count}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Subscription Metrics</h3>
        <p>Active Subscriptions: {subscriptionMetrics.activeSubscriptions}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Top Users</h3>
        <ul>
          {topUsers.map((user, index) => (
            <li key={index}>User ID: {user._id}, Usage: {user.totalUsage || user.totalRevenue}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Analytics;
