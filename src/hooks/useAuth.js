import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Check if user exists and password matches
    if (users[username] && users[username].password === password) {
      const userData = {
        username,
        name: users[username].name,
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid username or password' };
  };

  const register = (username, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Check if username already exists
    if (users[username]) {
      return { success: false, error: 'Username already exists' };
    }
    
    // Create new user
    users[username] = {
      password,
      name,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    const userData = {
      username,
      name,
      loginTime: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout
  };
};