import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiExternalLink, FiTag, FiInfo } from 'react-icons/fi';
import { format } from 'date-fns';
import { fetchCouponById, fetchCoupons } from '../services/supabase';
import { theme } from '../utils/theme';
import FavoriteButton from '../components/coupon/FavoriteButton';
import CopyCodeButton from '../components/coupon/CopyCodeButton';
import { useAuth } from '../context/AuthContext';

const CouponDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [coupon, setCoupon] = useState<any | null>(null);
  const [relatedCoupons, setRelatedCoupons] = useState<any[]>([]);
  const isExpired = coupon && new Date() > new Date(coupon.expiration_date);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await fetchCouponById(id);
        
        if (data) {
          setCoupon(data);
          setError(null);
          
          // Fetch related coupons from the same category
          const related = await fetchCoupons({ 
            category: data.category,
            limit: 3
          });
          
          // Filter out the current coupon
          setRelatedCoupons(related.filter(c => c.id !== id));
        } else {
          setError('Coupon not found');
        }
      } catch (err) {
        console.error('Error fetching coupon:', err);
        setError('Failed to load coupon details');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: theme.colors.neutral[600]
      }}>
        Loading coupon details...
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: theme.colors.error.light + '20',
          color: theme.colors.error.dark,
          padding: '16px',
          borderRadius: theme.borderRadius.lg,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px'
        }}>
          <FiInfo />
          {error || 'Coupon not found'}
        </div>
        
        <div>
          <Link 
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              borderRadius: theme.borderRadius.md,
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            <FiArrowLeft /> Back to Coupons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <Link 
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: theme.colors.primary.main,
          textDecoration: 'none',
          marginBottom: '24px',
          fontWeight: '500'
        }}
      >
        <FiArrowLeft size={16} /> Back to Coupons
      </Link>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        boxShadow: theme.shadows.md,
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${theme.colors.neutral[200]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.neutral[50],
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <img
              src={coupon.brand_logo || "/favicon.svg"}
              alt={`${coupon.brand} logo`}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: theme.borderRadius.lg,
                objectFit: 'cover',
                border: `1px solid ${theme.colors.neutral[200]}`,
                backgroundColor: 'white',
                padding: '4px'
              }}
            />
            
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: theme.colors.neutral[800],
                marginBottom: '4px'
              }}>
                {coupon.brand}
              </h1>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: theme.colors.neutral[600],
                fontSize: '14px'
              }}>
                <FiTag />
                <span>{coupon.category}</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isExpired && (
              <div style={{
                background: theme.colors.error.main,
                color: 'white',
                padding: '4px 10px',
                borderRadius: theme.borderRadius.md,
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                EXPIRED
              </div>
            )}
            
            {user && (
              <FavoriteButton couponId={coupon.id} coupon={coupon} size="lg" />
            )}
          </div>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{
            backgroundColor: theme.colors.primary.light + '15',
            padding: '16px',
            borderRadius: theme.borderRadius.lg,
            marginBottom: '24px',
            border: `1px solid ${theme.colors.primary.light}30`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: theme.colors.accent.main
              }}>
                {coupon.savings}
              </h2>
              
              <CopyCodeButton coupon={coupon} label="Copy Code" size="md" />
            </div>
            
            <p style={{
              fontSize: '16px',
              color: theme.colors.neutral[800],
              marginBottom: '16px'
            }}>
              {coupon.description}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: theme.colors.neutral[600],
              fontSize: '14px'
            }}>
              <FiCalendar size={14} />
              <span>Expires: {format(new Date(coupon.expiration_date), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: theme.colors.neutral[700],
              marginBottom: '8px'
            }}>
              Terms & Conditions
            </h3>
            <p style={{
              color: theme.colors.neutral[500],
              fontSize: '13px',
              lineHeight: 1.6,
              fontStyle: 'italic'
            }}>
              {coupon.criteria}
            </p>
          </div>
          
          <a
            href={coupon.deal_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              borderRadius: theme.borderRadius.md,
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.dark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.main;
            }}
          >
            Redeem Offer <FiExternalLink size={16} />
          </a>
        </div>
      </div>
      
      {relatedCoupons.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: theme.borderRadius.xl,
          padding: '24px',
          boxShadow: theme.shadows.md
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: theme.colors.neutral[800],
            marginBottom: '16px'
          }}>
            Related Coupons
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {relatedCoupons.map(relatedCoupon => (
              <Link
                key={relatedCoupon.id}
                to={`/coupon/${relatedCoupon.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.lg,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  padding: '12px',
                  borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                  backgroundColor: theme.colors.neutral[50]
                }}>
                  <div style={{ fontWeight: 'bold' }}>{relatedCoupon.brand}</div>
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{
                    fontSize: '14px',
                    color: theme.colors.accent.main,
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    {relatedCoupon.savings}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: theme.colors.neutral[600]
                  }}>
                    {relatedCoupon.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponDetail;