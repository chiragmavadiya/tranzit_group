import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';

export default function ProtectedRoute({ role: requiredRole }: { role: string }) {
  console.log("Render ProtectedRoute...")
  const { isAuthenticated, role: userRole, next_step } = useAppSelector((state) => state.auth);

  // If the user isn't authenticated, redirect to the signin page
  console.log('PROTECTED condition 1...', !isAuthenticated, !localStorage.getItem('auth_token'), next_step !== 'verify_email')
  if (!isAuthenticated && !localStorage.getItem('auth_token') && next_step !== 'verify_email') {
    return <Navigate to="/login" replace />;
  }

  // If the component requires a specific role and the user doesn't have it
  console.log('PROTECTED condition 2...', requiredRole, userRole, next_step !== 'onboarding')
  if (requiredRole && userRole !== requiredRole && next_step !== 'onboarding') {
    // Redirect based on their actual role
    console.log('PROTECTED condition 3...')
    if (userRole === 'admin') {
      console.log('PROTECTED condition 4...')
      return <Navigate to="/admin/orders" replace />;
    } else {
      console.log('PROTECTED condition 5...')
      return <Navigate to="/orders" replace />;
    }
  }

  console.log('PROTECTED condition 6...')
  // If the user is authenticated, render the child route (or layout Outlet)
  return <Outlet />;
}
