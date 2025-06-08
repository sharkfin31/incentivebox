import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import CouponDetail from './pages/CouponDetail';
import CategoryPage from './pages/CategoryPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import HelpPage from './pages/HelpPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/ui/NotificationToast';
import './index.css';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/coupon/:id" element={<CouponDetail />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <NotificationToast />
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;