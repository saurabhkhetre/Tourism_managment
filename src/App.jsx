import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PackageProvider } from './contexts/PackageContext';
import { BookingProvider } from './contexts/BookingContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { EnquiryProvider } from './contexts/EnquiryContext';
import { ToastProvider } from './components/ui/Toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

import Home from './pages/public/Home';
import Packages from './pages/public/Packages';
import PackageDetail from './pages/public/PackageDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import UserDashboard from './pages/user/UserDashboard';
import MyBookings from './pages/user/MyBookings';
import BookTour from './pages/user/BookTour';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPackages from './pages/admin/AdminPackages';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminHotels from './pages/admin/AdminHotels';
import AdminTransport from './pages/admin/AdminTransport';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

import { useEffect } from 'react';
import { Home as HomeIcon, ArrowLeft } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track!
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary btn-lg">
            <HomeIcon size={18} /> Back to Home
          </Link>
          <Link to="/packages" className="btn btn-secondary btn-lg">
            <ArrowLeft size={18} /> Browse Packages
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/packages" element={<PublicLayout><Packages /></PublicLayout>} />
        <Route path="/packages/:id" element={<PublicLayout><PackageDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Auth routes */}
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

        {/* User protected routes */}
        <Route path="/dashboard" element={<PublicLayout><ProtectedRoute><UserDashboard /></ProtectedRoute></PublicLayout>} />
        <Route path="/my-bookings" element={<PublicLayout><ProtectedRoute><MyBookings /></ProtectedRoute></PublicLayout>} />
        <Route path="/book/:id" element={<PublicLayout><ProtectedRoute><BookTour /></ProtectedRoute></PublicLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="transport" element={<AdminTransport />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <PackageProvider>
        <BookingProvider>
          <ReviewProvider>
            <EnquiryProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </EnquiryProvider>
          </ReviewProvider>
        </BookingProvider>
      </PackageProvider>
    </AuthProvider>
  );
}

export default App;
