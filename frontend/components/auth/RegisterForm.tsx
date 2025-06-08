import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { theme } from '../../utils/theme';
import { FiMail, FiLock, FiUserPlus, FiUser } from 'react-icons/fi';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      addNotification('error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      addNotification('error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      addNotification('error', 'Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { success, error } = await signUp(email, password, name);
      
      if (success) {
        addNotification('success', 'Registration successful! Please check your email to confirm your account.');
      } else {
        addNotification('error', error || 'Failed to register');
      }
    } catch (err) {
      addNotification('error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.shadows.md
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: theme.colors.neutral[800],
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        Create Account
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label 
            htmlFor="name"
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.colors.neutral[700]
            }}
          >
            Name
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
            <FiUser style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.neutral[500]
            }} />
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label 
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.colors.neutral[700]
            }}
          >
            Email
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
            <FiMail style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.neutral[500]
            }} />
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label 
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.colors.neutral[700]
            }}
          >
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
            <FiLock style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.neutral[500]
            }} />
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label 
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.colors.neutral[700]
            }}
          >
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
            <FiLock style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.neutral[500]
            }} />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: theme.colors.primary.main,
            color: 'white',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            fontSize: '16px',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          {isSubmitting ? 'Creating Account...' : (
            <>
              <FiUserPlus /> Create Account
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;