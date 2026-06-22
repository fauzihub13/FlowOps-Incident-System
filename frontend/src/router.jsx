import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedRoute, PublicOnly, RoleGuard } from '@/components/shared/RouteGuards';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { IncidentListPage } from '@/pages/IncidentListPage';
import { IncidentDetailPage } from '@/pages/IncidentDetailPage';
import { CreateIncidentPage } from '@/pages/CreateIncidentPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicOnly>
        <LoginPage />
      </PublicOnly>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'incidents', element: <IncidentListPage /> },
          { path: 'incidents/new', element: <RoleGuard allowed={['reporter']}><CreateIncidentPage /></RoleGuard> },
          { path: 'incidents/:id', element: <IncidentDetailPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}