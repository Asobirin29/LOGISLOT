'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../lib/axios';

export type Role = 'supplier' | 'ic' | 'security' | 'warehouse' | 'admin';

export interface User {
  id: number;
  nama: string;
  email: string;
  role: Role;
  nama_instansi: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Attempt to restore session on mount via refresh token
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post('/auth/refresh');
        const token = res.data.data.token;
        setAccessToken(token);
        
        // Fetch user profile (In a real app, you might decode the JWT or have a /me endpoint)
        // Since we don't have a /me endpoint yet, we decode the JWT basic payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
          nama: payload.nama || 'User', // payload might not have all info unless added to generateToken
          nama_instansi: null
        });
      } catch (err) {
        // Normal if no valid refresh token exists
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = (data: { user: User; token: string }) => {
    setAccessToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setAccessToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
