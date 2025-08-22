import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const PaymentModal = ({ isOpen, loan, onClose, onMakePayment }) => {
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleSubmit = () => {
    if (paymentAmount && loan) {
      onMakePayment(loan.id, paymentAmount);
      setPaymentAmount('');
    }
  };

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Make Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-400 mb-2">{loan.name}</h4>
          <p className="text-gray-300">Current Balance: <span className="font-bold text-white">{formatCurrency(loan.currentBalance)}</span></p>
          <p className="text-gray-300">Minimum Payment: <span className="font-bold text-white">{formatCurrency(loan.minPayment)}</span></p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">Payment Amount</label>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none text-xl"
            placeholder="Enter payment amount"
            autoFocus
          />
        </div>
        
        <div className="flex gap-3">
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
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;