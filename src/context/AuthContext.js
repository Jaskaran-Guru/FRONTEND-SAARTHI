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
  // 1. ROBUST API URL CONFIGURATION (THE FIX)
  // ==========================================
  
  // Base domain (without /api)
  const rawBase = process.env.REACT_APP_API_URL || 'https://backend-saarthi.onrender.com';
  
  // Clean it: remove trailing slash and remove /api if user added it manually
  // We will append /api consistently later
  const cleanBase = rawBase.replace(/\/$/, '').replace(/\/api$/, '');
  
  // Final API URL always ends with /api
  const API_BASE_URL = `${cleanBase}/api`;

  // ==========================================
  // DEBUGGING LOGS
  // ==========================================
  useEffect(() => {
    console.log('🔧 Auth Configuration:', {
      raw_env: process.env.REACT_APP_API_URL,
      final_url: API_BASE_URL, // Should be ...onrender.com/api
      is_production: process.env.NODE_ENV === 'production'
    });
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // console.log('🔍 Checking auth status...'); 
      // (Commented out to reduce console noise)

      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include', // Crucial for cookie transmission
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Handle non-JSON responses (like 404 HTML pages)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server (Check API URL)");
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

  // Google login - redirect to backend
   const loginWithGoogle = () => {
    console.log('🚀 Starting Google login...');

    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);

    // FIX: Hardcoded URL with /api to ensure it works
    const googleAuthURL = "https://backend-saarthi.onrender.com/api/auth/google/callback";
    
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
        // Force reload to clear any client-side state
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Fallback: Clear local state anyway
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
      console.log('🎉 Login Success Signal Received!');
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Verify session immediately
      checkAuthStatus();

      // Redirect back if needed
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
