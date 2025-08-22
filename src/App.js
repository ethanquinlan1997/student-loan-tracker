import React, { useState } from 'react';
import { Plus, Calendar, Brain, Trophy, FileText } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useLoans } from './hooks/useLoans';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LoanCard from './components/LoanCard';
import AddLoanModal from './components/AddLoanModal';
import EditLoanModal from './components/EditLoanModal';
import PaymentModal from './components/PaymentModal';
import CelebrationModal from './components/CelebrationModal';
import PaymentTimeline from './components/PaymentTimeline';
import SmartSuggestions from './components/SmartSuggestions';
import AchievementSystem from './components/AchievementSystem';
import MonthlyReports from './components/MonthlyReports';

function App() {
  const { user, isLoading, login, register, logout } = useAuth();
  const {
    loans,
    addLoan,
    editLoan,
    makePayment,
    deleteLoan,
    totalStats
  } = useLoans(user?.username);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedLoan, setCompletedLoan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleMakePayment = (loanId, amount) => {
    const loan = loans.find(l => l.id === loanId);
    const wasCompleted = loan?.isCompleted;
    
    const updatedLoan = makePayment(loanId, amount);
    
    if (updatedLoan && !wasCompleted && updatedLoan.isCompleted) {
      setCompletedLoan(updatedLoan);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
    
    setShowPaymentModal(false);
    setSelectedLoan(null);
  };

  const handlePaymentClick = (loan) => {
    setSelectedLoan(loan);
    setShowPaymentModal(true);
  };

  const handleEditClick = (loan) => {
    setSelectedLoan(loan);
    setShowEditModal(true);
  };

  const handleEditLoan = (loanId, updatedData) => {
    editLoan(loanId, updatedData);
    setShowEditModal(false);
    setSelectedLoan(null);
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
        activeTab === id 
          ? 'bg-green-500 text-gray-900 shadow-lg' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
      <span className="hidden xs:inline">{label}</span>
    </button>
  );

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLogin={login} onRegister={register} />;
  }

  // Main app for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header with user info */}
        <Header user={user} onLogout={logout} />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 justify-center">
          <TabButton id="overview" label="Overview" icon={Plus} />
          <TabButton id="timeline" label="Timeline" icon={Calendar} />
          <TabButton id="suggestions" label="Tips" icon={Brain} />
          <TabButton id="achievements" label="Awards" icon={Trophy} />
          <TabButton id="reports" label="Reports" icon={FileText} />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Dashboard */}
            <Dashboard stats={totalStats} />

            {/* Add Loan Button */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Your Loans</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-500 hover:bg-green-600 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                Add Loan
              </button>
            </div>

            {/* Loans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {loans.map(loan => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onPaymentClick={handlePaymentClick}
                  onEdit={handleEditClick}
                  onDelete={deleteLoan}
                />
              ))}
            </div>

            {/* Completed Loans Section */}
            {totalStats.completedLoans > 0 && (
              <div className="bg-green-900/20 border border-green-500/30 p-4 sm:p-8 rounded-2xl">
                <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 flex items-center gap-3">
                  🎉 Completed Loans
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {loans.filter(loan => loan.isCompleted).map(loan => (
                    <div key={loan.id} className="bg-green-800/30 p-4 rounded-xl border border-green-600/50">
                      <h4 className="font-semibold text-green-300">{loan.name}</h4>
                      <p className="text-green-400 font-bold">${loan.originalBalance.toLocaleString()} paid off!</p>
                      <p className="text-green-300 text-sm">Completed: {loan.completedDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'timeline' && (
          <PaymentTimeline loans={loans} />
        )}

        {activeTab === 'suggestions' && (
          <SmartSuggestions loans={loans} totalStats={totalStats} />
        )}

        {activeTab === 'achievements' && (
          <AchievementSystem loans={loans} totalStats={totalStats} user={user} />
        )}

        {activeTab === 'reports' && (
          <MonthlyReports loans={loans} user={user} />
        )}

        {/* Modals */}
        <AddLoanModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddLoan={addLoan}
        />

        <EditLoanModal
          isOpen={showEditModal}
          loan={selectedLoan}
          onClose={() => setShowEditModal(false)}
          onEditLoan={handleEditLoan}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          loan={selectedLoan}
          onClose={() => setShowPaymentModal(false)}
          onMakePayment={handleMakePayment}
        />

        <CelebrationModal
          isOpen={showCelebration}
          loan={completedLoan}
          onClose={() => setShowCelebration(false)}
        />
      </div>
    </div>
  );
}

export default App;