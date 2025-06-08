import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { theme } from '../utils/theme';
import { format } from 'date-fns';
import { fetchCouponsByCategory, supabase } from '../services/supabase';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Format category name for display (e.g., "food-grocery" -> "Food & Grocery")
  const formattedCategoryName = categoryName
    ? categoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace('And', '&')
    : '';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        let data;
        
        if (categoryName && categoryName.toLowerCase() !== 'all') {
          // Use the formatted category name for the query
          const normalizedCategoryName = formattedCategoryName.replace(' & ', ' and ');
          data = await fetchCouponsByCategory(normalizedCategoryName);
        } else {
          // Fetch all coupons if category is "all" or not specified
          const { data: allCoupons } = await supabase.from("coupons").select("*");
          data = allCoupons;
        }
        
        setCoupons(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching coupons:', err);
        setError('Failed to load coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [categoryName, formattedCategoryName]);

  // Filter coupons based on search query
  const filteredCoupons = coupons.filter(coupon => 
    coupon.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: theme.colors.neutral[600]
      }}>
        Loading coupons...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: theme.colors.error.main
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
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
        <FiArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: theme.colors.neutral[800]
        }}>
          {formattedCategoryName || 'All'} Coupons
        </h1>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: isMobile ? '100%' : '200px'
          }}>
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 32px 8px 12px',
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                width: '100%',
                outline: 'none'
              }}
            />
            <FiSearch style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.neutral[500]
            }} />
          </div>
          
          <div style={{
            display: 'flex',
            border: `1px solid ${theme.colors.neutral[300]}`,
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setViewMode('card')}
              style={{
                padding: '6px 10px',
                background: viewMode === 'card' ? theme.colors.primary.light + '20' : 'white',
                color: viewMode === 'card' ? theme.colors.primary.main : theme.colors.neutral[600],
                border: 'none',
                borderRight: `1px solid ${theme.colors.neutral[300]}`,
                cursor: 'pointer'
              }}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 10px',
                background: viewMode === 'list' ? theme.colors.primary.light + '20' : 'white',
                color: viewMode === 'list' ? theme.colors.primary.main : theme.colors.neutral[600],
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>
      
      {filteredCoupons.length === 0 ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          color: theme.colors.neutral[600]
        }}>
          No coupons found{searchQuery ? ` matching "${searchQuery}"` : ''}.
        </div>
      ) : viewMode === 'card' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '100%' : '280px'}, 1fr))`,
          gap: '16px',
          marginBottom: '24px'
        }}>
          {filteredCoupons.map(coupon => (
            <Link
              key={coupon.id}
              to={`/coupon/${coupon.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div
                style={{
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.xl,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: theme.colors.neutral[50]
                }}>
                  <img
                    src={coupon.brand_logo || `https://via.placeholder.com/40?text=${coupon.brand}`}
                    alt={`${coupon.brand} logo`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: theme.borderRadius.md,
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <h3 style={{ fontWeight: 'bold', color: theme.colors.neutral[800] }}>{coupon.brand}</h3>
                    <p style={{ 
                      fontSize: '12px', 
                      color: theme.colors.neutral[500]
                    }}>
                      Expires: {format(new Date(coupon.expiration_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div style={{ padding: '16px' }}>
                  <p style={{ 
                    fontWeight: 'bold', 
                    color: theme.colors.accent.main,
                    fontSize: '18px',
                    marginBottom: '8px'
                  }}>
                    {coupon.savings}
                  </p>
                  <p style={{ 
                    marginBottom: '12px',
                    color: theme.colors.neutral[700]
                  }}>
                    {coupon.description}
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: theme.colors.neutral[500]
                  }}>
                    {coupon.criteria}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {filteredCoupons.map(coupon => (
            <Link
              key={coupon.id}
              to={`/coupon/${coupon.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div
                style={{
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.xl,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={coupon.brand_logo || `https://via.placeholder.com/50?text=${coupon.brand}`}
                  alt={`${coupon.brand} logo`}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: theme.borderRadius.md,
                    objectFit: 'cover'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <h3 style={{ fontWeight: 'bold', color: theme.colors.neutral[800] }}>{coupon.brand}</h3>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: theme.colors.accent.main
                    }}>
                      {coupon.savings}
                    </span>
                  </div>
                  <p style={{ color: theme.colors.neutral[700] }}>{coupon.description}</p>
                  <div style={{ 
                    fontSize: '12px', 
                    color: theme.colors.neutral[500],
                    marginTop: '4px'
                  }}>
                    Expires: {format(new Date(coupon.expiration_date), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;