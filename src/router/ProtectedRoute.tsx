import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';
import { hasRoutePermission, getFirstAllowedPath, getFirstAllowedSettingsPath } from '@/utils/permission';

interface ProtectedRouteProps {
  role?: string;
}

export default function ProtectedRoute({ role: requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role: userRole, next_step, team_access } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If the user isn't authenticated, redirect to the signin page
  if (!isAuthenticated && !localStorage.getItem('auth_token') && next_step !== 'verify_email') {
    return <Navigate to="/login" replace />;
  }

  if (next_step === 'change_password') {
    return <Navigate to={`/change-password`} replace />
  }

  // If the component requires a specific role and the user doesn't have it
  if (requiredRole && userRole !== requiredRole && next_step !== 'onboarding') {
    // Redirect based on their actual role
    if (userRole === 'admin' || userRole === 'Staff') {
      return <Navigate to="/admin/orders" replace />;
    } else {
      console.log('render protected rotute')
      return <Navigate to="/orders" replace />;
    }
  }

  // Permission checks for customer sub-users
  if (userRole === 'customer' && team_access?.is_sub_user) {
    if (!hasRoutePermission(location.pathname, team_access, userRole)) {
      console.log('redirect....', userRole)
      if (location.pathname === '/settings' || location.pathname.startsWith('/settings/')) {
        const firstAllowedSettings = getFirstAllowedSettingsPath(team_access, userRole);
        if (firstAllowedSettings) {
          return <Navigate to={firstAllowedSettings} replace />;
        }
      }
      const fallbackPath = getFirstAllowedPath(team_access, userRole);
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // If the user is authenticated, render the child route (or layout Outlet)
  return <Outlet />;
}
