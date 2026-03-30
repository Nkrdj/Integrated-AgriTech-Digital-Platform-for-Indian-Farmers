import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Auth pages
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage  from './pages/LandingPage';

// Farmer pages
import FarmerLayout    from './components/farmer/FarmerLayout';
import FarmerDashboard from './pages/farmer/Dashboard';
import ShopPage        from './pages/farmer/Shop';
import AdvisoryPage    from './pages/farmer/Advisory';
import WeatherPage     from './pages/farmer/Weather';
import PricesPage      from './pages/farmer/Prices';
import SchemesPage     from './pages/farmer/Schemes';
import OrdersPage      from './pages/farmer/Orders';
import ProfilePage     from './pages/farmer/Profile';

// Admin pages
import AdminLayout    from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFarmers   from './pages/admin/Farmers';
import AdminProducts  from './pages/admin/Products';
import AdminOrders    from './pages/admin/Orders';
import AdminAdvisory  from './pages/admin/Advisory';
import AdminSchemes   from './pages/admin/Schemes';
import AdminPrices    from './pages/admin/Prices';

// Guards
const FarmerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'farmer') return <Navigate to="/admin" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner"/></div>;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Farmer */}
      <Route path="/dashboard" element={<FarmerRoute><FarmerLayout /></FarmerRoute>}>
        <Route index           element={<FarmerDashboard />} />
        <Route path="shop"     element={<ShopPage />} />
        <Route path="advisory" element={<AdvisoryPage />} />
        <Route path="weather"  element={<WeatherPage />} />
        <Route path="prices"   element={<PricesPage />} />
        <Route path="schemes"  element={<SchemesPage />} />
        <Route path="orders"   element={<OrdersPage />} />
        <Route path="profile"  element={<ProfilePage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index             element={<AdminDashboard />} />
        <Route path="farmers"    element={<AdminFarmers />} />
        <Route path="products"   element={<AdminProducts />} />
        <Route path="orders"     element={<AdminOrders />} />
        <Route path="advisory"   element={<AdminAdvisory />} />
        <Route path="schemes"    element={<AdminSchemes />} />
        <Route path="prices"     element={<AdminPrices />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px', background: '#1b3a1f', color: '#fff', borderRadius: '10px' } }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
