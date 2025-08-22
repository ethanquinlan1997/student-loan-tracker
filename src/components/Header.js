import React from 'react';
import { LogOut, User } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <div className="text-center mb-6 sm:mb-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
            <User className="text-gray-900" size={16} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-white font-semibold text-sm sm:text-base">Welcome back, {user.name}!</p>
            <p className="text-gray-400 text-xs sm:text-sm">@{user.username}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
      
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        Student Loan Tracker
      </h1>
      <p className="text-gray-400 text-sm sm:text-lg">Your journey to financial freedom</p>
    </div>
  );
};

export default Header;