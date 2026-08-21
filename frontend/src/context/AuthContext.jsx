import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Verify token on app startup
    const verifyUser = async () => {
      if (user?.token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            // Token valid - update user data with latest from server
            const updatedUser = { ...user, ...res.data };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
          } else {
            // Server returned failure but not a 401 — keep user logged in
            // (could be a temporary server issue)
          }
        } catch (err) {
          // IMPORTANT: Only logout if backend explicitly says token is invalid (401).
          // For network errors, server down, timeout etc — keep user logged in so they
          // don't get kicked out just because of a temporary connection problem.
          const status = err.response?.status;
          if (status === 401) {
            // Token is genuinely expired or invalid — force logout
            logout();
          }
          // Any other error (network, 500, etc) → stay logged in, just mark auth as checked
        }
      }
      setAuthChecked(true);
    };

    verifyUser();

    // Listen for custom 401 logout event (fired by api.js interceptor)
    const handleLogoutEvent = () => {
      setUser(null);
      localStorage.removeItem('userInfo');
    };
    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password, confirmPassword });
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success && res.data) {
        const updated = { ...user, ...res.data };
        setUser(updated);
        localStorage.setItem('userInfo', JSON.stringify(updated));
        return { success: true, user: updated };
      }
      return { success: false, message: res.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      return { success: false, message: msg };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const res = await authService.changePassword(passwordData);
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.token,
        loading,
        authChecked,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
