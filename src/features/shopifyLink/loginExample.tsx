/**
* EXAMPLE — merge this into your real Login page.
* The redirect param is REQUIRED for Shopify link flow after login.
*/

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest, setAuthToken } from './client';
import { useLoginRedirectHandler } from './Loginredirechandler';

type LoginResponse = {
    status: boolean;
    message: string;
    token?: string;
    user?: unknown;
};

export default function LoginPageExample({ onToast }: { onToast?: (m: string, t?: string) => void }) {
    const [searchParams] = useSearchParams();
    const { redirectAfterLogin } = useLoginRedirectHandler(onToast);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await apiRequest<LoginResponse>('/customer/auth/login', {
                method: 'POST',
                body: { email, password },
            });

            if (!res.status || !res.token) {
                onToast?.(res.message || 'Login failed', 'error');
                return;
            }

            // ⚠️ Use the SAME key as getAuthToken() in api/client.ts
            setAuthToken(res.token);

            // ⚠️ CRITICAL: return to /shopify/link?token=... — do NOT go to /orders or /dashboard first
            if (redirectAfterLogin()) {
                return;
            }

            // Optional: also honour redirect from session if query was stripped
            const pending = sessionStorage.getItem('shopify_pending_link_token');
            if (pending) {
                window.location.href = `/shopify/link?token=${encodeURIComponent(pending)}`;
                return;
            }

            window.location.href = '/dashboard';
        } catch {
            onToast?.('Login failed', 'error');
        } finally {
            setSubmitting(false);
        }
    }

    // Show where user will go after login (debug / UX)
    const redirectTarget = searchParams.get('redirect');

    return (
        <form onSubmit={handleSubmit}>
            {redirectTarget && (
                <p className="muted">After login you will return to link your Shopify store.</p>
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={submitting}>
                Log in
            </button>
        </form>
    );
}