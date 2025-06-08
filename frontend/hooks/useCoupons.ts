import { useState, useEffect } from 'react';
import { 
  fetchCoupons, 
  fetchCouponsByCategory, 
  fetchCouponsByBrand, 
  fetchFeaturedCoupons,
  subscribeToCoupons
} from '../services/supabase';

interface UseCouponsOptions {
  featured?: boolean;
  limit?: number;
}

export const useCoupons = (
  category?: string,
  brandId?: string,
  options: UseCouponsOptions = {}
) => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { featured = false, limit } = options;

  const loadCoupons = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data: any[] = [];
      
      if (featured) {
        data = await fetchFeaturedCoupons();
      } else if (category && category !== 'All') {
        data = await fetchCouponsByCategory(category);
      } else if (brandId) {
        data = await fetchCouponsByBrand(brandId);
      } else {
        data = await fetchCoupons({ limit });
      }
      
      setCoupons(data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
    
    // Set up real-time subscription for coupon changes
    const subscription = subscribeToCoupons(() => {
      // Reload coupons when changes are detected
      loadCoupons();
    });
    
    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [category, brandId, featured, limit]);
  
  return { coupons, loading, error, refreshCoupons: loadCoupons };
};

export default useCoupons;