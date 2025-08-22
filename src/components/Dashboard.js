import React from 'react';
import { Target, TrendingDown, DollarSign, Award } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const Dashboard = ({ stats }) => {
  const {
    totalOriginalDebt,
    totalCurrentDebt,
    totalPaidOff,
    overallProgress,
    completedLoans,
    totalLoans
  } = stats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-gray-800 border border-gray-700 p-3 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-gray-750 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Target className="text-green-400" size={20} />
          <h3 className="text-sm sm:text-lg font-semibold text-white">Progress</h3>
        </div>
        <p className="text-xl sm:text-3xl font-bold text-green-400">{overallProgress.toFixed(1)}%</p>
        <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mt-2 sm:mt-3">
          <div 
            className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-3 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-gray-750 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <TrendingDown className="text-red-400" size={20} />
          <h3 className="text-sm sm:text-lg font-semibold text-white">Remaining</h3>
        </div>
        <p className="text-lg sm:text-3xl font-bold text-white">{formatCurrency(totalCurrentDebt)}</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">of {formatCurrency(totalOriginalDebt)}</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-3 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-gray-750 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <DollarSign className="text-green-400" size={20} />
          <h3 className="text-sm sm:text-lg font-semibold text-white">Paid Off</h3>
        </div>
        <p className="text-lg sm:text-3xl font-bold text-green-400">{formatCurrency(totalPaidOff)}</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Keep it up!</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-3 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-gray-750 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Award className="text-yellow-400" size={20} />
          <h3 className="text-sm sm:text-lg font-semibold text-white">Complete</h3>
        </div>
        <p className="text-lg sm:text-3xl font-bold text-yellow-400">{completedLoans}</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">of {totalLoans} loans</p>
      </div>
    </div>
  );
};

export default Dashboard;