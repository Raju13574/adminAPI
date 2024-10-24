import React from 'react';
import { getDashboardStats, getAPIUsageStats, getUserStatistics, getSubscriptionMetrics, getTopUsers, getAllUsers } from '../../api/admin';

const AdminDashboardContent = ({ stats }) => {
  if (!stats) {
    return <div>Loading dashboard stats...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Daily" stats={stats.daily} />
        <DashboardCard title="Weekly" stats={stats.weekly} />
        <DashboardCard title="Monthly" stats={stats.monthly} />
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Top Languages</h3>
        <ul>
          {stats.topLanguages.map((lang, index) => (
            <li key={index} className="mb-1">
              {lang._id}: {lang.count} calls
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <p className="font-semibold">Most Used Language: {stats.mostUsedLanguage}</p>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, stats }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p>API Calls: {stats.apiCalls}</p>
    <p>New Users: {stats.newUsers}</p>
    <p>Revenue: ${stats.revenue.toFixed(2)}</p>
  </div>
);

export default AdminDashboardContent;
