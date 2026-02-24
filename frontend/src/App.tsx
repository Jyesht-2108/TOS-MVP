import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRoute } from '@/components/auth/RoleRoute';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ParentLayout } from '@/layouts/ParentLayout';
import { Login } from '@/pages/Login';
import { AdminDashboard } from '@/modules/admin/pages/Dashboard';
import { Routes as AdminRoutes } from '@/modules/admin/pages/Routes';
import { RouteDetails } from '@/modules/admin/pages/RouteDetails';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/routes" element={<AdminRoutes />} />
              <Route path="/admin/routes/:routeId" element={<RouteDetails />} />
              <Route path="/admin/drivers" element={<div>Drivers Page (Coming Soon)</div>} />
              <Route path="/admin/students" element={<div>Students Page (Coming Soon)</div>} />
            </Route>

            {/* Parent Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['PARENT']}>
                    <ParentLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route path="/parent/dashboard" element={<div>Parent Dashboard (Coming Soon)</div>} />
              <Route path="/parent/children" element={<div>My Children Page (Coming Soon)</div>} />
              <Route path="/parent/transport" element={<div>Transport Info Page (Coming Soon)</div>} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
