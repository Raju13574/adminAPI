import { Link, Navigate, Routes, Route } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
      <p className="text-slate-600 mb-6">Page not found</p>
      <Link 
        to="/dashboard"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

// Then in App.js
function App() {
  return (
    <Routes>
      {/* Valid routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/billing" element={<BillingContent />} />
      
      {/* Show 404 for invalid dashboard paths */}
      <Route path="/dashboard/*" element={<NotFound />} />
      
      {/* Catch all other invalid paths */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
} 