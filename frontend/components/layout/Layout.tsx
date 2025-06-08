import Header from './Header';
import Footer from './Footer';
import { theme } from '../../utils/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100vw',
      overflow: 'hidden',
      backgroundColor: theme.colors.neutral[50]
    }}>
      <Header />
      <main style={{
        flex: '1',
        padding: '16px',
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