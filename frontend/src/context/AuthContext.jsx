import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService, TOKEN_KEY } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await authService.me();
      if (res.success) {
        setUser(res.data);
        return res.data;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (token) {
      fetchMe().finally(() => {
        if (!cancelled) setIsInitializing(false);
      });
    } else {
      setIsInitializing(false);
    }
    return () => {
      cancelled = true;
    };
  }, [token, fetchMe]);

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message || 'Login gagal.');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isInitializing,
      login,
      logout,
      refresh: fetchMe,
    }),
    [user, token, isInitializing, login, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}