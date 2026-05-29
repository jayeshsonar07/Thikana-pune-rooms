import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen   from './pages/SplashScreen';
import HomePage       from './pages/HomePage';
import ListingDetail  from './pages/ListingDetail';
import Dashboard      from './pages/Dashboard';
import AddListing     from './pages/AddListing';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import ProfilePage    from './pages/ProfilePage';
import AdminLogin     from './pages/AdminLogin';
import AdminPanel     from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<SplashScreen />} />
        <Route path="/home"               element={<HomePage />} />
        <Route path="/listing/:id"        element={<ListingDetail />} />
        <Route path="/dashboard"          element={<Dashboard />} />
        <Route path="/add-listing"        element={<AddListing />} />
        <Route path="/edit-listing/:id"   element={<AddListing editMode />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register"           element={<RegisterPage />} />
        <Route path="/profile"            element={<ProfilePage />} />
        <Route path="/admin"              element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login"        element={<AdminLogin />} />
        <Route path="/admin/*"            element={<AdminPanel />} />
        <Route path="*"                   element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
