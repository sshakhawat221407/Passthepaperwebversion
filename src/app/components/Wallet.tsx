import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { Footer } from './Footer';
import { useMockData } from '../utils/MockDataContext';
import { Wallet as WalletIcon, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, DollarSign, Award, ArrowDown } from 'lucide-react';

type WalletProps = {
  user: User;
};

type Transaction = {
  id: string;
  type: 'add' | 'purchase' | 'upload_reward' | 'withdrawal';
  amount: number;
  currency: 'BDT' | 'Points';
  description: string;
  createdAt: string;
};

export function Wallet({ user }: WalletProps) {
  const mockData = useMockData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Bkash' | 'Nagad' | 'Card'>('Bkash');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'Bkash' | 'Nagad' | 'Bank Transfer'>('Bkash');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [mockData.transactions]);

  const fetchTransactions = () => {
    setLoading(true);
    const userTransactions = mockData.transactions.filter(t => t.userId === user.id);
    setTransactions(userTransactions);
    setLoading(false);
  };

  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    mockData.addTransaction({
      userId: user.id,
      type: 'add',
      amount: parseFloat(amount),
      currency: 'BDT',
      description: `Added BDT via ${paymentMethod}`,
      paymentMethod: paymentMethod,
    });

    setShowAddFunds(false);
    setAmount('');
    fetchTransactions();
  };

  const handleWithdrawal = () => {
    const withdrawAmount = parseFloat(amount);
    if (!amount || withdrawAmount <= 0) return;
    
    if (withdrawAmount > user.walletBalance) {
      alert('Insufficient BDT balance');
      return;
    }

    if (!accountNumber || accountNumber.length < 10) {
      alert('Please enter a valid account number');
      return;
    }

    mockData.addWithdrawal({
      userId: user.id,
      amount: withdrawAmount,
      method: withdrawalMethod,
      accountNumber: accountNumber,
      status: 'pending',
    });

    mockData.addTransaction({
      userId: user.id,
      type: 'withdrawal',
      amount: withdrawAmount,
      currency: 'BDT',
      description: `Withdrawal via ${withdrawalMethod}`,
      paymentMethod: withdrawalMethod,
    });

    setShowWithdrawal(false);
    setAmount('');
    setAccountNumber('');
    fetchTransactions();
  };

  const getTransactionType = (type: string): 'credit' | 'debit' => {
    return (type === 'purchase' || type === 'withdrawal') ? 'debit' : 'credit';
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h2 className="text-3xl font-bold mb-6">My Wallet</h2>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* BDT Balance Card */}
          <div className="bg-gradient-to-br from-[#E56E20] to-[#D35A10] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 mb-1 text-sm">BDT Balance</p>
                <h3 className="text-4xl font-bold">৳{user.walletBalance}</h3>
                <p className="text-white/80 mt-1 text-sm">Bangladeshi Taka</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowAddFunds(true)}
                className="bg-white text-[#E56E20] py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
              >
                <Plus size={16} />
                Add BDT
              </button>
              <button
                onClick={() => setShowWithdrawal(true)}
                className="bg-white/20 backdrop-blur-sm text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors text-sm"
              >
                <ArrowDown size={16} />
                Withdraw
              </button>
            </div>
          </div>

          {/* Points Balance Card */}
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 mb-1 text-sm">Reward Points</p>
                <h3 className="text-4xl font-bold">{user.rewardPoints || 0}</h3>
                <p className="text-white/80 mt-1 text-sm">Earned from Sales</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Award size={24} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-4">
              <p className="text-xs text-white/90">
                💡 Earn points when buyers purchase your uploads using points
              </p>
            </div>
          </div>
        </div>

        {/* Add Funds Modal */}
        {showAddFunds && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Add BDT to Wallet</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (BDT)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">Minimum: ৳10</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'Bkash', name: 'bKash', color: '#E2136E' },
                    { id: 'Nagad', name: 'Nagad', color: '#F26522' },
                    { id: 'Card', name: 'Credit/Debit Card', color: '#3B82F6' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#E56E20] bg-[#FFF5F0]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: method.color }}
                        >
                          <CreditCard size={20} color="white" />
                        </div>
                        <span className="font-semibold">{method.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddFunds(false);
                    setAmount('');
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFunds}
                  className="flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-colors"
                  style={{ backgroundColor: '#E56E20' }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Modal */}
        {showWithdrawal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Withdraw BDT</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Available Balance:</strong> ৳{user.walletBalance}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount (BDT)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  max={user.walletBalance}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">Minimum: ৳50</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Withdrawal Method
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'Bkash', name: 'bKash', color: '#E2136E' },
                    { id: 'Nagad', name: 'Nagad', color: '#F26522' },
                    { id: 'Bank Transfer', name: 'Bank Transfer', color: '#10B981' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setWithdrawalMethod(method.id as any)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        withdrawalMethod === method.id
                          ? 'border-[#E56E20] bg-[#FFF5F0]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-semibold">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {withdrawalMethod === 'Bank Transfer' ? 'Account Number' : 'Mobile Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={withdrawalMethod === 'Bank Transfer' ? 'Enter account number' : '01XXXXXXXXX'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowWithdrawal(false);
                    setAmount('');
                    setAccountNumber('');
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawal}
                  className="flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-colors"
                  style={{ backgroundColor: '#E56E20' }}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Earned</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#E56E20' }}>
              ৳{transactions.filter(t => t.currency === 'BDT' && getTransactionType(t.type) === 'credit').reduce((sum, t) => sum + t.amount, 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ArrowDownRight size={20} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Spent</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#E56E20' }}>
              ৳{transactions.filter(t => t.currency === 'BDT' && getTransactionType(t.type) === 'debit').reduce((sum, t) => sum + t.amount, 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <WalletIcon size={20} className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Transactions</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#E56E20' }}>
              {transactions.length}
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Transaction History</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#E56E20' }}></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <WalletIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const transactionType = getTransactionType(transaction.type);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transactionType === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {transactionType === 'credit' ? (
                          <ArrowUpRight size={20} className="text-green-600" />
                        ) : (
                          <ArrowDownRight size={20} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold text-lg ${
                          transactionType === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transactionType === 'credit' ? '+' : '-'}
                        {transaction.currency === 'BDT' ? '৳' : ''}{transaction.amount}
                        {transaction.currency === 'Points' ? ' Points' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}