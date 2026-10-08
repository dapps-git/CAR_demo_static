import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('car_service_token');
      const savedUser = localStorage.getItem('car_service_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with /api/auth/me
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('car_service_user', JSON.stringify(res.data));
        } catch (error) {
          console.error('Session expired or invalid', error);
          localStorage.removeItem('car_service_token');
          localStorage.removeItem('car_service_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('car_service_token', token);
    localStorage.setItem('car_service_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('car_service_token');
    localStorage.removeItem('car_service_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
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
