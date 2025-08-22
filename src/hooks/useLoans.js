import { useState, useEffect, useMemo } from 'react';

const initialLoans = [
  {
    id: 1,
    name: 'Federal Stafford Loan',
    originalBalance: 25000,
    currentBalance: 22500,
    interestRate: 4.5,
    minPayment: 280,
    isCompleted: false,
    completedDate: null,
    payments: []
  },
  {
    id: 2,
    name: 'Graduate Plus Loan',
    originalBalance: 18000,
    currentBalance: 15800,
    interestRate: 6.2,
    minPayment: 200,
    isCompleted: false,
    completedDate: null,
    payments: []
  }
];

export const useLoans = (username) => {
  const [loans, setLoans] = useState([]);

  // Load user-specific loans
  useEffect(() => {
    if (username) {
      const userLoansKey = `studentLoans_${username}`;
      const savedLoans = localStorage.getItem(userLoansKey);
      
      if (savedLoans) {
        setLoans(JSON.parse(savedLoans));
      } else {
        // First time user - set initial loans
        setLoans(initialLoans);
      }
    }
  }, [username]);

  // Save to localStorage whenever loans change
  useEffect(() => {
    if (username && loans.length > 0) {
      const userLoansKey = `studentLoans_${username}`;
      localStorage.setItem(userLoansKey, JSON.stringify(loans));
    }
  }, [loans, username]);

  const addLoan = (loanData) => {
    const newLoan = {
      id: Date.now(),
      name: loanData.name,
      originalBalance: parseFloat(loanData.originalBalance),
      currentBalance: parseFloat(loanData.currentBalance),
      interestRate: parseFloat(loanData.interestRate) || 0,
      minPayment: parseFloat(loanData.minPayment) || 0,
      isCompleted: false,
      completedDate: null,
      payments: []
    };
    setLoans(prev => [...prev, newLoan]);
    return newLoan;
  };

  const editLoan = (loanId, updatedData) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        return {
          ...loan,
          name: updatedData.name,
          originalBalance: parseFloat(updatedData.originalBalance),
          currentBalance: parseFloat(updatedData.currentBalance),
          interestRate: parseFloat(updatedData.interestRate) || 0,
          minPayment: parseFloat(updatedData.minPayment) || 0
        };
      }
      return loan;
    }));
  };

  const makePayment = (loanId, paymentAmount) => {
    const payment = parseFloat(paymentAmount);
    let updatedLoan = null;

    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const newBalance = Math.max(0, loan.currentBalance - payment);
        
        updatedLoan = {
          ...loan,
          currentBalance: newBalance,
          isCompleted: newBalance === 0,
          completedDate: newBalance === 0 ? new Date().toISOString().split('T')[0] : loan.completedDate,
          payments: [...loan.payments, {
            id: Date.now(),
            amount: payment,
            date: new Date().toISOString().split('T')[0],
            balanceAfter: newBalance
          }]
        };

        return updatedLoan;
      }
      return loan;
    }));

    return updatedLoan;
  };

  const deleteLoan = (loanId) => {
    setLoans(prev => prev.filter(loan => loan.id !== loanId));
  };

  const totalStats = useMemo(() => {
    const totalOriginalDebt = loans.reduce((sum, loan) => sum + loan.originalBalance, 0);
    const totalCurrentDebt = loans.filter(loan => !loan.isCompleted).reduce((sum, loan) => sum + loan.currentBalance, 0);
    const totalPaidOff = totalOriginalDebt - totalCurrentDebt;
    const overallProgress = totalOriginalDebt > 0 ? (totalPaidOff / totalOriginalDebt) * 100 : 0;
    const completedLoans = loans.filter(loan => loan.isCompleted).length;

    return {
      totalOriginalDebt,
      totalCurrentDebt,
      totalPaidOff,
      overallProgress,
      completedLoans,
      totalLoans: loans.length
    };
  }, [loans]);

  return {
    loans,
    addLoan,
    editLoan,
    makePayment,
    deleteLoan,
    totalStats
  };
};