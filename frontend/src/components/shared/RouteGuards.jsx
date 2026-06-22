import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { FullPageSpinner } from '@/components/ui/spinner';

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuthContext();
  const location = useLocation();

  if (isInitializing) return <FullPageSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function RoleGuard({ allowed, children }) {
  const { user } = useAuthContext();
  if (!user || !allowed.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md rounded-md border border-destructive/40 bg-destructive/5 p-6 text-center">
        <h2 className="text-lg font-semibold text-destructive">403 — Akses Ditolak</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Halaman ini hanya dapat diakses oleh role: {allowed.join(', ')}.
        </p>
      </div>
    );
  }
  return children;
}

export function PublicOnly({ children }) {
  const { isAuthenticated, isInitializing } = useAuthContext();
  if (isInitializing) return <FullPageSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}