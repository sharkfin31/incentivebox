import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiTag, FiShoppingBag, FiHeart, FiHelpCircle } from 'react-icons/fi';
import { theme } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle clicks outside the search component to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update search results when query changes
  useEffect(() => {
    const searchCoupons = async () => {
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const { data } = await supabase
          .from("coupons")
          .select("*")
          .or(`description.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(5);
        
        setSearchResults(data || []);
        setShowResults((data || []).length > 0);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };
    
    searchCoupons();
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result: any) => {
    navigate(`/coupon/${result.id}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header style={{
      width: '100%',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.colors.neutral[200]}`,
      flexWrap: 'wrap',
      gap: '10px',
      backgroundColor: 'white'
    }}>
      <Link 
        to="/"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: theme.colors.primary.main,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none'
        }}
      >
        <FiShoppingBag />
        IncentiveBox
      </Link>

      <div 
        ref={searchRef}
        style={{
          maxWidth: '500px',
          flex: '1',
          minWidth: '200px',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'relative',
          zIndex: 20
        }}>
          <input
            type="text"
            placeholder="Search for coupons, e.g., 'Nike Shoes', 'Grocery'"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: showResults ? `${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0` : theme.borderRadius.full,
              border: `1px solid ${theme.colors.neutral[300]}`,
              borderBottom: showResults ? 'none' : `1px solid ${theme.colors.neutral[300]}`,
              outline: 'none',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.2s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            color: theme.colors.neutral[500]
          }}>
            <FiSearch />
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            borderRadius: `0 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl}`,
            boxShadow: theme.shadows.lg,
            zIndex: 1,
            maxHeight: '300px',
            overflowY: 'auto',
            border: `1px solid ${theme.colors.neutral[300]}`,
            borderTop: 'none'
          }}>
            {searchResults.map(result => (
              <div 
                key={result.id}
                onClick={() => handleResultClick(result)}
                style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.neutral[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: theme.borderRadius.md,
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {result.brandLogo ? (
                    <img 
                      src={result.brandLogo} 
                      alt={result.brand} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: theme.colors.neutral[200],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.colors.neutral[600]
                    }}>
                      <FiTag />
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: theme.colors.neutral[800] }}>{result.brand}</div>
                  <div style={{ fontSize: '14px', color: theme.colors.neutral[600] }}>{result.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {user ? (
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to="/help"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: theme.colors.primary.light + '20',
              color: theme.colors.primary.main,
              borderRadius: theme.borderRadius.full,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.light + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.light + '20';
            }}
            title="Help & Instructions"
          >
            <FiHelpCircle size={18} />
          </Link>
          
          <Link
            to="/profile?tab=favorites"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.primary.light + '20',
              color: theme.colors.primary.main,
              borderRadius: theme.borderRadius.full,
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.light + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.light + '20';
            }}
          >
            <FiHeart size={16} />
          </Link>
          
          <Link
            to="/profile?tab=settings"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: theme.shadows.md,
              transition: 'all 0.2s ease',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.dark;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.main;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiUser />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to="/help"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: theme.colors.primary.light + '20',
              color: theme.colors.primary.main,
              borderRadius: theme.borderRadius.full,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.light + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.light + '20';
            }}
            title="Instructions"
          >
            <FiHelpCircle size={18} />
          </Link>
          
          <Link
            to="/auth"
            style={{
              padding: '8px 16px',
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              borderRadius: theme.borderRadius.md,
              textDecoration: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary.dark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary.main;
          }}
        >
          <FiUser size={16} /> Log In
        </Link>
      </div>
      )}
    </header>
  );
};

export default Header;