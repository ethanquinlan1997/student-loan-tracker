import React from 'react';
import { formatCurrency } from '../utils/calculations';

const CelebrationModal = ({ isOpen, loan, onClose }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-12 rounded-3xl border-2 border-green-400 text-center max-w-lg animate-bounce">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-4xl font-bold text-green-400 mb-4">Congratulations!</h2>
        <p className="text-xl text-white mb-2">You've paid off</p>
        <p className="text-2xl font-bold text-green-300 mb-4">{loan.name}</p>
        <p className="text-3xl font-bold text-green-400">{formatCurrency(loan.originalBalance)}</p>
        <p className="text-lg text-green-200 mt-4">One step closer to financial freedom! 🚀</p>
      </div>
    </div>
  );
};

export default CelebrationModal;