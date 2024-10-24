import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Activity, TrendingUp, RefreshCw, ShoppingCart, Zap, ChevronRight, BarChart2, AlertCircle } from 'lucide-react';
import API from '../../api/config';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const AddFundsModal = ({ isOpen, onClose, onAddFunds }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Funds</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to add"
          className="w-full p-2 border rounded mb-3"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={() => {
              onAddFunds(amount);
              setAmount('');
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );
};

const PurchaseCreditsModal = ({ isOpen, onClose, onPurchaseCredits }) => {
  const [credits, setCredits] = useState('');

  if (!isOpen) return null;

  const cost = parseFloat(credits) * 0.01;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Purchase Credits</h3>
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          placeholder="Amount of credits"
          className="w-full p-2 border rounded mb-2"
        />
        {credits && (
          <p className="text-sm text-gray-600 mb-3">Cost: ${isNaN(cost) ? '0.00' : cost.toFixed(2)}</p>
        )}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={() => {
              onPurchaseCredits(credits);
              setCredits('');
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Purchase Credits
          </button>
        </div>
      </div>
    </div>
  );
};

const WalletContent = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isPurchaseCreditsModalOpen, setIsPurchaseCreditsModalOpen] = useState(false);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceResponse, transactionsResponse, creditSpentResponse, purchasedCreditsResponse] = await Promise.all([
        API.getWalletBalance(),
        API.getWalletTransactions(),
        API.getWalletCreditSpent(),
        API.getPurchasedCredits()
      ]);

      console.log('Fetched wallet data:', { 
        balance: balanceResponse.data, 
        transactions: transactionsResponse.data, 
        creditInfo: creditSpentResponse.data,
        purchasedCredits: purchasedCreditsResponse.data
      });

      setWalletData({
        balance: balanceResponse.data.balance,
        transactions: transactionsResponse.data.transactions,
        creditInfo: creditSpentResponse.data,
        purchasedCredits: purchasedCreditsResponse.data.purchasedCredits
      });
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError(`Failed to fetch wallet data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const handleAddFunds = async (amount) => {
    try {
      const response = await API.addFunds(parseFloat(amount));
      setWalletData(prevData => ({
        ...prevData,
        balance: response.data.totalAmount
      }));
      setSuccessMessage(`Successfully added $${amount} to your balance.`);
      setIsAddFundsModalOpen(false);
      fetchWalletData();
    } catch (err) {
      setError(`Failed to add funds: ${err.message}`);
    }
  };

  const handlePurchaseCredits = async (credits) => {
    try {
      const response = await API.purchaseCredits(parseInt(credits));
      console.log('Purchase credits response:', response.data);

      if (response.data.razorpayOrder) {
        setError('Insufficient balance. Please add funds to your wallet.');
      } else {
        setWalletData(prevData => ({
          ...prevData,
          balance: response.data.balance,
          purchasedCredits: {
            total: response.data.paidCredits,
            remaining: response.data.paidCredits
          }
        }));
        setSuccessMessage(`Successfully purchased ${credits} credits.`);
      }
      setIsPurchaseCreditsModalOpen(false);
      fetchWalletData(); // Fetch fresh data from the server
    } catch (err) {
      console.error('Error purchasing credits:', err);
      setError(`Failed to purchase credits: ${err.message}`);
    }
  };

  const renderCreditDistribution = () => {
    if (!walletData || !walletData.creditInfo) return null;

    const data = [
      { name: 'Free', value: walletData.creditInfo.freeCredits?.remaining || 0 },
      { name: 'Plan', value: walletData.creditInfo.planCredits?.remaining || 0 },
      { name: 'Paid', value: walletData.purchasedCredits?.remaining || 0 },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderCreditUsageChart = () => {
    if (!walletData || !walletData.creditUsageHistory) return null;

    return (
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={walletData.creditUsageHistory}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="credits" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin h-8 w-8 text-indigo-500" /></div>;
  if (error) return (
    <div className="text-red-500 text-center py-10">
      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
      {error}
      <button onClick={fetchWalletData} className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors">
        Retry
      </button>
    </div>
  );

  if (!walletData) return null;

  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-lg">
      {(successMessage || error) && (
        <div className={`p-4 rounded-lg mb-4 ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {successMessage || error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
            <CreditCard className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${walletData.balance.toFixed(2)}</p>
          <button 
            onClick={() => setIsAddFundsModalOpen(true)}
            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors flex items-center justify-center w-full"
          >
            Add Funds <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Today's Usage</h3>
            <Activity className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{walletData.creditInfo.todayUsed} / {walletData.creditInfo.totalDailyCredits}</p>
          <div className="mt-2 bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-indigo-500 h-2 rounded-full" 
              style={{width: `${(walletData.creditInfo.todayUsed / walletData.creditInfo.totalDailyCredits) * 100}%`}}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {walletData.creditInfo.todayRemaining} credits remaining
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Purchased Credits</h3>
            <ShoppingCart className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {walletData.purchasedCredits?.remaining || 0}
          </p>
          <p className="text-sm text-gray-600">
            Out of {walletData.purchasedCredits?.total || 0} total
          </p>
          <button 
            onClick={() => setIsPurchaseCreditsModalOpen(true)}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center w-full"
          >
            Purchase Credits <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Current Plan</h3>
            <Zap className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-xl font-semibold text-gray-900 capitalize">{walletData.creditInfo.planType}</p>
          <p className="text-sm text-gray-600">{walletData.creditInfo.totalDailyCredits} credits / day</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors flex items-center justify-center w-full">
            Upgrade Plan <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-indigo-500" />
            Credit Distribution
          </h3>
          {renderCreditDistribution()}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
            Weekly Credit Usage
          </h3>
          {renderCreditUsageChart()}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
          Recent Transactions
        </h3>
        <ul className="space-y-4">
          {walletData.transactions.slice(0, 5).map((transaction, index) => (
            <li key={index} className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600">{transaction.description}</span>
              <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
          View All Transactions <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        onAddFunds={handleAddFunds}
      />
      <PurchaseCreditsModal
        isOpen={isPurchaseCreditsModalOpen}
        onClose={() => setIsPurchaseCreditsModalOpen(false)}
        onPurchaseCredits={handlePurchaseCredits}
      />
    </div>
  );
};

export default WalletContent;
