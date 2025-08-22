import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Target, Zap, Crown } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const AchievementSystem = ({ loans, totalStats, user }) => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);

  const achievementDefinitions = [
    {
      id: 'first_payment',
      title: 'First Step',
      description: 'Made your first payment',
      icon: '🎯',
      color: 'blue',
      check: (loans) => loans.some(loan => loan.payments.length > 0)
    },
    {
      id: 'consistent_payer',
      title: 'Consistent Payer',
      description: 'Made 5 payments',
      icon: '⚡',
      color: 'green',
      check: (loans) => {
        const totalPayments = loans.reduce((sum, loan) => sum + loan.payments.length, 0);
        return totalPayments >= 5;
      }
    },
    {
      id: 'debt_destroyer',
      title: 'Debt Destroyer',
      description: 'Made 20 payments',
      icon: '💪',
      color: 'red',
      check: (loans) => {
        const totalPayments = loans.reduce((sum, loan) => sum + loan.payments.length, 0);
        return totalPayments >= 20;
      }
    },
    {
      id: 'quarter_progress',
      title: 'Quarter Way There',
      description: 'Reached 25% total progress',
      icon: '🎉',
      color: 'yellow',
      check: (loans, stats) => stats.overallProgress >= 25
    },
    {
      id: 'halfway_hero',
      title: 'Halfway Hero',
      description: 'Reached 50% total progress',
      icon: '🚀',
      color: 'orange',
      check: (loans, stats) => stats.overallProgress >= 50
    },
    {
      id: 'almost_there',
      title: 'Almost There',
      description: 'Reached 75% total progress',
      icon: '🏃',
      color: 'purple',
      check: (loans, stats) => stats.overallProgress >= 75
    },
    {
      id: 'first_loan_complete',
      title: 'Loan Crusher',
      description: 'Paid off your first loan',
      icon: '🏆',
      color: 'gold',
      check: (loans) => loans.some(loan => loan.isCompleted)
    },
    {
      id: 'big_payment',
      title: 'Big Spender',
      description: 'Made a payment over $1,000',
      icon: '💰',
      color: 'green',
      check: (loans) => loans.some(loan => 
        loan.payments.some(payment => payment.amount >= 1000)
      )
    },
    {
      id: 'debt_free',
      title: 'DEBT FREE!',
      description: 'Paid off ALL loans!',
      icon: '👑',
      color: 'rainbow',
      check: (loans) => loans.length > 0 && loans.every(loan => loan.isCompleted)
    },
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Made a payment above minimum',
      icon: '🌅',
      color: 'blue',
      check: (loans) => loans.some(loan => 
        loan.payments.some(payment => payment.amount > loan.minPayment)
      )
    }
  ];

  useEffect(() => {
    const userAchievementsKey = `achievements_${user?.username}`;
    const savedAchievements = JSON.parse(localStorage.getItem(userAchievementsKey) || '[]');
    setAchievements(savedAchievements);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const userAchievementsKey = `achievements_${user.username}`;
    const currentAchievementIds = achievements.map(a => a.id);
    
    achievementDefinitions.forEach(def => {
      if (!currentAchievementIds.includes(def.id) && def.check(loans, totalStats)) {
        const newAch = {
          ...def,
          earnedAt: new Date().toISOString(),
          earnedDate: new Date().toLocaleDateString()
        };
        
        setAchievements(prev => {
          const updated = [...prev, newAch];
          localStorage.setItem(userAchievementsKey, JSON.stringify(updated));
          return updated;
        });
        
        // Show celebration
        setNewAchievement(newAch);
        setTimeout(() => setNewAchievement(null), 4000);
      }
    });
  }, [loans, totalStats, user, achievements]);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      rainbow: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'
    };
    return colors[color] || colors.blue;
  };

  const earnedAchievements = achievements.length;
  const totalAchievements = achievementDefinitions.length;
  const completionRate = (earnedAchievements / totalAchievements) * 100;

  return (
    <>
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            Achievements
          </h3>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Progress</p>
            <p className="text-xl font-bold text-yellow-400">
              {earnedAchievements}/{totalAchievements}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Achievement Progress</span>
            <span className="text-white font-semibold">{completionRate.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementDefinitions.map(achievement => {
            const isEarned = achievements.some(a => a.id === achievement.id);
            const earnedAchievement = achievements.find(a => a.id === achievement.id);
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all ${
                  isEarned
                    ? 'bg-gray-700 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                    : 'bg-gray-800 border-gray-600 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isEarned ? getColorClasses(achievement.color) : 'bg-gray-600'
                  }`}>
                    <span className="text-2xl">{achievement.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isEarned ? 'text-white' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h4>
                    {isEarned && (
                      <p className="text-yellow-400 text-xs">
                        {earnedAchievement?.earnedDate}
                      </p>
                    )}
                  </div>
                  {isEarned && (
                    <Star className="text-yellow-400" size={16} />
                  )}
                </div>
                <p className={`text-sm ${isEarned ? 'text-gray-300' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Achievement Stats */}
        {earnedAchievements > 0 && (
          <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="text-yellow-400" size={20} />
              <h4 className="font-semibold text-yellow-300">Achievement Master</h4>
            </div>
            <p className="text-yellow-200 text-sm">
              You've earned {earnedAchievements} achievement{earnedAchievements !== 1 ? 's' : ''} on your debt-free journey! 
              {earnedAchievements === totalAchievements && " 🎉 PERFECT SCORE! You're a true debt elimination champion!"}
            </p>
          </div>
        )}
      </div>

      {/* New Achievement Celebration */}
      {newAchievement && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-800 to-yellow-900 p-12 rounded-3xl border-2 border-yellow-400 text-center max-w-lg animate-bounce">
            <div className="text-6xl mb-4">{newAchievement.icon}</div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Achievement Unlocked!</h2>
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">{newAchievement.title}</h3>
            <p className="text-lg text-yellow-200">{newAchievement.description}</p>
            <p className="text-yellow-300 mt-4">Keep up the amazing work! 🚀</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AchievementSystem;