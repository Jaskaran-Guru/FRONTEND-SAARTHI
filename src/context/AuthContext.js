import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- FIX STARTS HERE ---
  // 1. Get the base URL from env or fallback
  let apiBase = process.env.REACT_APP_API_URL || 'https://backend-saarthi.onrender.com/api';
  
  // 2. Safety Check: Ensure it DOES NOT end with a slash
  if (apiBase.endsWith('/')) {
    apiBase = apiBase.slice(0, -1);
  }

  // 3. Safety Check: Ensure it DOES end with /api
  // If the user forgot to add /api in Vercel, we add it here manually.
  const API_BASE_URL = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
  // --- FIX ENDS HERE ---

  // Debug log to check env vars
  useEffect(() => {
    console.log('🔧 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      RAW_API_URL: process.env.REACT_APP_API_URL,
      FINAL_API_URL: API_BASE_URL, // <--- Check this in console
      GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'
    });
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status at:', `${API_BASE_URL}/auth/check`);

      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('🔍 Auth check response:', data);

      if (data.success && (data.isAuthenticated || data.user)) { // Improved check
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', data.user.name);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ User not authenticated');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Google login - redirect to backend
  const loginWithGoogle = () => {
    console.log('🚀 Starting Google login...');

    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);

    // This will now definitely be .../api/auth/google
    const googleAuthURL = `${API_BASE_URL}/auth/google`;
    console.log('🔗 Redirecting to:', googleAuthURL);

    window.location.href = googleAuthURL;
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('👋 Logging out...');

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        console.log('✅ Logged out successfully');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  // Handle successful login (called from URL params)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');

    if (loginSuccess === 'success') {
      console.log('🎉 Login successful! Refreshing auth status...');
      window.history.replaceState({}, document.title, window.location.pathname);

      setTimeout(() => {
        checkAuthStatus();
      }, 1000);

      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath && redirectPath !== '/') {
        setTimeout(() => {
          window.location.href = redirectPath;
          localStorage.removeItem('redirectAfterLogin');
        }, 2000);
      }
    }

    const loginError = urlParams.get('error');
    if (loginError === 'auth_failed') {
      console.error('❌ Google authentication failed');
      alert('Google login failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    loginWithGoogle,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
