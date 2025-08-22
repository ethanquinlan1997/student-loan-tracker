import React from 'react';
import { CheckCircle, Trash2, Edit } from 'lucide-react';
import { formatCurrency, calculateProgress, getProgressColor } from '../utils/calculations';

const LoanCard = ({ loan, onPaymentClick, onDelete, onEdit }) => {
  const progress = calculateProgress(loan);
  
  return (
    <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 ${
      loan.isCompleted 
        ? 'bg-green-900/20 border-green-500/50 shadow-lg shadow-green-500/20' 
        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg sm:text-xl font-bold truncate ${loan.isCompleted ? 'text-green-400' : 'text-white'}`}>
            {loan.name}
            {loan.isCompleted && <CheckCircle className="inline ml-2" size={18} />}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            {loan.isCompleted ? `Completed on ${loan.completedDate}` : `${loan.interestRate}% APR`}
          </p>
        </div>
        {!loan.isCompleted && (
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => onEdit(loan)}
              className="text-gray-500 hover:text-blue-400 transition-colors p-1"
              title="Edit loan"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(loan.id)}
              className="text-gray-500 hover:text-red-400 transition-colors p-1"
              title="Delete loan"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {loan.isCompleted ? (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Original Balance:</span>
            <span className="text-white font-semibold">{formatCurrency(loan.originalBalance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Total Paid:</span>
            <span className="text-green-400 font-bold">{formatCurrency(loan.originalBalance)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
            <div className="bg-green-500 h-2 sm:h-3 rounded-full w-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">100%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Current Balance</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(loan.currentBalance)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Original Balance</p>
              <p className="text-sm sm:text-lg text-gray-300">{formatCurrency(loan.originalBalance)}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs sm:text-sm">Progress</span>
              <span className="text-white font-semibold text-sm">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
              <div 
                className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <button
              onClick={() => onPaymentClick(loan)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 py-2 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              Make Payment
            </button>
            <div className="text-center sm:text-right">
              <p className="text-gray-400 text-xs">Min Payment</p>
              <p className="text-white font-semibold text-sm">{formatCurrency(loan.minPayment)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCard;