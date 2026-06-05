import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export default function PublicRoute() {
  const { isAuthenticated, role, next_step } = useAppSelector((state) => state.auth);

  // If the user is authenticated, redirect them away from public auth pages to orders
  if (isAuthenticated && next_step !== 'onboarding') {
    if (role === 'admin') {
      return <Navigate to="/admin/orders" replace />;
    } else {
      return <Navigate to="/orders" replace />;
    }
  }

  // Wrap public routes in the common AuthLayout for persistence and animations
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
