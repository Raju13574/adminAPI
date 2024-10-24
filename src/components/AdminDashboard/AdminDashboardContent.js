import React from 'react';
import { getDashboardStats, getAPIUsageStats, getUserStatistics, getSubscriptionMetrics, getTopUsers, getAllUsers } from '../../api/admin';

const AdminDashboardContent = ({ stats }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      {/* Add your dashboard content here */}
    </div>
  );
};

export default AdminDashboardContent;
