import { useState, useEffect } from 'react';
import { fetchBrands, fetchBrandByName } from '../services/supabase';

interface Brand {
  id: string;
  name: string;
  logo: string;
  coupons_count?: number;
}

// Hook for fetching all brands
export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBrands = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchBrands();
        setBrands(data as Brand[]);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    getBrands();
  }, []);

  return { brands, loading, error };
};

// Hook for fetching a specific brand by name
export const useBrand = (name: string | null) => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBrand = async () => {
      if (!name) {
        setBrand(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchBrandByName(name);
        setBrand(data);
      } catch (err) {
        console.error('Error fetching brand:', err);
        setError('Failed to fetch brand');
      } finally {
        setLoading(false);
      }
    };

    getBrand();
  }, [name]);

  return { brand, loading, error };
};