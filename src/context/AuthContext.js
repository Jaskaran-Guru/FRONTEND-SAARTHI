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

  // ==========================================
  // 1. ROBUST API URL CONFIGURATION
  // ==========================================
  
  // Use Hardcoded Production URL to avoid any environment variable issues
  // You can change this back to process.env later once everything works
  const API_BASE_URL = 'https://backend-saarthi.onrender.com/api';

  // ==========================================
  // CHECK AUTH STATUS
  // ==========================================
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // If 404 HTML page is returned, it means URL is wrong
        console.warn("Received non-JSON response from server");
        return;
      }

      const data = await response.json();

      if (data.success && (data.isAuthenticated || data.user)) {
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', data.user.name);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth Check Failed:', error.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Run check on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ==========================================
  // GOOGLE LOGIN (THE FIX)
  // ==========================================
  const loginWithGoogle = () => {
    console.log('🚀 Initiating Google Login...');

    // Save current path to return after login
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);

    // CORRECT URL: Must point to the START route, NOT the callback route
    const googleAuthURL = `${API_BASE_URL}/auth/google`;
    
    console.log('🔗 Redirecting to:', googleAuthURL);
    window.location.href = googleAuthURL;
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = async () => {
    try {
      console.log('👋 Logging out...');
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  // ==========================================
  // HANDLE LOGIN SUCCESS FROM URL
  // ==========================================
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');

    if (loginSuccess === 'success') {
      console.log('🎉 Login Success Signal Received!');
      
      // Remove query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Verify session immediately
      checkAuthStatus();

      // Redirect back to original page if needed
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath && redirectPath !== '/') {
        window.location.href = redirectPath;
        localStorage.removeItem('redirectAfterLogin');
      }
    }

    const loginError = urlParams.get('error');
    if (loginError) {
      console.error('❌ Login Error Signal:', loginError);
      alert('Login failed. Please try again.');
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
