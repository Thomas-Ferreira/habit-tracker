
import type { AxiosError } from "axios";
import axios from "axios";
import React, { createContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
}

type AuthProviderProps = { children: ReactNode }

export interface AuthContextType {
  token: string | null
  user: User | null
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // TODO: Décoder le token pour récupérer l'user info
      // Pour l'instant, on va juste le stocker
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      const newToken = response.data.token;
      const newUser = response.data.user;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      const errorMsg = error.response?.data?.error || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        { email, password }
      );

      const newToken = response.data.token;
      const newUser = response.data.user;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      const errorMsg = error.response?.data?.error || 'Signup failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    token,
    user,
    isLoading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
