import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { theme } from '../../utils/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100vw',
      overflow: 'hidden',
      backgroundColor: theme.colors.neutral[50]
    }}>
      {!isAuthPage && <Header />}
      <main style={{
        flex: '1',
        padding: '32px',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;