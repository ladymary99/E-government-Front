import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import CitizenLogin from "./pages/auth/CitizenLogin";
import CitizenRegister from "./pages/auth/CitizenRegister";
import OfficerLogin from "./pages/auth/OfficerLogin";
import AdminLogin from "./pages/auth/AdminLogin";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import ServiceApplication from "./pages/citizen/ServiceApplication";
import RequestTracking from "./pages/citizen/RequestTracking";
import CitizenNotifications from "./pages/citizen/CitizenNotifications";
import CitizenProfile from "./pages/citizen/CitizenProfile";

import OfficerDashboard from "./pages/officer/OfficerDashboard";
import RequestDetail from "./pages/officer/RequestDetail";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDepartments from "./pages/admin/ManageDepartments";
import ManageServices from "./pages/admin/ManageServices";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";

import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/register" element={<CitizenRegister />} />
          <Route path="/officer/login" element={<OfficerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Citizen Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/apply"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <ServiceApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/requests"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <RequestTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/notifications"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <CitizenNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/profile"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <CitizenProfile />
              </ProtectedRoute>
            }
          />

          {/* Officer Routes */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["officer"]}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/request/:id"
            element={
              <ProtectedRoute allowedRoles={["officer"]}>
                <RequestDetail />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
