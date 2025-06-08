import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { theme } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { checkIsFavorite, addFavorite, removeFavorite } from '../../services/supabase';
import { useNotification } from '../../context/NotificationContext';

interface FavoriteButtonProps {
  couponId: string;
  coupon: any;
size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton = ({ couponId, size = 'md' }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  // Size-based styling
  const sizeStyles = {
    sm: { size: 16, padding: '6px' },
    md: { size: 20, padding: '8px' },
    lg: { size: 24, padding: '10px' }
  }[size];

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) return;
      
      try {
        const status = await checkIsFavorite(user.id, couponId);
        setIsFavorite(status);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [couponId, user]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      addNotification('info', 'Please sign in to save coupons');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        await removeFavorite(user.id, couponId);
        addNotification('success', 'Coupon removed from favorites');
      } else {
        await addFavorite(user.id, couponId);
        addNotification('success', 'Coupon added to favorites');
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      addNotification('error', 'Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      style={{
        backgroundColor: isFavorite ? '#e53e3e' : 'white',
        color: isFavorite ? 'white' : theme.colors.neutral[400],
        border: `1px solid ${isFavorite ? '#e53e3e' : theme.colors.neutral[300]}`,
        borderRadius: '50%',
        width: 'auto',
        height: 'auto',
        padding: sizeStyles.padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isLoading ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isLoading ? 0.7 : 1
      }}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FiHeart 
        size={sizeStyles.size} 
        fill={isFavorite ? 'white' : 'transparent'} 
        stroke={isFavorite ? 'white' : theme.colors.neutral[400]}
        strokeWidth={2}
      />
    </button>
  );
};

export default FavoriteButton;