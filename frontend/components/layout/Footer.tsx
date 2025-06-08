import { FiHeart } from 'react-icons/fi';
import { theme } from '../../utils/theme';

const Footer = () => {
  return (
    <footer style={{
      padding: '24px 16px',
      borderTop: `1px solid ${theme.colors.neutral[200]}`,
      backgroundColor: theme.colors.neutral[50]
    }}>
      <p style={{
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '14px',
        color: theme.colors.neutral[500],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
      }}>
        © {new Date().getFullYear()} IncentiveBox. Made with <FiHeart style={{ color: theme.colors.error.main }} /> All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;