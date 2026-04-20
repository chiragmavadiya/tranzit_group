import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';

export default function ProtectedRoute({ role: requiredRole }: { role: string }) {
  const { isAuthenticated, role: userRole } = useAppSelector((state) => state.auth);

  // If the user isn't authenticated, redirect to the signin page
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If the component requires a specific role and the user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on their actual role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If the user is authenticated, render the child route (or layout Outlet)
  return <Outlet />;
}
