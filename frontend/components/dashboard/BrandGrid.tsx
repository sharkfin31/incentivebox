interface Brand {
  id: string;
  name: string;
  logo: string;
  couponsCount?: number;
}

interface BrandGridProps {
  brands: Brand[];
}

const BrandGrid = ({ brands }: BrandGridProps) => {
  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Browse by Brand</h2>
        <a 
          href="#" 
          style={{ 
            color: '#3182CE', 
            fontWeight: '500', 
            fontSize: '14px' 
          }}
        >
          View All Brands
        </a>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '16px'
      }}>
        {brands.slice(0, 6).map((brand) => (
          <div 
            key={brand.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#3182CE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <img
              src={brand.logo || `https://via.placeholder.com/80?text=${brand.name}`}
              alt={`${brand.name} logo`}
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 8px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/80?text=${encodeURIComponent(brand.name)}`;
              }}
            />
            <p style={{ 
              fontWeight: '500', 
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {brand.name}
            </p>
            {brand.couponsCount && (
              <p style={{ fontSize: '12px', color: '#718096' }}>
                {brand.couponsCount} coupons
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;