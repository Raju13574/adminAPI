import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Activity, TrendingUp, RefreshCw, ShoppingCart, Zap, ChevronRight, BarChart2, AlertCircle, X, CheckCircle, XCircle } from 'lucide-react';
import API from '../../api/config';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const AddFundsModal = ({ isOpen, onClose, onAddFunds }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 100) {
      setError('Minimum deposit amount is ₹100');
      return;
    }
    setError('');
    onAddFunds(amountNum);
    setAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Funds</h3>
        <div className="mb-4">
          <input
            type="number"
            min="100"
            step="1"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            placeholder="Amount to add (min ₹100)"
            className="w-full p-2 border rounded mb-1"
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            Minimum deposit amount: ₹100
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
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
  const [error, setError] = useState('');
  const [cost, setCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Calculate cost whenever credits change
    const creditNum = parseInt(credits);
    setCost(isNaN(creditNum) ? 0 : creditNum * 0.50);
    // Clear error when input changes
    if (error) setError('');
  }, [credits]);

  const handlePurchase = async () => {
    try {
      setError('');
      setIsProcessing(true);

      // Input validation
      const creditNum = parseInt(credits);
      if (!credits || isNaN(creditNum)) {
        setError('Please enter a valid number of credits');
        return;
      }

      if (creditNum < 200) {
        setError('Minimum purchase is 200 credits');
        return;
      }

      await onPurchaseCredits(creditNum);
      setCredits('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to purchase credits');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Purchase Credits</h3>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          type="number"
          min="200"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          placeholder="Amount of credits (min: 200)"
          className="w-full p-2 border rounded mb-2"
          disabled={isProcessing}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        {credits && !error && (
          <p className="text-sm text-gray-600 mb-3">
            Cost: ₹{isNaN(cost) ? '0.00' : cost.toFixed(2)}
          </p>
        )}

        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isProcessing || !credits || error}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Purchase Credits'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AllTransactionsModal = ({ isOpen, onClose, transactions }) => {
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b">
                <th className="text-left pb-3 text-gray-600 font-medium">Date</th>
                <th className="text-left pb-3 text-gray-600 font-medium">Description</th>
                <th className="text-right pb-3 text-gray-600 font-medium">Amount</th>
                <th className="text-right pb-3 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 text-sm text-gray-500">
                    {transaction.formattedDate}
                  </td>
                  <td className="py-3 text-sm text-gray-700">
                    {transaction.description}
                    {transaction.credits > 0 && (
                      <span className="ml-1 text-xs text-gray-500">
                        ({transaction.credits} credits)
                      </span>
                    )}
                  </td>
                  <td className={`py-3 text-sm font-medium text-right ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.formattedAmount}
                  </td>
                  <td className="py-3 text-sm text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceResponse, transactionsResponse, purchasedCreditsResponse] = await Promise.all([
        API.getWalletBalance(),
        API.getWalletTransactions(),
        API.getPurchasedCredits()
      ]);

      const balance = balanceResponse.data.balanceInRupees || 0;

      setWalletData({
        balance: Number.isFinite(balance) ? balance : 0,
        transactions: transactionsResponse.data.transactions || [],
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
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum < 100) {
        setError('Minimum deposit amount is ₹100');
        return;
      }

      const response = await API.addFunds(amountNum);
      
      if (response.data) {
        setWalletData(prevData => ({
          ...prevData,
          balance: response.data.totalAmountInRupees
        }));
        setSuccessMessage(`Successfully added ₹${amountNum.toFixed(2)} to your balance.`);
        setIsAddFundsModalOpen(false);
        fetchWalletData();
      }
    } catch (err) {
      console.error('Add funds error:', err);
      setError(err.response?.data?.message || `Failed to add funds: ${err.message}`);
    }
  };

  const handlePurchaseCredits = async (credits) => {
    try {
      const response = await API.purchaseCredits(parseInt(credits));
      console.log('Purchase credits response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to purchase credits.');
      } else {
        setWalletData(prevData => ({
          ...prevData,
          balance: response.data.newBalanceInRupees,
          purchasedCredits: response.data.purchasedCredits
        }));
        setSuccessMessage(`Successfully purchased ${credits} credits.`);
        setIsPurchaseCreditsModalOpen(false);
        fetchWalletData();
      }
    } catch (err) {
      console.error('Error purchasing credits:', err);
      throw new Error(err.response?.data?.message || `Failed to purchase credits: ${err.message}`);
    }
  };

  // Create modalProps object
  const modalProps = {
    isOpen: {
      addFunds: isAddFundsModalOpen,
      purchaseCredits: isPurchaseCreditsModalOpen,
      allTransactions: isAllTransactionsModalOpen
    },
    onClose: {
      addFunds: () => setIsAddFundsModalOpen(false),
      purchaseCredits: () => setIsPurchaseCreditsModalOpen(false),
      allTransactions: () => setIsAllTransactionsModalOpen(false)
    },
    onSubmit: {
      addFunds: handleAddFunds,
      purchaseCredits: handlePurchaseCredits
    },
    data: {
      transactions: walletData?.transactions || []
    }
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
    <div className="p-1">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        {/* Balance Section */}
        <div className="relative bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/60">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"/>
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"/>
          
          <div className="relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Wallet Balance</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl font-bold text-slate-800">₹{(walletData?.balance || 0).toFixed(2)}</span>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      walletData?.lastBalance > walletData?.balance 
                        ? 'text-red-700 bg-red-100' 
                        : 'text-emerald-700 bg-emerald-100'
                    }`}>
                      {walletData?.lastBalance > walletData?.balance ? '↓' : '↑'} 
                      {Math.abs(walletData?.balance - (walletData?.lastBalance || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Stats */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end space-x-4 sm:space-x-0">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Previous</p>
                  <p className="text-sm font-semibold text-slate-600">₹{(walletData?.lastBalance || 0).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">24h Change</p>
                  <p className={`text-sm font-semibold ${walletData?.balance > walletData?.lastBalance ? 'text-emerald-600' : 'text-red-600'}`}>
                    {walletData?.balance > walletData?.lastBalance ? '+' : '-'}
                    ₹{Math.abs(walletData?.balance - (walletData?.lastBalance || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Monthly Spend</p>
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-lg font-semibold text-slate-800 mt-1">₹{(walletData?.monthlySpend || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Total Deposits</p>
                  <Activity className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-lg font-semibold text-slate-800 mt-1">₹{(walletData?.totalDeposits || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => setIsAddFundsModalOpen(true)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center group hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Add Funds to Wallet
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Credits Section */}
        <div className="relative bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/60">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl"/>
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl"/>
          
          <div className="relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
              <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Available Credits</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800">
                      {walletData.purchasedCredits?.remaining || 0}
                    </span>
                    <span className="text-sm text-slate-500">
                      of {walletData.purchasedCredits?.total || 0} total
                    </span>
                  </div>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${((walletData.purchasedCredits?.remaining || 0) / (walletData.purchasedCredits?.total || 1)) * 226} 226`}
                    className="text-emerald-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-slate-800">
                    {Math.round(((walletData.purchasedCredits?.remaining || 0) / (walletData.purchasedCredits?.total || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-xl border border-slate-200/60">
                <p className="text-xs text-slate-500 mb-1">Credits Used</p>
                <p className="text-lg font-semibold text-slate-800">
                  {(walletData.purchasedCredits?.total || 0) - (walletData.purchasedCredits?.remaining || 0)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-xl border border-slate-200/60">
                <p className="text-xs text-slate-500 mb-1">Total Credits</p>
                <p className="text-lg font-semibold text-slate-800">
                  {walletData.purchasedCredits?.total || 0}
                </p>
              </div>
              <div className="hidden sm:block p-3 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-xl border border-slate-200/60">
                <p className="text-xs text-slate-500 mb-1">Avg. Monthly Usage</p>
                <p className="text-lg font-semibold text-slate-800">
                  {walletData.purchasedCredits?.monthlyAvg || 0}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => setIsPurchaseCreditsModalOpen(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center group hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              Purchase More Credits
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-1 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">Recent Transactions</h3>
                <p className="text-xs text-slate-500">Last 5 transactions</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-4 px-6 text-xs font-medium text-slate-500">Date & Time</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-slate-500">Description</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-slate-500">Amount</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {walletData.transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id} 
                    className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm text-slate-600">{transaction.formattedDate}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{transaction.description}</td>
                  <td className={`py-4 px-6 text-sm font-medium text-right ${
                    transaction.type === 'deposit' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {transaction.formattedAmount}
                  </td>
                  <td className="py-4 px-6 text-sm text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-3 border-t border-slate-100">
          <button 
            onClick={() => setIsAllTransactionsModalOpen(true)}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center group"
          >
            View All Transactions 
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Toast Messages */}
      {(successMessage || error) && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg text-sm flex items-center space-x-2 ${
          successMessage ? 'bg-white border border-emerald-100 text-emerald-700' : 'bg-white border border-red-100 text-red-700'
        }`}>
          <div className={`p-2 rounded-lg ${successMessage ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {successMessage ? 
              <CheckCircle className="w-4 h-4 text-emerald-500"/> : 
              <XCircle className="w-4 h-4 text-red-500"/>
            }
          </div>
          <span className="font-medium">{successMessage || error}</span>
          <button onClick={() => {setSuccessMessage(''); setError('');}} 
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Update modal components with specific props */}
      <AddFundsModal 
        isOpen={modalProps.isOpen.addFunds}
        onClose={modalProps.onClose.addFunds}
        onAddFunds={modalProps.onSubmit.addFunds}
      />
      <PurchaseCreditsModal 
        isOpen={modalProps.isOpen.purchaseCredits}
        onClose={modalProps.onClose.purchaseCredits}
        onPurchaseCredits={modalProps.onSubmit.purchaseCredits}
      />
      <AllTransactionsModal 
        isOpen={modalProps.isOpen.allTransactions}
        onClose={modalProps.onClose.allTransactions}
        transactions={modalProps.data.transactions}
      />
    </div>
  );
};

export default WalletContent;
