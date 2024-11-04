import React from 'react';

const APIUsageTab = ({ apiStats }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">API Usage Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total API Calls</h3>
          <p className="text-3xl font-bold">{apiStats?.totalCalls || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Average Response Time</h3>
          <p className="text-3xl font-bold">{apiStats?.avgResponseTime || 0} ms</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Error Rate</h3>
          <p className="text-3xl font-bold">{apiStats?.errorRate || 0}%</p>
        </div>
      </div>
    </div>
  );
};

export default APIUsageTab;
