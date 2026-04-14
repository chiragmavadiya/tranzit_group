import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const userAuthString = localStorage.getItem('auth_token');

  let isAuthenticated = false;
  if (userAuthString) {
    try {
      const userAuth = JSON.parse(userAuthString);
      isAuthenticated = userAuth?.accessToken;
    } catch (e) {
      console.error('Failed to parse userAuth from localStorage', e);
    }
  }

  // If the user isn't authenticated, redirect to the signin page
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If the user is authenticated, render the child route (or layout Outlet)
  return <Outlet />;
}
