import { Link } from 'react-router-dom';
import { FiAlertCircle, FiHome } from 'react-icons/fi';
import { theme } from '../utils/theme';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      minHeight: '60vh'
    }}>
      <FiAlertCircle size={60} style={{ color: theme.colors.neutral[400], marginBottom: '24px' }} />
      
      <h1 style={{ 
        fontSize: '28px',
        fontWeight: 'bold',
        color: theme.colors.neutral[800],
        marginBottom: '16px'
      }}>
        Page Not Found
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: theme.colors.neutral[600],
        maxWidth: '500px',
        marginBottom: '32px'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: theme.colors.primary.main,
          color: 'white',
          borderRadius: theme.borderRadius.md,
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primary.dark;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primary.main;
        }}
      >
        <FiHome /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;