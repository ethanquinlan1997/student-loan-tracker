import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, UserPlus } from 'lucide-react';

const LoginScreen = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (isRegistering && !formData.name) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    try {
      let result;
      if (isRegistering) {
        result = onRegister(formData.username, formData.password, formData.name);
      } else {
        result = onLogin(formData.username, formData.password);
      }

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Student Loan Tracker
          </h1>
          <p className="text-gray-400">
            {isRegistering ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Login/Register Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex mb-6">
            <button
              onClick={() => {
                setIsRegistering(false);
                setError('');
                setFormData({ username: '', password: '', name: '' });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                !isRegistering
                  ? 'bg-green-500 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setError('');
                setFormData({ username: '', password: '', name: '' });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ml-2 text-sm sm:text-base ${
                isRegistering
                  ? 'bg-green-500 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm sm:text-base"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm sm:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-gray-900 font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              ) : (
                <>
                  {isRegistering ? <UserPlus size={18} /> : <User size={18} />}
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isRegistering
                ? 'Already have an account? '
                : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setFormData({ username: '', password: '', name: '' });
                }}
                className="text-green-400 hover:text-green-300 font-semibold"
              >
                {isRegistering ? 'Sign In' : 'Register'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
          <h4 className="text-blue-400 font-semibold mb-2 text-sm">Demo Info:</h4>
          <p className="text-blue-300 text-xs sm:text-sm">
            Create any username/password combination to get started. Your data will be saved locally to your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;