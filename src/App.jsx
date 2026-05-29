import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { listenAuthState } from './services/db';
import SplashScreen  from './pages/SplashScreen';
import HomePage      from './pages/HomePage';
import ListingDetail from './pages/ListingDetail';
import AddListing    from './pages/AddListing';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import ProfilePage   from './pages/ProfilePage';
import AdminLogin    from './pages/AdminLogin';
import AdminPanel    from './pages/AdminPanel';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    return listenAuthState(setUser);
  }, []);

  if (user === undefined) return null; // Wait for auth check
  
  if (!user) {
    // Save where they wanted to go so we can redirect them back later if needed
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default function App() {
  // Force splash screen on hard reload
  useEffect(() => {
    if (!sessionStorage.getItem('app_loaded')) {
      sessionStorage.setItem('app_loaded', 'true');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Splash on every reload — always starts here */}
        <Route path="/"                   element={<SplashScreen />} />
        <Route path="/home"               element={<HomePage />} />
        <Route path="/listing/:id"        element={<ListingDetail />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register"           element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard"          element={<Navigate to="/profile" replace />} />
        <Route path="/add-listing"        element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
        <Route path="/edit-listing/:id"   element={<ProtectedRoute><AddListing editMode /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin"              element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login"        element={<AdminLogin />} />
        <Route path="/admin/*"            element={<AdminPanel />} />
        
        {/* All unknown routes → splash */}
        <Route path="*"                   element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
