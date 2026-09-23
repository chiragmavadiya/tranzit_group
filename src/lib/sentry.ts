import * as Sentry from "@sentry/react";
import axios from "axios";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    beforeSend(event, hint) {
        const e = hint?.originalException;
        if (axios.isCancel?.(e) || (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_CANCELED')) return null;
        if (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_NETWORK' && !navigator.onLine) return null;
        return event;
    },
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