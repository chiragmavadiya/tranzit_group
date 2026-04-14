import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/app/router/ProtectedRoute';
import PublicRoute from '@/app/router/PublicRoute';
import Layout from '@/layout';
import brandLogo from '@/assets/Tranzit_Logo.svg';

// Lazy load page components
const SignIn = lazy(() => import('@/features/auth/pages/SignIn'));
const SignUp = lazy(() => import('@/features/auth/pages/SignUp'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const Orders = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderDetails = lazy(() => import('@/features/orders/pages/OrderDetails'));
const Search = lazy(() => import('@/features/search/pages/SearchPage'));
const Setup = lazy(() => import('@/features/setup/pages/SetupPage'));

// Simple loading fallback component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-950">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <img
          src={brandLogo}
          alt="Tranzit Group Logo"
          className="h-16 w-auto animate-pulse brightness-110 drop-shadow-md"
        />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-full origin-left animate-[loading_1.5s_infinite_ease-in-out] bg-[#0060FE]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Auth Routes (Redirect to dashboard if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Authenticated routes wrapped in ProtectedRoute -> Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders">
              <Route index element={<Orders />} />
              <Route path=":orderType/:orderID" element={<OrderDetails />} />
            </Route>
            <Route path="/setup" element={<Setup />} />
            <Route path="/search" element={<Search />} />
            {/* Default authenticated route */}
            <Route path="/" element={<Navigate to="/orders" replace />} />

            {/* Fallback route: inside the layout so it doesn't unmount the sidebar on unknown routes */}
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};
