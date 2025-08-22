import React from 'react';
import { Calendar, DollarSign, TrendingDown, Award } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const PaymentTimeline = ({ loans }) => {
  // Combine all payments from all loans and sort by date
  const allPayments = loans.flatMap(loan => 
    loan.payments.map(payment => ({
      ...payment,
      loanName: loan.name,
      loanId: loan.id,
      isCompletion: payment.balanceAfter === 0
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allPayments.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <Calendar className="text-blue-400" size={28} />
          Payment Timeline
        </h3>
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">No payments recorded yet</p>
          <p className="text-gray-500 text-sm">Make your first payment to see your timeline!</p>
        </div>
      </div>
    );
  }

  const totalPaid = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedLoans = allPayments.filter(p => p.isCompletion).length;

  return (
    <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <Calendar className="text-blue-400" size={28} />
          Payment Timeline
        </h3>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Payments</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-xl text-center">
          <DollarSign className="mx-auto text-green-400 mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{allPayments.length}</p>
          <p className="text-gray-400 text-sm">Total Payments</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-xl text-center">
          <TrendingDown className="mx-auto text-blue-400 mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{formatCurrency(totalPaid / allPayments.length)}</p>
          <p className="text-gray-400 text-sm">Avg Payment</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-xl text-center">
          <Award className="mx-auto text-yellow-400 mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{completedLoans}</p>
          <p className="text-gray-400 text-sm">Loans Completed</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {allPayments.map((payment, index) => (
            <div key={`${payment.loanId}-${payment.id}`} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                payment.isCompletion 
                  ? 'bg-yellow-500 shadow-lg shadow-yellow-500/25' 
                  : 'bg-green-500 shadow-lg shadow-green-500/25'
              }`}>
                {payment.isCompletion ? (
                  <Award className="text-gray-900" size={20} />
                ) : (
                  <DollarSign className="text-gray-900" size={20} />
                )}
              </div>

              {/* Payment info */}
              <div className="flex-1 bg-gray-700 p-4 rounded-xl border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{payment.loanName}</h4>
                    <p className="text-gray-400 text-sm">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${payment.isCompletion ? 'text-yellow-400' : 'text-green-400'}`}>
                      {formatCurrency(payment.amount)}
                    </p>
                    {payment.isCompletion && (
                      <p className="text-yellow-300 text-sm font-semibold">🎉 PAID OFF!</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Balance After:</span>
                  <span className="text-white font-medium">{formatCurrency(payment.balanceAfter)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentTimeline;