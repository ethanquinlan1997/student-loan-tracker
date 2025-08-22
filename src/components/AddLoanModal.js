import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddLoanModal = ({ isOpen, onClose, onAddLoan }) => {
  const [newLoan, setNewLoan] = useState({
    name: '',
    originalBalance: '',
    currentBalance: '',
    interestRate: '',
    minPayment: ''
  });

  const handleSubmit = () => {
    if (newLoan.name && newLoan.originalBalance && newLoan.currentBalance) {
      onAddLoan(newLoan);
      setNewLoan({ name: '', originalBalance: '', currentBalance: '', interestRate: '', minPayment: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Add New Loan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Loan Name</label>
            <input
              type="text"
              value={newLoan.name}
              onChange={(e) => setNewLoan({...newLoan, name: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="e.g., Federal Stafford Loan"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Original Balance</label>
            <input
              type="number"
              value={newLoan.originalBalance}
              onChange={(e) => setNewLoan({...newLoan, originalBalance: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="25000"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Current Balance</label>
            <input
              type="number"
              value={newLoan.currentBalance}
              onChange={(e) => setNewLoan({...newLoan, currentBalance: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="22500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={newLoan.interestRate}
              onChange={(e) => setNewLoan({...newLoan, interestRate: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="4.5"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Minimum Payment</label>
            <input
              type="number"
              value={newLoan.minPayment}
              onChange={(e) => setNewLoan({...newLoan, minPayment: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="280"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
          >
            Add Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLoanModal;