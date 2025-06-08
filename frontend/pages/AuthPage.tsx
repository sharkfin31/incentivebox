import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { theme } from '../utils/theme';
import { FiUserPlus, FiLogIn } from 'react-icons/fi';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { user, loading } = useAuth();
  
  // Redirect if user is already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: theme.colors.neutral[800],
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        Welcome to IncentiveBox!
      </h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
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
            onClick={() => setActiveTab('login')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'login' ? theme.colors.primary.main : 'transparent',
              color: activeTab === 'login' ? 'white' : theme.colors.neutral[700],
              border: 'none',
              fontWeight: activeTab === 'login' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRadius: theme.borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FiLogIn /> Log In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'register' ? theme.colors.primary.main : 'transparent',
              color: activeTab === 'register' ? 'white' : theme.colors.neutral[700],
              border: 'none',
              fontWeight: activeTab === 'register' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRadius: theme.borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FiUserPlus /> Register
          </button>
        </div>
      </div>
      
      {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthPage;