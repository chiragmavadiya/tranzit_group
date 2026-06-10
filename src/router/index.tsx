import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import PublicRoute from '@/router/PublicRoute';
import brandLogo from '@/assets/Tranzit_Logo.svg';
import AdminRoutes from '@/apps/admin/routes/AdminRoutes';
import ClientRoutes from '@/apps/client/routes/ClientRoutes';
import { useAppDispatch, useAppSelector } from '@/hooks/store.hooks';
import { useGetUserDetails } from '@/features/auth/hooks/useAuth';
import { setUser } from '@/features/auth/authSlice';
import SubscriptionPlanModal from '@/features/customer-settings/components/SubscriptionPlanModal';

// Lazy load page components
const SignIn = lazy(() => import('@/features/auth/pages/SignIn'));
const SignUp = lazy(() => import('@/features/auth/pages/SignUp'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('@/features/auth/pages/VerifyEmail'));
const OnboardingPage = lazy(() => import('@/features/setup/pages/OnboardingPage'));


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
            <div className="h-full w-full origin-left animate-[loading_1.5s_infinite_ease-in-out] bg-primary"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AppRouter = () => {
  console.log("render APP ROUTER...")
  const { isAuthenticated, userID, token, next_step } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user details if authenticated
  const { data: userData, isLoading, isPending } = useGetUserDetails(isAuthenticated);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Sync user details to Redux when query data updates
  useEffect(() => {
    if (userData?.user && !isPending) {
      dispatch(setUser({
        user: userData.user,
        next_step: userData.next_step,
        default_courier: userData.default_courier,
        default_item: userData.default_item
      }));
      if (userData.next_step === 'purchase_plan' && userData.user.roles[0]?.name !== 'admin') {
        setShowSubscriptionModal(true);
      }
    }
  }, [userData, isPending, dispatch]);

  // Handle redirects based on next_step state and location.pathname
  useEffect(() => {
    if (isAuthenticated) {
      if ((next_step === 'onboarding' || next_step === 'verify_email') && !location.pathname.includes('/on-board')) {
        navigate('/on-board/' + userID + '/' + token);
      } else if (next_step === 'dashboard' && location.pathname.includes('/on-board')) {
        navigate('/orders?tab=new');
      }
    }
  }, [next_step, location.pathname, isAuthenticated, userID, token, navigate]);

  if (isLoading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Auth Routes (Redirect to dashboard if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/admin/login" element={<SignIn role="admin" />} />
          <Route path="/login" element={<SignIn role="customer" />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
        <Route path="/on-board/:customerId/:token" element={<OnboardingPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
      <SubscriptionPlanModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </Suspense>
  );
};
