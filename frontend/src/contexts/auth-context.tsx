import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setAuthData: (userData: User, accessToken: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing tokens on mount
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const setAuthData = (userData: User, accessToken: string, refreshToken: string) => {
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    // Store in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email: string, password: string) => {
    // This will be handled by the login page component
    throw new Error('Login should be handled by LoginPage component');
  };

  const register = async (email: string, username: string, password: string) => {
    // This will be handled by the register page component
    throw new Error('Register should be handled by RegisterPage component');
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    register,
    logout,
    loading,
    setAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

