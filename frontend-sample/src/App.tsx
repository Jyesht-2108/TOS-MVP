import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';
import { MainLayout } from './components/layout/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import ParentLayout from './layouts/ParentLayout';
import AccountantLayout from './layouts/AccountantLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './modules/admin/pages/Dashboard';
import Users from './modules/admin/pages/Users';
import Classes from './modules/admin/pages/Classes';
import Gallery from './modules/admin/pages/Gallery';
import Analytics from './modules/admin/pages/Analytics';
import Settings from './modules/admin/pages/Settings';

// Teacher Pages
import TeacherDashboard from './modules/teacher/pages/Dashboard';
import Attendance from './modules/teacher/pages/Attendance';
import Marks from './modules/teacher/pages/Marks';
import Diary from './modules/teacher/pages/Diary';
import Materials from './modules/teacher/pages/Materials';
import Schedule from './modules/teacher/pages/Schedule';
import Students from './modules/teacher/pages/Students';

// Student Pages
import StudentDashboard from './modules/student/pages/Dashboard';
import Syllabus from './modules/student/pages/Syllabus';
import StudentProgress from './modules/student/pages/Progress';
import AITutor from './modules/student/pages/AITutor';
import StudentAttendance from './modules/student/pages/Attendance';
import Homework from './modules/student/pages/Homework';
import Tests from './modules/student/pages/Tests';

// Parent Pages
import ParentDashboard from './modules/parent/pages/Dashboard';
import ParentAttendance from './modules/parent/pages/Attendance';
import ParentProgress from './modules/parent/pages/Progress';
import ParentPayments from './modules/parent/pages/Payments';
import ParentMessages from './modules/parent/pages/Messages';

// Accountant Pages
import AccountantDashboard from './modules/accountant/pages/Dashboard';
import Invoices from './modules/accountant/pages/Invoices';
import Payments from './modules/accountant/pages/Payments';
import Reports from './modules/accountant/pages/Reports';

// Admissions Pages
import AdmissionsDashboard from './modules/admissions/pages/Dashboard';
import ApplicationDetail from './modules/admissions/pages/ApplicationDetail';
import PublicForm from './modules/admissions/pages/PublicForm';

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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/apply" element={<PublicForm />} />
            </Route>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Admin Routes */}
              <Route path="/admin" element={
                <RoleRoute allowedRoles={['admin', 'principal']}>
                  <AdminLayout />
                </RoleRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="classes" element={<Classes />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Teacher Routes */}
              <Route path="/teacher" element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherLayout />
                </RoleRoute>
              }>
                <Route index element={<TeacherDashboard />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="marks" element={<Marks />} />
                <Route path="diary" element={<Diary />} />
                <Route path="materials" element={<Materials />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="students" element={<Students />} />
              </Route>
              
              {/* Student Routes */}
              <Route path="/student" element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentLayout />
                </RoleRoute>
              }>
                <Route index element={<StudentDashboard />} />
                <Route path="attendance" element={<StudentAttendance />} />
                <Route path="homework" element={<Homework />} />
                <Route path="tests" element={<Tests />} />
                <Route path="syllabus" element={<Syllabus />} />
                <Route path="progress" element={<StudentProgress />} />
                <Route path="ai-tutor" element={<AITutor />} />
              </Route>
              
              {/* Parent Routes */}
              <Route path="/parent" element={
                <RoleRoute allowedRoles={['parent']}>
                  <ParentLayout />
                </RoleRoute>
              }>
                <Route index element={<ParentDashboard />} />
                <Route path="attendance" element={<ParentAttendance />} />
                <Route path="progress" element={<ParentProgress />} />
                <Route path="payments" element={<ParentPayments />} />
                <Route path="messages" element={<ParentMessages />} />
              </Route>
              
              {/* Accountant Routes */}
              <Route path="/accountant" element={
                <RoleRoute allowedRoles={['accountant']}>
                  <AccountantLayout />
                </RoleRoute>
              }>
                <Route index element={<AccountantDashboard />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="payments" element={<Payments />} />
                <Route path="reports" element={<Reports />} />
              </Route>
              
              {/* Admissions Routes */}
              <Route path="/admissions" element={
                <RoleRoute allowedRoles={['admissions_staff']}>
                  <AccountantLayout />
                </RoleRoute>
              }>
                <Route index element={<AdmissionsDashboard />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
