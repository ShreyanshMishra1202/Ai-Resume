import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token || user) return;

    const loadUser = async () => {
      try {
        const result = await api.me(token);
        setUser(result.user);
      } catch (error) {
        setToken(null);
        localStorage.removeItem('token');
      }
    };

    loadUser();
  }, [token, user]);

  const login = async (payload) => {
    const result = await api.login(payload);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem('token', result.token);
  };

  const register = async (payload) => {
    const result = await api.register(payload);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem('token', result.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
