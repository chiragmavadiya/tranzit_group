import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
  const userAuthString = localStorage.getItem('auth_token');

  let isAuthenticated = false;
  if (userAuthString) {
    try {
      const userAuth = JSON.parse(userAuthString);
      // We check for accessToken as a sign of being fully authenticated
      isAuthenticated = !!userAuth?.accessToken;
    } catch (e) {
      console.error('Failed to parse userAuth from localStorage', e);
    }
  }

  // If the user is authenticated, redirect them away from public auth pages to orders
  if (isAuthenticated) {
    return <Navigate to="/orders" replace />;
  }

  // If the user isn't authenticated, render the children (SignIn, SignUp, etc.)
  return <Outlet />;
}
