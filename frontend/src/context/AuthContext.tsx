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
  nomor_telepon?: string | null;
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

const USER_STORAGE_KEY = 'logislot_user';
const TOKEN_STORAGE_KEY = 'logislot_token';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage first, then optionally refresh from server
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // First: try localStorage (fast, works without Redis)
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedUser && storedToken) {
          // Check token expiry from JWT payload
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();

            if (!isExpired) {
              // Token still valid — restore session immediately
              setAccessToken(storedToken);
              setUser(JSON.parse(storedUser));
              setLoading(false);
              return;
            }
          } catch {
            // Malformed token — fall through to refresh
          }
        }

        // Token missing/expired — try server refresh (needs refresh token cookie)
        const res = await api.post('/auth/refresh', {}, { timeout: 3000 });
        const token = res.data.data.token;
        setAccessToken(token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const refreshedUser: User = {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          nama: payload.nama || (storedUser ? JSON.parse(storedUser!).nama : 'User'),
          nama_instansi: storedUser ? JSON.parse(storedUser!).nama_instansi : null,
        };
        setUser(refreshedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(refreshedUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } catch (err) {
        // No valid session found — clear everything
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = (data: { user: User; token: string }) => {
    setAccessToken(data.token);
    setUser(data.user);
    setLoading(false);
    // Persist to localStorage so session survives hard refresh
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
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
