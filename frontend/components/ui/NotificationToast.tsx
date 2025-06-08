import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';
import { theme } from '../../utils/theme';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={20} />;
      case 'error':
        return <FiAlertCircle size={20} />;
      case 'warning':
        return <FiAlertTriangle size={20} />;
      case 'info':
      default:
        return <FiInfo size={20} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return theme.colors.success.dark;
      case 'error':
        return theme.colors.error.dark;
      case 'warning':
        return theme.colors.warning.dark;
      case 'info':
      default:
        return theme.colors.primary.dark;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return theme.colors.success.main;
      case 'error':
        return theme.colors.error.main;
      case 'warning':
        return theme.colors.warning.main;
      case 'info':
      default:
        return theme.colors.primary.main;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
      width: '90%'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            backgroundColor: getBackgroundColor(notification.type),
            borderLeft: `4px solid ${getBorderColor(notification.type)}`,
            borderRadius: theme.borderRadius.md,
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            animation: 'slideDown 0.3s ease-out forwards',
            position: 'relative',
            color: 'white'
          }}
        >
          <div style={{ color: 'white' }}>
            {getIcon(notification.type)}
          </div>
          
          <div style={{ flex: 1 }}>
            <p style={{ 
              margin: 0, 
              color: 'white',
              fontSize: '14px',
              lineHeight: 1.5,
              fontWeight: '500'
            }}>
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
            aria-label="Close notification"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
      
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationToast;