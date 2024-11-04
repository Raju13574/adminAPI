import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Pricing from './pages/Pricing';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import Dashboard from './components/Usercontroll/Dashboard/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy'; 
import TermsAndConditions from './pages/TermsAndConditions';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IDEComponent from './components/Usercontroll/IDEComponent';
import ScrollToTop from './components/ScrollToTop';
import Auth from './pages/Auth';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsPage from './components/AnalyticsPage';  // Add this line
import APIDocumentation from './pages/APIDocumentation';
import NotFound from './pages/NotFound';

// ... rest of your code remains the same

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isProtectedRoute = 
    location.pathname.includes('/dashboard') || 
    location.pathname.includes('/admin/dashboard') ||
    location.pathname.includes('/ide') ||
    location.pathname.includes('/analytics');

  return (
    <div className={`min-h-screen ${isProtectedRoute ? 'bg-white' : 'bg-[#2c183f] text-white'} overflow-x-hidden flex flex-col`}>
      {!isProtectedRoute && <Navbar />}
      {!isProtectedRoute && <div className="h-px bg-pink-500 w-full"></div>}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route 
            path="/ide" 
            element={
              <ProtectedRoute>
                <IDEComponent />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route 
            path="/admin/dashboard/*" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/api-docs" element={<APIDocumentation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isProtectedRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;
