import { theme } from '../../utils/theme';
import { FiGrid, FiTag } from 'react-icons/fi';

interface FilterToggleProps {
  activeFilter: 'categories' | 'brands';
  onToggle: (filter: 'categories' | 'brands') => void;
}

const FilterToggle = ({ activeFilter, onToggle }: FilterToggleProps) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        border: `1px solid ${theme.colors.neutral[200]}`,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        background: theme.colors.neutral[100],
        padding: '4px'
      }}>
        <button
          onClick={() => onToggle('categories')}
          style={{
            padding: '8px 16px',
            background: activeFilter === 'categories' ? theme.colors.primary.main : 'transparent',
            color: activeFilter === 'categories' ? 'white' : theme.colors.neutral[700],
            border: 'none',
            fontWeight: activeFilter === 'categories' ? 'bold' : 'normal',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FiTag size={16} />
          Categories
        </button>
        <button
          onClick={() => onToggle('brands')}
          style={{
            padding: '8px 16px',
            background: activeFilter === 'brands' ? theme.colors.primary.main : 'transparent',
            color: activeFilter === 'brands' ? 'white' : theme.colors.neutral[700],
            border: 'none',
            fontWeight: activeFilter === 'brands' ? 'bold' : 'normal',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FiGrid size={16} />
          Brands
        </button>
      </div>
    </div>
  );
};

export default FilterToggle;