import ReactGA from "react-ga4";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initializeAnalytics = () => {
  if (!measurementId) {
    if (import.meta.env.DEV) {
      console.log("Google Analytics Measurement ID is missing. Analytics tracking is disabled in development.");
    } else {
      console.warn("Google Analytics Measurement ID is missing. Analytics will not be initialized.");
    }
    return;
  }

  ReactGA.initialize(measurementId, {
    gtagOptions: {
      send_page_view: false, // Prevents automatic initial pageview tracking to avoid duplicates
    },
  });
};

/**
 * Tracks a pageview safely, checking if GA is initialized.
 */
export const trackPageView = (page: string, title?: string) => {
  if (!ReactGA.isInitialized) return;
  ReactGA.send({
    hitType: "pageview",
    page,
    title: title || document.title,
  });
};

interface EventParams {
  category: string;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Tracks a custom event safely, checking if GA is initialized.
 */
export const trackEvent = ({ category, action, label, value, ...rest }: EventParams) => {
  if (!ReactGA.isInitialized) return;
  ReactGA.event({
    category,
    action,
    label,
    value,
    ...rest,
  });
};

/**
 * Sets the user identity in Google Analytics for all subsequent events/pageviews.
 */
export const setAnalyticsUser = (userId: string | number | null) => {
  if (!ReactGA.isInitialized) return;
  if (userId) {
    ReactGA.set({ userId: String(userId) });
  } else {
    ReactGA.set({ userId: undefined });
  }
};

/**
 * Tracks a user login custom event.
 */
export const trackLogin = (userId: string | number, email: string, role: string) => {
  if (!ReactGA.isInitialized) return;

  // Set the user identity
  setAnalyticsUser(userId);

  // Track the standard login event
  ReactGA.event("login", {
    method: "Email",
    user_id: String(userId),
    email,
    role,
  });
};

/**
 * Tracks a user logout custom event.
 */
export const trackLogout = (userId?: string | number | null, email?: string) => {
  if (!ReactGA.isInitialized) return;

  // Track the logout event before clearing identity
  ReactGA.event("logout", {
    ...(userId && { user_id: String(userId) }),
    ...(email && { email }),
  });

  // Clear the user identity
  setAnalyticsUser(null);
};