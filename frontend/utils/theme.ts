// Modern color theme with curves
export const theme = {
  colors: {
    primary: {
      main: '#4F46E5', // Indigo
      light: '#818CF8',
      dark: '#3730A3',
      contrast: '#ffffff'
    },
    secondary: {
      main: '#EC4899', // Pink
      light: '#F472B6',
      dark: '#BE185D',
      contrast: '#ffffff'
    },
    accent: {
      main: '#06B6D4', // Cyan
      light: '#22D3EE',
      dark: '#0E7490',
      contrast: '#ffffff'
    },
    success: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrast: '#ffffff'
    },
    warning: {
      main: '#F59E0B', // Amber
      light: '#FBBF24',
      dark: '#D97706',
      contrast: '#ffffff'
    },
    error: {
      main: '#EF4444', // Red
      light: '#F87171',
      dark: '#B91C1C',
      contrast: '#ffffff'
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  }
};

// Category icons with modern style
export const categoryIcons = {
  All: '🏷️',
  Clothing: '👕',
  Electronics: '📱',
  'Food & Grocery': '🛒',
  Travel: '✈️',
  Beauty: '💄',
  Entertainment: '🎬'
};