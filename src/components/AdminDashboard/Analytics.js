import React from 'react';

const Analytics = ({ apiUsageStats, userStats, subscriptionMetrics, topUsers }) => {
  if (!apiUsageStats || !userStats || !subscriptionMetrics || !topUsers) {
    return <div>Loading analytics data...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">API Usage</h3>
        <p>Total Calls: {apiUsageStats.totalCalls || 'N/A'}</p>
        <p>Most Used Language: {apiUsageStats.mostUsedLanguage || 'N/A'}</p>
        {/* Add more API usage stats as needed */}
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">User Statistics</h3>
        <p>Total Users: {userStats.totalUsers || 'N/A'}</p>
        <h4 className="text-lg font-semibold mt-2">Users by Plan:</h4>
        <ul>
          {userStats.usersByPlan && userStats.usersByPlan.map((plan, index) => (
            <li key={index}>{plan._id}: {plan.count}</li>
          ))}
        </ul>
        {/* Add more user stats as needed */}
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Subscription Metrics</h3>
        <p>Active Subscriptions: {subscriptionMetrics.activeSubscriptions || 'N/A'}</p>
        {/* Add more subscription metrics as needed */}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Top Users</h3>
        <ul>
          {topUsers.map((user, index) => (
            <li key={index}>User ID: {user._id}, Usage: {user.totalUsage || user.totalRevenue || 'N/A'}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Analytics;
