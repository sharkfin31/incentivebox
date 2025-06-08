export interface Coupon {
  id: string;
  brand: string;
  brandLogo: string;
  description: string;
  savings: string;
  expirationDate: string;
  criteria: string;
  category: string;
  featured?: boolean;
  dealLink?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  couponsCount?: number;
}

export type Category = 
  | 'All'
  | 'Clothing'
  | 'Electronics'
  | 'Home & Garden'
  | 'Food & Grocery'
  | 'Travel'
  | 'Beauty'
  | 'Health'
  | 'Entertainment'
  | 'Sports'
  | 'Automotive'
  | 'Pets';