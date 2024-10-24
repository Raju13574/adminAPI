import React from 'react';
import { CreditCard } from 'lucide-react';

const BalanceSection = ({ balance }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <CreditCard className="w-6 h-6 mr-2 text-indigo-600" />
        <h2 className="text-lg font-semibold">Balance</h2>
      </div>
      <p className="text-2xl font-bold">
        ${balance !== undefined ? balance.toFixed(2) : '0.00'}
      </p>
    </div>
  );
};

export default BalanceSection;