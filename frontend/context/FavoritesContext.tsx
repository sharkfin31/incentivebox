import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { addFavorite, fetchUserFavorites, removeFavorite, subscribeFavorites } from '../services/supabase';
import { useNotification } from './NotificationContext';

interface Coupon {
  id: string;
  brand: string;
  brand_logo: string;
  description: string;
  savings: string;
  expiration_date: string;
  criteria: string;
  category: string;
  featured?: boolean;
  deal_link?: string;
}

interface FavoritesContextType {
  favorites: Coupon[];
  loading: boolean;
  error: string | null;
  addToFavorites: (coupon: Coupon) => Promise<void>;
  removeFromFavorites: (couponId: string) => Promise<void>;
  isFavorite: (couponId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [favorites, setFavorites] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userFavorites = await fetchUserFavorites(user.id);
      setFavorites(userFavorites);
      
      // Create a set of favorite IDs for quick lookup
      const ids = new Set(userFavorites.map(coupon => coupon.id));
      setFavoriteIds(ids);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
      
      // Set up real-time subscription for favorites changes
      const subscription = subscribeFavorites(user.id, () => {
        // Reload favorites when changes are detected
        loadFavorites();
      });
      
      // Clean up subscription when component unmounts or user changes
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setFavorites([]);
      setFavoriteIds(new Set());
    }
  }, [user]);

  const addToFavorites = async (coupon: Coupon) => {
    if (!user) {
      addNotification('warning', 'You must be logged in to add favorites');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { success, error } = await addFavorite(user.id, coupon.id);
      
      if (success) {
        // Update local state immediately for better UX
        setFavorites(prev => {
          if (!prev.some(c => c.id === coupon.id)) {
            return [...prev, coupon];
          }
          return prev;
        });
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.add(coupon.id);
          return newSet;
        });
        addNotification('success', 'Added to favorites');
      } else if (error) {
        console.error('Error adding to favorites:', error);
        addNotification('error', 'Failed to add to favorites');
        setError('Failed to add to favorites');
      }
    } catch (err) {
      console.error('Exception in addToFavorites:', err);
      addNotification('error', 'Failed to add to favorites');
      setError('Failed to add to favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (couponId: string) => {
    if (!user) {
      addNotification('warning', 'You must be logged in to remove favorites');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { success, error } = await removeFavorite(user.id, couponId);
      
      if (success) {
        // Update local state immediately for better UX
        setFavorites(prev => prev.filter(coupon => coupon.id !== couponId));
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(couponId);
          return newSet;
        });
        addNotification('info', 'Removed from favorites');
      } else if (error) {
        console.error('Error removing from favorites:', error);
        addNotification('error', 'Failed to remove from favorites');
        setError('Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Exception in removeFromFavorites:', err);
      addNotification('error', 'Failed to remove from favorites');
      setError('Failed to remove from favorites');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (couponId: string) => {
    return favoriteIds.has(couponId);
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const value = {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};