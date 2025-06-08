import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { theme } from '../../utils/theme';
import { useNotification } from '../../context/NotificationContext';

interface CopyCodeButtonProps {
  coupon: {
    promo_code?: string;
    savings: string;
  };
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const CopyCodeButton = ({ 
  coupon, 
  size = 'md', 
  label = 'Code' 
}: CopyCodeButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotification();

  const handleCopy = () => {
    const textToCopy = coupon.promo_code || coupon.savings;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addNotification('success', 'Promo code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Size-based styling
  const sizeStyles = {
    sm: { padding: '4px 8px', fontSize: '12px', iconSize: 12 },
    md: { padding: '6px 12px', fontSize: '14px', iconSize: 14 },
    lg: { padding: '8px 16px', fontSize: '16px', iconSize: 16 }
  }[size];

  return (
    <button
      title="Copy promo code"
      onClick={handleCopy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        backgroundColor: copied ? theme.colors.success.main : 'white',
        color: copied ? 'white' : theme.colors.neutral[700],
        border: `1px solid ${copied ? theme.colors.success.main : theme.colors.neutral[300]}`,
        borderRadius: theme.borderRadius.md,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontWeight: '500'
      }}
    >
      {copied ? <FiCheck size={sizeStyles.iconSize} /> : <FiCopy size={sizeStyles.iconSize} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

export default CopyCodeButton;