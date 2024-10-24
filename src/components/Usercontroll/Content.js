import React from 'react';
import { User, CreditCard, Activity } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <Icon className="w-6 h-6 text-indigo-500" />
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const ActivityList = ({ transactions }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
    <ul className="space-y-4">
      {transactions.map((transaction, index) => (
        <li key={index} className="flex items-center justify-between">
          <span className="text-gray-600">{transaction.description}</span>
          <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const DashboardContent = ({ user, balance, subscriptionData, transactions }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard 
        title="Account Status" 
        value={subscriptionData.status} 
        icon={User} 
      />
      <DashboardCard 
        title="Balance" 
        value={`$${balance.toFixed(2)}`} 
        icon={CreditCard} 
      />
      <DashboardCard 
        title="Remaining Credits" 
        value={subscriptionData.remainingCredits === 'Unlimited' ? 'Unlimited' : subscriptionData.remainingCredits} 
        icon={Activity} 
      />
    </div>
    <div className="mt-8">
      <ActivityList transactions={transactions} />
    </div>
  </div>
);

export default DashboardContent;