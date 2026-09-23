import * as Sentry from "@sentry/react";
<<<<<<< HEAD
import axios from "axios";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    beforeSend(event, hint) {
        const e = hint?.originalException;
        if (axios.isCancel?.(e) || (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_CANCELED')) return null;
        if (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_NETWORK' && !navigator.onLine) return null;
        return event;
    },
=======

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    integrations: [
        Sentry.browserTracingIntegration(),
    ],

    environment: import.meta.env.MODE,

    tracesSampleRate: import.meta.env.DEV ? 1 : 1,

    tracePropagationTargets: [
        "localhost",
        import.meta.env.VITE_API_URL,
    ],
});