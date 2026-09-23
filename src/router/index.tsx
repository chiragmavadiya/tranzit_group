import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import PublicRoute from '@/router/PublicRoute';
import brandLogo from '@/assets/Tranzit_Logo.svg';
import brandLogoDark from '@/assets/Tranzit_Logo_dark.svg';
import { useTheme } from '@/app/providers/theme-provider';
import AdminRoutes from '@/apps/admin/routes/AdminRoutes';
import ClientRoutes from '@/apps/client/routes/ClientRoutes';
import { useAppDispatch, useAppSelector } from '@/hooks/store.hooks';
import { useGetUserDetails } from '@/features/auth/hooks/useAuth';
import { setUser, normalizeRole } from '@/features/auth/authSlice';
import SubscriptionPlanModal from '@/features/customer-settings/components/SubscriptionPlanModal';
import AcceptTermsModal from '@/features/auth/components/AcceptTermsModal';
import AccountUnderReviewModal from '@/features/auth/components/AccountUnderReviewModal';
import ShopifyParcelDefaultsModal from '@/features/integrations/components/ShopifyParcelDefaultsModal';
import { hasPendingParcelDefaults } from '@/features/integrations/utils';
import ChangePassword from '@/features/auth/pages/ChangePassword';
import ShopifyLinkPage from '@/features/shopifyLink';
import ShopifyAutoLoginPage from '@/features/shopifyAutoLogin';
import { showToast } from '@/components/ui/custom-toast';
import { isRedirectExemptPath } from '@/constants';
import * as Sentry from "@sentry/react";
import PageViewTracker from '@/analytics/PageViewTracker';
import { setAnalyticsUser } from '@/analytics';
import { identifyUser } from '@/lib/clarity';


// Lazy load page components
const SignIn = lazy(() => import('@/features/auth/pages/SignIn'));
const SignUp = lazy(() => import('@/features/auth/pages/SignUp'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('@/features/auth/pages/VerifyEmail'));
const OnboardingPage = lazy(() => import('@/features/setup/pages/OnboardingPage'));
const TermsAndConditions = lazy(() => import('@/features/auth/pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('@/features/auth/pages/PrivacyPolicy'));
const DangerousGoods = lazy(() => import('@/features/auth/pages/DangerousGoods'));
const PublicTrackingPage = lazy(() => import('@/features/tracking/pages/PublicTrackingPage'));

/** /track/ABC123 -> /track?tracking_number=ABC123 */
const LegacyTrackRedirect = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const search = trackingNumber
    ? `?${new URLSearchParams({ tracking_number: trackingNumber })}`
    : '';
  return <Navigate to={`/track${search}`} replace />;
};


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
  const { isAuthenticated, userID, token, next_step, role } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // Fetch user details if authenticated
  const { data: userData, isLoading, isPending, isError, refetch } = useGetUserDetails(isAuthenticated);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Blocking modals are shown one at a time, highest priority first:
  // Shopify parcel details -> Terms and Conditions -> low balance (that last one lives in Layout).
  // All of them are derived straight from the ME response, so none can flash before it resolves,
  // and the public legal pages stay reachable since the Terms modal links out to the full document.
  const onBlockablePage = role === 'customer' && !isRedirectExemptPath(location.pathname);

  // Approval outranks every blocking modal: an unapproved customer never reaches the routes
  // below, so no portal page is mounted and none of their queries can fire. Approval is only
  // granted on an explicit `true` — a missing or null flag keeps the account blocked.
  const accountUnderReview =
    isAuthenticated &&
    onBlockablePage &&
    !location.pathname.includes('/on-board') &&
    !!userData &&
    userData.account_activation !== true;

  // A connected Shopify store without default parcel details can't have its orders shipped.
  const parcelDefaultsPending = role === 'customer' && hasPendingParcelDefaults(userData);
  const storesMissingParcelDefaults = userData?.shopify_package_defaults?.stores_missing_defaults ?? [];
  // The modal steps aside on a Shopify store's own settings page, which is where the details are filled in.
  // The `?configure=` form is the older deep link, kept so an in-flight one still works.
  const isConfiguringShopify =
    /^\/settings\/ecommerce\/shopify\/[^/]+$/.test(location.pathname) ||
    (location.pathname === '/settings/ecommerce' &&
      new URLSearchParams(location.search).get('configure') === 'shopify');

  const mustSetParcelDefaults = onBlockablePage && parcelDefaultsPending && !isConfiguringShopify;

  // Held back while parcel details are pending, including while that drawer is open.
  const mustAcceptTerms = onBlockablePage && !!userData?.must_accept_terms && !parcelDefaultsPending;

  // Sync user details to Redux when query data updates
  useEffect(() => {
    if (userData?.user && !isPending) {
      const add = userData?.address_detail ? [userData.address_detail.default, userData.address_detail.billing] : []
      Sentry.setUser({
        id: userData?.user.id,
        email: userData?.user.email,
        username: `${userData?.user.first_name} ${userData?.user.last_name}`,
      });
      dispatch(setUser({
        user: { ...userData.user, addresses: add },
        next_step: userData.next_step,
        default_courier: userData.default_courier,
        default_item: userData.default_item,
        team_access: userData.team_access,
        courier_settings: userData.courier,
        blackout_days: userData.blackout_days || []
      }));

      // Set user ID in Google Analytics for tracking
      setAnalyticsUser(userData.user.id);



      // Held back while the blocking Terms modal is up, so it can't stack on top of it
      if (userData.next_step === 'purchase_plan' && normalizeRole(userData.user.role) !== 'admin' && !userData.must_accept_terms) {
        setShowSubscriptionModal(true);
      }
    }
  }, [userData, isPending, dispatch]);

  // Clarity attributes a recording to the identity asserted on that page, so it has to be
  // re-sent on every route change — sending it once per session only tags the entry page.
  useEffect(() => {
    if (!userData?.user?.id) return;
    identifyUser(
      userData.user.id.toString(),
      `${userData.user.first_name} ${userData.user.last_name}`,
    );
  }, [userData, location.pathname]);

  // Handle redirects based on next_step state and location.pathname
  useEffect(() => {
    if (isAuthenticated && !isRedirectExemptPath(location.pathname)) {
      if ((next_step === 'onboarding' || next_step === 'verify_email') && !location.pathname.includes('/on-board')) {
        navigate('/on-board/' + userID + '/' + token);
      } else if (next_step === 'change_password') {
        navigate(`/change-password`, { replace: true })
      } else if (next_step === 'dashboard' && location.pathname.includes('/on-board')) {
        navigate('/orders?tab=new');
      }
    }
  }, [next_step, location.pathname, isAuthenticated, userID, token, navigate]);

  if (isError && !location.pathname.includes('/on-board')) {
    const logoSrc = theme === 'dark' ? brandLogoDark : brandLogo;
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-6">
        <div className="flex flex-col items-center gap-6 max-w-md w-full p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center gap-2 mb-2">
            <img
              src={logoSrc}
              alt="Tranzit Group"
              className="h-16 w-auto object-contain"
            />
            <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
              Tranzit Group
            </span>
          </div>

          <hr className="w-full border-slate-100 dark:border-zinc-800 my-0.5" />

          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="rounded-full bg-red-50 dark:bg-red-950/20 p-3.5 text-red-500 dark:text-red-400 ring-4 ring-red-50 dark:ring-red-950/10">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">Connection Error</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              We couldn't retrieve your user details. This could be due to a temporary server issue or network problem.
            </p>
          </div>

          <div className="flex gap-3 mt-6 w-full">
            <button
              onClick={() => refetch()}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="flex-1 rounded-lg border border-slate-200 dark:border-zinc-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !location.pathname.includes('/on-board')) return <PageLoader />;
  if (accountUnderReview) return <AccountUnderReviewModal businessName={userData?.address_detail?.default?.company_name || ''} />;

  return (
    <Suspense fallback={<PageLoader />}>
      <PageViewTracker />
      <Routes>
        {/* Public Auth Routes (Redirect to dashboard if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/admin/login" element={<SignIn role="admin" />} />
          <Route path="/login" element={<SignIn role="customer" />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
        {/* Recipient-facing tracking: outside PublicRoute so a signed-in user can open it too. */}
        <Route path="/track" element={<PublicTrackingPage />} />
        {/* Links shared before the lookup moved to query parameters. */}
        <Route path="/track/:trackingNumber" element={<LegacyTrackRedirect />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/dangerous-goods" element={<DangerousGoods />} />
        <Route path="/shopify/link" element={<ShopifyLinkPage onToast={showToast} />} />
        <Route path="/shopify/auto-login" element={<ShopifyAutoLoginPage onToast={showToast} />} />
        <Route path="/on-board/:customerId/:token" element={<OnboardingPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
      <SubscriptionPlanModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
      <AcceptTermsModal open={mustAcceptTerms} />
      <ShopifyParcelDefaultsModal open={mustSetParcelDefaults} stores={storesMissingParcelDefaults} />
    </Suspense>
  );
};
