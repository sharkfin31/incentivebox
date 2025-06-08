import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { theme } from '../../utils/theme';
import CopyCodeButton from '../coupon/CopyCodeButton';

const SavedCoupons = () => {
  const { favorites, loading, error } = useFavorites();

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: theme.colors.neutral[50],
        borderRadius: theme.borderRadius.lg,
        textAlign: 'center',
        color: theme.colors.neutral[600]
      }}>
        Loading saved coupons...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: theme.colors.error.light + '20',
        color: theme.colors.error.dark,
        borderRadius: theme.borderRadius.lg
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Your Saved Coupons</h2>
        
        {favorites.length > 3 && (
          <Link 
            to="/profile?tab=favorites"
            style={{ 
              color: theme.colors.primary.main, 
              fontWeight: '500', 
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            View All Saved
          </Link>
        )}
      </div>
      
      {favorites.length === 0 ? (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          backgroundColor: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          color: theme.colors.neutral[600]
        }}>
          You haven't saved any coupons yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {favorites.slice(0, 3).map((coupon) => (
            <div 
              key={coupon.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: theme.borderRadius.xl,
                padding: '12px',
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={coupon.brand_logo || "/favicon.svg"}
                  alt={`${coupon.brand} logo`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: theme.borderRadius.md,
                    objectFit: 'cover'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>{coupon.brand}</p>
                    {new Date() > new Date(coupon.expiration_date) && (
                      <div style={{
                        background: theme.colors.error.main,
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: theme.borderRadius.sm,
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        EXPIRED
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', margin: '4px 0' }}>{coupon.description}</p>
                  <p style={{ fontSize: '12px', color: theme.colors.neutral[500], margin: 0 }}>
                    Expires: {format(new Date(coupon.expiration_date), 'MMM d')}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CopyCodeButton coupon={coupon} size="sm" />
                  
                  <Link
                    to={`/coupon/${coupon.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                      fontSize: '14px',
                      backgroundColor: theme.colors.primary.main,
                      color: 'white',
                      borderRadius: theme.borderRadius.md,
                      textDecoration: 'none'
                    }}
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {favorites.length > 3 && (
            <Link 
              to="/profile?tab=favorites"
              style={{
                padding: '8px',
                textAlign: 'center',
                color: theme.colors.primary.main,
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Show More Saved Coupons
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedCoupons;