import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import BrandFilter from './BrandFilter';
import FilterToggle from './FilterToggle';
import CouponDisplay from './CouponDisplay';
import SavedCoupons from './SavedCoupons';
import { useCoupons } from '../../hooks/useCoupons';
import { useBrands } from '../../hooks/useBrands';
import { useAuth } from '../../context/AuthContext';

// Define Category type directly in this file
type Category = 
  | 'All'
  | 'Clothing'
  | 'Electronics'
  | 'Food & Grocery'
  | 'Travel'
  | 'Beauty'
  | 'Entertainment';

type FilterType = 'categories' | 'brands';

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { coupons, loading: couponsLoading, error: couponsError, refreshCoupons } = useCoupons(
    activeFilter === 'categories' ? selectedCategory : undefined,
    activeFilter === 'brands' ? selectedBrand : undefined
  );
  const { brands } = useBrands();

  const handleToggleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    // Reset selections when switching filters
    if (filter === 'categories') {
      setSelectedBrand(null);
    } else {
      setSelectedCategory('All');
    }
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%'
    }}>
      <FilterToggle 
        activeFilter={activeFilter}
        onToggle={handleToggleFilter}
      />
      
      {activeFilter === 'categories' ? (
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      ) : (
        <BrandFilter
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
        />
      )}
      
      <CouponDisplay 
        coupons={coupons}
        category={activeFilter === 'categories' ? selectedCategory : selectedBrand ? `${brands.find(r => r.id === selectedBrand)?.name || ''}` : 'All'}
        loading={couponsLoading}
        error={couponsError}
        refreshCoupons={refreshCoupons}
      />
      
      {user && (
        <div style={{
          marginTop: '32px'
        }}>
          <SavedCoupons userId={user.id} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;