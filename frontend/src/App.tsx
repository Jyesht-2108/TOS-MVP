import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRoute } from '@/components/auth/RoleRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ParentLayout } from '@/layouts/ParentLayout';
import { Login } from '@/pages/Login';
import { NotFound } from '@/pages/NotFound';
import { AdminDashboard } from '@/modules/admin/pages/Dashboard';
import { Routes as AdminRoutes } from '@/modules/admin/pages/Routes';
import { RouteDetails } from '@/modules/admin/pages/RouteDetails';
import { Drivers } from '@/modules/admin/pages/Drivers';
import { DriverDetails } from '@/modules/admin/pages/DriverDetails';
import { Students } from '@/modules/admin/pages/Students';
import { StudentDetails } from '@/modules/admin/pages/StudentDetails';
import { LiveMonitoring } from '@/modules/admin/pages/LiveMonitoring';
import { TripDetails } from '@/modules/admin/pages/TripDetails';
import { ParentDashboard } from '@/modules/parent/pages/Dashboard';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      // Global error handler for queries
      const message = error?.message || 'An error occurred while fetching data';
      toast.error('Error', {
        description: message,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      // Global error handler for mutations
      const message = error?.message || 'An error occurred while saving data';
      toast.error('Error', {
        description: message,
      });
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
          <Route path="/admin/drivers" element={<Drivers />} />
          <Route path="/admin/drivers/:driverId" element={<DriverDetails />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/students/:studentId" element={<StudentDetails />} />
          <Route path="/admin/live-monitoring" element={<LiveMonitoring />} />
          <Route path="/admin/trips/:tripId" element={<TripDetails />} />
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
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AnimatedRoutes />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
