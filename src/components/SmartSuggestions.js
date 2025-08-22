import React from 'react';
import { Brain, Target, Zap, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const SmartSuggestions = ({ loans, totalStats }) => {
  const activeLoansSorted = loans
    .filter(loan => !loan.isCompleted)
    .sort((a, b) => b.interestRate - a.interestRate); // Highest interest first

  const generateSuggestions = () => {
    const suggestions = [];
    
    if (activeLoansSorted.length === 0) {
      return [{
        type: 'celebration',
        icon: '🎉',
        title: 'Congratulations!',
        description: 'You\'ve paid off all your loans! Consider building an emergency fund or investing.',
        color: 'green',
        priority: 'high'
      }];
    }

    // High interest rate suggestion
    const highestInterestLoan = activeLoansSorted[0];
    if (highestInterestLoan.interestRate > 6) {
      suggestions.push({
        type: 'avalanche',
        icon: '🎯',
        title: 'Focus on High Interest',
        description: `Pay extra on "${highestInterestLoan.name}" (${highestInterestLoan.interestRate}% APR) to save the most on interest.`,
        color: 'red',
        priority: 'high',
        loanId: highestInterestLoan.id
      });
    }

    // Small balance suggestion (snowball method)
    const smallestLoan = activeLoansSorted
      .sort((a, b) => a.currentBalance - b.currentBalance)[0];
    
    if (smallestLoan.currentBalance < 5000) {
      suggestions.push({
        type: 'snowball',
        icon: '⚡',
        title: 'Quick Win Available',
        description: `"${smallestLoan.name}" has only ${formatCurrency(smallestLoan.currentBalance)} left. Pay it off for a motivation boost!`,
        color: 'yellow',
        priority: 'medium',
        loanId: smallestLoan.id
      });
    }

    // Payment acceleration suggestion
    const totalMinPayments = activeLoansSorted.reduce((sum, loan) => sum + loan.minPayment, 0);
    const suggestedExtra = Math.round(totalMinPayments * 0.2); // 20% extra
    
    suggestions.push({
      type: 'acceleration',
      icon: '🚀',
      title: 'Accelerate Progress',
      description: `Add ${formatCurrency(suggestedExtra)} to your monthly payments to pay off loans ${calculateMonthsSaved(activeLoansSorted, suggestedExtra)} months faster.`,
      color: 'blue',
      priority: 'medium'
    });

    // Refinancing suggestion
    const avgInterestRate = activeLoansSorted.reduce((sum, loan) => 
      sum + (loan.interestRate * loan.currentBalance), 0) / 
      activeLoansSorted.reduce((sum, loan) => sum + loan.currentBalance, 0);
    
    if (avgInterestRate > 5) {
      suggestions.push({
        type: 'refinancing',
        icon: '💡',
        title: 'Consider Refinancing',
        description: `Your average rate is ${avgInterestRate.toFixed(1)}%. Research refinancing options to potentially lower your rates.`,
        color: 'purple',
        priority: 'low'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const calculateMonthsSaved = (loans, extraPayment) => {
    // Simplified calculation - in reality this would be more complex
    const totalBalance = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
    const totalMinPayment = loans.reduce((sum, loan) => sum + loan.minPayment, 0);
    
    const monthsWithoutExtra = Math.ceil(totalBalance / totalMinPayment);
    const monthsWithExtra = Math.ceil(totalBalance / (totalMinPayment + extraPayment));
    
    return Math.max(0, monthsWithoutExtra - monthsWithExtra);
  };

  const suggestions = generateSuggestions();

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-900/30 border-green-500/50 text-green-300',
      red: 'bg-red-900/30 border-red-500/50 text-red-300',
      yellow: 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300',
      blue: 'bg-blue-900/30 border-blue-500/50 text-blue-300',
      purple: 'bg-purple-900/30 border-purple-500/50 text-purple-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Brain className="text-purple-400" size={28} />
        Smart Payment Suggestions
      </h3>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border ${getColorClasses(suggestion.color)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{suggestion.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{suggestion.title}</h4>
                <p className="text-sm opacity-90">{suggestion.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                suggestion.priority === 'high' ? 'bg-red-500 text-white' :
                suggestion.priority === 'medium' ? 'bg-yellow-500 text-gray-900' :
                'bg-gray-500 text-white'
              }`}>
                {suggestion.priority.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="text-purple-400" size={20} />
          <h4 className="font-semibold text-purple-300">AI Insight</h4>
        </div>
        <p className="text-purple-200 text-sm">
          Based on your {loans.length} loans and {totalStats.overallProgress.toFixed(0)}% progress, 
          you're on track to save thousands in interest with strategic extra payments. 
          Keep up the momentum! 🚀
        </p>
      </div>
    </div>
  );
};

export default SmartSuggestions;