import { useState, useEffect } from 'react';
import { theme } from '../../utils/theme';
import { FiShoppingBag } from 'react-icons/fi';
import { useBrands } from '../../hooks/useBrands';

interface BrandFilterProps {
  selectedBrand: string | null;
  onSelectBrand: (brandId: string | null) => void;
}

const BrandFilter = ({ selectedBrand, onSelectBrand }: BrandFilterProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { brands } = useBrands();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      width: '100%',
      margin: '24px 0'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(100px, 1fr))' : 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
        padding: '8px 0'
      }}>
        {/* "All" option */}
        <div
          key="all-brands"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 8px',
            borderRadius: theme.borderRadius.xl,
            backgroundColor: selectedBrand === null ? theme.colors.primary.main : 'white',
            color: selectedBrand === null ? theme.colors.primary.contrast : theme.colors.neutral[700],
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedBrand === null 
              ? `0 4px 14px ${theme.colors.primary.main}40` 
              : theme.shadows.sm,
            border: '1px solid',
            borderColor: selectedBrand === null ? theme.colors.primary.main : theme.colors.neutral[200]
          }}
          onClick={() => onSelectBrand(null)}
          onMouseEnter={(e) => {
            if (selectedBrand !== null) {
              e.currentTarget.style.boxShadow = theme.shadows.md;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedBrand !== null) {
              e.currentTarget.style.boxShadow = theme.shadows.sm;
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <div style={{ 
            fontSize: '24px', 
            marginBottom: '8px',
            opacity: selectedBrand === null ? 1 : 0.8,
            color: selectedBrand === null ? 'white' : theme.colors.primary.main
          }}>
            <FiShoppingBag />
          </div>
          <div style={{ 
            fontSize: '14px',
            fontWeight: selectedBrand === null ? '600' : '500'
          }}>
            All Brands
          </div>
        </div>

        {/* Brand cards */}
        { brands.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            
            return (
              <div
                key={brand.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 8px',
                  borderRadius: theme.borderRadius.xl,
                  backgroundColor: isSelected ? theme.colors.primary.main : 'white',
                  color: isSelected ? theme.colors.primary.contrast : theme.colors.neutral[700],
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected 
                    ? `0 4px 14px ${theme.colors.primary.main}40` 
                    : theme.shadows.sm,
                  border: '1px solid',
                  borderColor: isSelected ? theme.colors.primary.main : theme.colors.neutral[200]
                }}
                onClick={() => onSelectBrand(brand.id)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ 
                  width: '50px',
                  height: '50px',
                  marginBottom: '8px',
                  borderRadius: theme.borderRadius.full,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: isSelected ? 'white' : theme.colors.neutral[200],
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/favicon.svg";
                    }}
                  />
                </div>
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: isSelected ? '600' : '500',
                  textAlign: 'center'
                }}>
                  {brand.name}
                </div>
                {brand.coupons_count && (
                  <div style={{
                    fontSize: '12px',
                    color: isSelected ? 'rgba(255,255,255,0.8)' : theme.colors.neutral[500],
                    marginTop: '4px'
                  }}>
                    {brand.coupons_count} coupons
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default BrandFilter;