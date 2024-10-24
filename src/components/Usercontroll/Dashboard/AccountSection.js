import React from 'react';
import { User } from 'lucide-react';

const AccountSection = ({ subscriptionData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <User className="w-6 h-6 mr-2 text-indigo-600" />
        <h2 className="text-lg font-semibold">Account Status</h2>
      </div>
      <p className="text-2xl font-bold">{subscriptionData.status}</p>
      <p className="text-sm text-gray-600">Plan: {subscriptionData.plan}</p>
      <p className="text-sm text-gray-600">Start Date: {new Date(subscriptionData.startDate).toLocaleDateString()}</p>
      <p className="text-sm text-gray-600">End Date: {new Date(subscriptionData.endDate).toLocaleDateString()}</p>
    </div>
  );
};

export default AccountSection;