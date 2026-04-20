import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';

export default function PublicRoute() {
  const { isAuthenticated, role, next_step } = useAppSelector((state) => state.auth);

  // If the user is authenticated, redirect them away from public auth pages to orders
  if (isAuthenticated && next_step !== 'onboarding') {
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If the user isn't authenticated, render the children (SignIn, SignUp, etc.)
  return <Outlet />;
}
