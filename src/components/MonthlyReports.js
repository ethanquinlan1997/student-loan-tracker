import React, { useState, useMemo } from 'react';
import { FileText, Calendar, TrendingUp, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const MonthlyReports = ({ loans, user }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  const generateMonthlyReport = (month) => {
    const startDate = new Date(month + '-01');
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    // Get all payments in this month
    const monthlyPayments = loans.flatMap(loan =>
      loan.payments
        .filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= startDate && paymentDate <= endDate;
        })
        .map(payment => ({
          ...payment,
          loanName: loan.name,
          loanId: loan.id
        }))
    );

    const totalPaid = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const avgPayment = totalPaid / Math.max(monthlyPayments.length, 1);
    const loansWorkedOn = new Set(monthlyPayments.map(p => p.loanId)).size;
    const completedThisMonth = monthlyPayments.filter(p => p.balanceAfter === 0).length;

    return {
      month,
      monthName: startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      payments: monthlyPayments,
      totalPaid,
      avgPayment,
      paymentCount: monthlyPayments.length,
      loansWorkedOn,
      completedThisMonth,
      insights: generateInsights(monthlyPayments, totalPaid)
    };
  };

  const generateInsights = (payments, totalPaid) => {
    const insights = [];
    
    if (payments.length === 0) {
      insights.push({
        type: 'info',
        icon: '📅',
        text: 'No payments recorded this month'
      });
      return insights;
    }

    if (totalPaid > 1000) {
      insights.push({
        type: 'success',
        icon: '🚀',
        text: `Outstanding month! You paid ${formatCurrency(totalPaid)} toward your loans.`
      });
    }

    if (payments.some(p => p.balanceAfter === 0)) {
      insights.push({
        type: 'celebration',
        icon: '🎉',
        text: 'You completed a loan this month! Incredible progress!'
      });
    }

    const extraPayments = payments.filter(p => {
      const loan = loans.find(l => l.id === p.loanId);
      return p.amount > loan?.minPayment;
    });

    if (extraPayments.length > 0) {
      const totalExtra = extraPayments.reduce((sum, p) => {
        const loan = loans.find(l => l.id === p.loanId);
        return sum + (p.amount - loan.minPayment);
      }, 0);
      
      insights.push({
        type: 'success',
        icon: '💪',
        text: `You paid an extra ${formatCurrency(totalExtra)} above minimums!`
      });
    }

    if (payments.length >= 5) {
      insights.push({
        type: 'info',
        icon: '⚡',
        text: `High activity month with ${payments.length} payments made.`
      });
    }

    return insights;
  };

  const currentReport = useMemo(() => generateMonthlyReport(selectedMonth), [selectedMonth, loans]);

  // Get available months (months with payments)
  const availableMonths = useMemo(() => {
    const months = new Set();
    loans.forEach(loan => {
      loan.payments.forEach(payment => {
        months.add(payment.date.slice(0, 7)); // YYYY-MM
      });
    });
    return Array.from(months).sort().reverse();
  }, [loans]);

  const navigateMonth = (direction) => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (direction === 'prev' && currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1]);
    }
  };

  const getInsightColor = (type) => {
    const colors = {
      success: 'bg-green-900/30 border-green-500/50 text-green-300',
      celebration: 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300',
      info: 'bg-blue-900/30 border-blue-500/50 text-blue-300',
      warning: 'bg-orange-900/30 border-orange-500/50 text-orange-300'
    };
    return colors[type] || colors.info;
  };

  if (availableMonths.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <FileText className="text-blue-400" size={28} />
          Monthly Reports
        </h3>
        <div className="text-center py-8">
          <FileText className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">No payment data available yet</p>
          <p className="text-gray-500 text-sm">Make some payments to generate monthly reports!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="text-blue-400" size={28} />
          Monthly Reports
        </h3>
        
        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="text-white" size={20} />
          </button>
          
          <div className="text-center min-w-[200px]">
            <h4 className="text-xl font-bold text-white">{currentReport.monthName}</h4>
            <p className="text-gray-400 text-sm">
              {availableMonths.indexOf(selectedMonth) + 1} of {availableMonths.length} months
            </p>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            disabled={availableMonths.indexOf(selectedMonth) === 0}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded-lg transition-colors"
          >
            <ChevronRight className="text-white" size={20} />
          </button>
        </div>
      </div>

      {/* Report Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-xl text-center">
          <Calendar className="mx-auto text-blue-400 mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{currentReport.paymentCount}</p>
          <p className="text-gray-400 text-sm">Payments Made</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-xl text-center">
          <TrendingUp className="mx-auto text-green-400 mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{formatCurrency(currentReport.totalPaid)}</p>
          <p className="text-gray-400 text-sm">Total Paid</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-xl text-center">
          <FileText className="mx-auto text-purple-400 mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{formatCurrency(currentReport.avgPayment)}</p>
          <p className="text-gray-400 text-sm">Avg Payment</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-xl text-center">
          <Award className="mx-auto text-yellow-400 mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{currentReport.completedThisMonth}</p>
          <p className="text-gray-400 text-sm">Loans Completed</p>
        </div>
      </div>

      {/* Insights */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">Monthly Insights</h4>
        <div className="space-y-3">
          {currentReport.insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{insight.icon}</span>
                <p className="text-sm">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      {currentReport.payments.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Payment Details</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {currentReport.payments.map((payment, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-white">{payment.loanName}</p>
                  <p className="text-gray-400 text-sm">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">{formatCurrency(payment.amount)}</p>
                  {payment.balanceAfter === 0 && (
                    <p className="text-yellow-400 text-xs">🎉 COMPLETED!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Report Button */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <button
          onClick={() => {
            // This would generate a downloadable PDF report
            alert('PDF report generation would be implemented here!');
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <FileText size={20} />
          Download Detailed Report
        </button>
      </div>
    </div>
  );
};

export default MonthlyReports;