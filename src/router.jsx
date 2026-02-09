import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Jobs from './pages/public/Jobs';
import JobDetail from './pages/public/JobDetail';
import Apply from './pages/public/Apply';
import UserPsychotestExam from './pages/public/UserPsychotestExam';
// Dashboard Pages - User
import UserOverview from './pages/dashboard/UserOverview';
import UserProfile from './pages/dashboard/UserProfile';
import UserApplications from './pages/dashboard/UserApplications';
import UserDocuments from './pages/dashboard/UserDocuments';
import UserNotifications from './pages/dashboard/UserNotifications';

// Dashboard Pages - Admin
import AdminOverview from './pages/dashboard/AdminOverview';
import AdminApplicants from './pages/dashboard/AdminApplicants';
import AdminPsychotest from './pages/dashboard/AdminPsychotest';
import AdminProfile from './pages/dashboard/AdminProfile';
import AdminNotifications from './pages/dashboard/AdminNotifications';
import AdminRekap from './pages/dashboard/AdminRekap';
import AdminManageJobs from './pages/dashboard/AdminManageJobs';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'jobs/:slug', element: <JobDetail /> },
      { path: 'apply/:jobId', element: <Apply /> },
      { path: 'test-psikotes/:code', element: <UserPsychotestExam /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/admin',
    element: (
      <ProtectedRoute requiredRole="HR">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'overview', element: <AdminOverview /> },
      { path: 'profile', element: <AdminProfile /> },
      { path: 'manage-jobs', element: <AdminManageJobs /> },
      { path: 'applicants', element: <AdminApplicants /> },
      { path: 'psychotest', element: <AdminPsychotest /> },
      { path: 'notifications', element: <AdminNotifications /> },
    ],
  },
  {
    path: '/dashboard/user',
    element: (
      <ProtectedRoute requiredRole="CANDIDATE">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <UserOverview /> },
      { path: 'overview', element: <UserOverview /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'documents', element: <UserDocuments /> },
      { path: 'applications', element: <UserApplications /> },
      { path: 'notifications', element: <UserNotifications /> },
    ],
  },
]);

export default router;
