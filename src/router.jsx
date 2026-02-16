import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';
import { Loader2 } from 'lucide-react';

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
  </div>
);

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const JobDetail = lazy(() => import('./pages/public/JobDetail'));
const Apply = lazy(() => import('./pages/public/Apply'));
const UserPsychotestExam = lazy(() => import('./pages/public/UserPsychotestExam'));
const VerifyEmail = lazy(() => import('./pages/public/VerifyEmail'));

// Dashboard Pages - User
const UserOverview = lazy(() => import('./pages/dashboard/UserOverview'));
const UserProfile = lazy(() => import('./pages/dashboard/UserProfile'));
const AccountSettings = lazy(() => import('./pages/dashboard/AccountSettings'));
const UserApplications = lazy(() => import('./pages/dashboard/UserApplications'));
const UserDocuments = lazy(() => import('./pages/dashboard/UserDocuments'));
const UserNotifications = lazy(() => import('./pages/dashboard/UserNotifications'));
const UserPsychotest = lazy(() => import('./pages/dashboard/UserPsychotest'));
const UserAvailableJobs = lazy(() => import('./pages/dashboard/UserAvailableJobs'));

// Dashboard Pages - Admin
const AdminOverview = lazy(() => import('./pages/dashboard/AdminOverview'));
const AdminApplicants = lazy(() => import('./pages/dashboard/AdminApplicants'));
const AdminPsychotest = lazy(() => import('./pages/dashboard/AdminPsychotest'));
const AdminProfile = lazy(() => import('./pages/dashboard/AdminProfile'));
const AdminNotifications = lazy(() => import('./pages/dashboard/AdminNotifications'));
const AdminRekap = lazy(() => import('./pages/dashboard/AdminRekap'));
const AdminManageJobs = lazy(() => import('./pages/dashboard/AdminManageJobs'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={null}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'jobs/:slug/details', element: <JobDetail /> },
      {
        path: 'apply/:jobId',
        element: (
          <ProtectedRoute requiredRole="USER">
            <Apply />
          </ProtectedRoute>
        )
      },
    ],
  },
  {
    path: '/test-psikotes/:code',
    element: (
      <Suspense fallback={<PageLoader />}>
        <UserPsychotestExam />
      </Suspense>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <Suspense fallback={<PageLoader />}>
        <VerifyEmail />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Register />
      </Suspense>
    ),
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
      <ProtectedRoute requiredRole="ADMIN">
        <Suspense fallback={<PageLoader />}>
          <DashboardLayout />
        </Suspense>
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
      <ProtectedRoute requiredRole="USER">
        <Suspense fallback={<PageLoader />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <UserOverview /> },
      { path: 'overview', element: <UserOverview /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'settings', element: <AccountSettings /> },
      { path: 'documents', element: <UserDocuments /> },
      { path: 'applications', element: <UserApplications /> },
      { path: 'lowongan', element: <UserAvailableJobs /> },
      { path: 'psychotest', element: <UserPsychotest /> },
      { path: 'notifications', element: <UserNotifications /> },
    ],
  },
]);

export default router;
