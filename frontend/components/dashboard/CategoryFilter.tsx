import { useState, useEffect } from 'react';
import { theme, categoryIcons } from '../../utils/theme';

// Define Category type directly in this file
type Category = 
  | 'All'
  | 'Clothing'
  | 'Electronics'
  | 'Food & Grocery'
  | 'Travel'
  | 'Beauty'
  | 'Entertainment';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categories: Category[] = [
  'All',
  'Clothing',
  'Electronics',
  'Food & Grocery',
  'Travel',
  'Beauty',
  'Entertainment'
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
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
        gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(100px, 1fr))' : 'repeat(7, 1fr)',
        gap: '12px',
        padding: '8px 0'
      }}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const icon = categoryIcons[category as keyof typeof categoryIcons];
          
          return (
            <div
              key={category}
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
              onClick={() => onSelectCategory(category)}
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
                fontSize: '24px', 
                marginBottom: '8px',
                opacity: isSelected ? 1 : 0.8
              }}>
                {icon}
              </div>
              <div style={{ 
                fontSize: '14px',
                fontWeight: isSelected ? '600' : '500'
              }}>
                {category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;