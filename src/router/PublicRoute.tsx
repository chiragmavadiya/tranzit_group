import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { showToast } from '@/components/ui/custom-toast';
import { useEffect } from 'react';

export default function PublicRoute() {
  const { isAuthenticated, role, next_step } = useAppSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const shouldRedirect = isAuthenticated && next_step !== 'onboarding' && next_step !== 'change_password';

  useEffect(() => {
    if (shouldRedirect) {
      const error = searchParams.get('error');
      const success = searchParams.get('success');
      
      if (error) {
        showToast(decodeURIComponent(error), 'error');
      }
      if (success) {
        showToast(decodeURIComponent(success), 'success');
      }

      const target = role === 'admin' ? '/admin/orders' : '/orders';
      navigate(target, { replace: true });
    }
  }, [shouldRedirect, role, searchParams, navigate]);

  if (shouldRedirect) {
    return null;
  }

  // Wrap public routes in the common AuthLayout for persistence and animations
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

