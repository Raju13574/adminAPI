import React from 'react';
import { Activity } from 'lucide-react';

const CreditsSection = ({ subscriptionData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <Activity className="w-6 h-6 mr-2 text-indigo-600" />
        <h2 className="text-lg font-semibold">Credits</h2>
      </div>
      <p className="text-xl font-bold">Remaining: {subscriptionData.remainingCredits}</p>
      <p className="text-sm text-gray-600">Daily Limit: {subscriptionData.creditsPerDay}</p>
      <p className="text-sm text-gray-600">Paid Credits: {subscriptionData.paidCredits}</p>
    </div>
  );
};

export default CreditsSection;