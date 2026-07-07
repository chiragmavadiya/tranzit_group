import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

    integrations: [
        Sentry.browserTracingIntegration(),
    ],

    environment: import.meta.env.MODE,

    tracesSampleRate: import.meta.env.DEV ? 0.1 : 1,

    tracePropagationTargets: [
        "localhost",
        import.meta.env.VITE_API_URL,
    ],
});