import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EditLoanModal = ({ isOpen, loan, onClose, onEditLoan }) => {
  const [editedLoan, setEditedLoan] = useState({
    name: '',
    originalBalance: '',
    currentBalance: '',
    interestRate: '',
    minPayment: ''
  });

  useEffect(() => {
    if (loan) {
      setEditedLoan({
        name: loan.name,
        originalBalance: loan.originalBalance,
        currentBalance: loan.currentBalance,
        interestRate: loan.interestRate,
        minPayment: loan.minPayment
      });
    }
  }, [loan]);

  const handleSubmit = () => {
    if (editedLoan.name && editedLoan.originalBalance && editedLoan.currentBalance) {
      onEditLoan(loan.id, editedLoan);
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setEditedLoan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Edit Loan</h3>
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
              value={editedLoan.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="e.g., Federal Stafford Loan"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Original Balance</label>
            <input
              type="number"
              value={editedLoan.originalBalance}
              onChange={(e) => handleInputChange('originalBalance', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="25000"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Current Balance</label>
            <input
              type="number"
              value={editedLoan.currentBalance}
              onChange={(e) => handleInputChange('currentBalance', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="22500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={editedLoan.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="4.5"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Minimum Payment</label>
            <input
              type="number"
              value={editedLoan.minPayment}
              onChange={(e) => handleInputChange('minPayment', e.target.value)}
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
            className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLoanModal;