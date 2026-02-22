import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { ExecutiveDashboard } from "./pages/admin/ExecutiveDashboard";
import { BookingManagement } from "./pages/manager/BookingManagement";
import { ResourceManagement } from "./pages/admin/ResourceManagement";
import { DynamicPricing } from "./pages/admin/DynamicPricing";
import { UserManagement } from "./pages/admin/UserManagement";
import { AdminManagement } from "./pages/manager/AdminManagement";
import { PendingBookings } from "./pages/manager/PendingBookings";
import { AllBookings } from "./pages/manager/AllBookings";
import { ResourceDetailView } from "./pages/manager/ResourceDetailView";
import { UserManagement as ManagerUserManagement } from "./pages/manager/UserManagement";
import { InvoiceTemplate } from "./pages/manager/InvoiceTemplate";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          const role = decoded.role === 'ROLE_ADMIN' ? 'admin' : 'manager';
          setIsAuthenticated(true);
          setUserRole(role);
        } else {
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
      } else if (location.pathname !== '/login') {
        setIsAuthenticated(false);
      }
      setIsInitializing(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUserRole(null);
      navigate('/login');
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = (role: 'admin' | 'manager') => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/manager/bookings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#030213] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      
      {isAuthenticated && (
        <Route element={<DashboardLayout userRole={userRole!} onLogout={handleLogout} />}>
          {/* Admin Routes */}
          {userRole === 'admin' && (
            <>
              <Route path="/admin/dashboard" element={<ExecutiveDashboard />} />
              <Route path="/admin/resources" element={<ResourceManagement />} />
              <Route path="/admin/pricing" element={<DynamicPricing />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          )}

          {/* Manager Routes */}
          {userRole === 'manager' && (
            <>
              <Route path="/manager/bookings" element={<BookingManagement />} />
              <Route path="/manager/pending-bookings" element={<PendingBookings />} />
              <Route path="/manager/all-bookings" element={<AllBookings />} />
              <Route path="/manager/admins" element={<AdminManagement onResourceClick={(id) => navigate(`/manager/resources/${id}`)} />} />
              <Route path="/manager/resources/:id" element={<ResourceDetailViewWrapper />} />
              <Route path="/manager/users" element={<ManagerUserManagement />} />
              <Route path="/manager/invoice-template" element={<InvoiceTemplate />} />
              <Route path="/manager" element={<Navigate to="/manager/bookings" replace />} />
            </>
          )}

          <Route path="/" element={<Navigate to={userRole === 'admin' ? "/admin/dashboard" : "/manager/bookings"} replace />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ResourceDetailViewWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  if (!id) return <Navigate to="/manager/admins" replace />;
  
  return (
    <ResourceDetailView 
      resourceId={parseInt(id)} 
      onBack={() => navigate('/manager/admins')} 
    />
  );
}
