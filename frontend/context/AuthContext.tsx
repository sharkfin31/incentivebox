import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser, signIn, signOut, signUp } from '../services/supabase';
import { useNotification } from './NotificationContext';

// Define our own User type instead of importing from Supabase
interface User {
  id: string;
  email?: string;
  created_at?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<{ success: boolean; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { user, error } = await getCurrentUser();
        if (error) {
          setError(error.message);
          setUser(null);
        } else {
          setUser(user);
          setError(null);
        }
      } catch (err) {
        setError('Failed to fetch user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      setUser(user);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, error } = await signUp(email, password, name);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      setUser(user);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = 'Failed to sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await signOut();
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      setUser(null);
      addNotification('success', 'Signed out successfully');
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = 'Failed to sign out';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};