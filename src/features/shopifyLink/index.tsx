import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, getAuthToken } from './client';
import { fetchShopifyLinkInfo, linkShopifyStore, type ShopifyLinkInfoResponse } from './shopify';
import {
    clearPendingShopifyLinkToken,
    resolveShopifyLinkToken,
    savePendingShopifyLinkToken,
} from './shopifiLinkStorage';
import { useTheme } from '@/app/providers/theme-provider';
import brandLogo from '@/assets/Tranzit_Logo.svg';
import brandLogoDark from '@/assets/Tranzit_Logo_dark.svg';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Mail, Store, Link2 } from 'lucide-react';

type Props = {
    onToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'default') => void;
};

/**
* Route: /shopify/link?token=...
*
* Flow after login:
* 1. Login page MUST redirect to ?redirect=/shopify/link?token=...
* 2. This page loads again, sees auth token, POST /api/shopify/link
*/
export default function ShopifyLinkPage({ onToast }: Props) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const token = resolveShopifyLinkToken(searchParams);

    const [info, setInfo] = useState<ShopifyLinkInfoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [linking, setLinking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const completeLink = useCallback(
        async (linkToken: string, fallbackRedirect: string) => {
            setLinking(true);
            setError(null);

            try {
                const result = await linkShopifyStore(linkToken);
                clearPendingShopifyLinkToken();
                onToast?.(result.message, 'success');
                window.location.href = result.redirect_url || fallbackRedirect;
            } catch (err) {
                const msg = err instanceof ApiError ? err.message : 'Failed to link store.';
                setError(msg);
                onToast?.(msg, 'error');
                setLinking(false);
            }
        },
        [onToast],
    );

    useEffect(() => {
        document.title = `Connect Shopify | Tranzit`;
    }, []);

    useEffect(() => {
        if (!token) {
            setError('Missing link token. Please reinstall the app from Shopify.');
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const data = await fetchShopifyLinkInfo(token);
                if (cancelled) {
                    return;
                }
                setInfo(data);

                if (getAuthToken()) {
                    await completeLink(token, data.redirect_after_link);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof ApiError ? err.message : 'Unable to load store link details.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [token, completeLink]);

    function goToLogin() {
        if (token) {
            savePendingShopifyLinkToken(token);
        }
        const redirect = `/shopify/link?token=${encodeURIComponent(token ?? '')}`;
        navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
    }

    function goToRegister() {
        if (token) {
            savePendingShopifyLinkToken(token);
        }
        const redirect = `/shopify/link?token=${encodeURIComponent(token ?? '')}`;
        navigate(`/register?redirect=${encodeURIComponent(redirect)}`);
    }

    if (loading || linking) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 py-8 relative overflow-hidden transition-colors duration-300">
                {/* Decorative background gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

                {/* Tranzit Group Logo above card */}
                <div className="flex flex-col items-center text-center space-y-2 mb-6 animate-in fade-in slide-in-from-top-8 duration-500">
                    <img
                        src={theme === 'dark' ? brandLogoDark : brandLogo}
                        alt="Tranzit Group Logo"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <div className="w-full max-w-[440px] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center gap-6">
                        {/* Connecting Visualizer */}
                        <div className="flex items-center justify-between w-full gap-4 py-6 px-2 relative">
                            {/* Tranzit Logo container */}
                            <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-center p-2 shadow-sm animate-pulse">
                                <img
                                    src={theme === 'dark' ? brandLogoDark : brandLogo}
                                    alt="Tranzit"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            {/* Animated connecting line */}
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="h-[2px] w-full bg-slate-200 dark:bg-zinc-800 rounded-full relative overflow-hidden">
                                    <div
                                        className="absolute top-0 bottom-0 left-0 bg-primary/80"
                                        style={{
                                            width: '40%',
                                            backgroundImage: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                        }}
                                    />
                                </div>
                                <div className="absolute bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1.5 rounded-full shadow-sm flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                </div>
                            </div>

                            {/* Shopify Logo container */}
                            <div className="w-14 h-14 rounded-xl bg-[#96BF48]/10 border border-[#96BF48]/20 flex items-center justify-center p-2.5 shadow-sm animate-pulse delay-75">
                                <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.14 7.5L13.72 1.9C13.43 1.6 13 1.45 12.56 1.45H11.44C11 1.45 10.57 1.6 10.28 1.9L4.86 7.5C4.57 7.79 4.41 8.22 4.41 8.66V20.55C4.41 21.62 5.29 22.5 6.36 22.5H17.64C18.71 22.5 19.59 21.62 19.59 20.55V8.66C19.59 8.22 19.43 7.79 19.14 7.5Z" fill="#96BF48" />
                                    <path d="M12 9.5C9.51 9.5 7.5 7.49 7.5 5C7.5 2.51 9.51 0.5 12 0.5C14.49 0.5 16.5 2.51 16.5 5C16.5 7.49 14.49 9.5 12 9.5ZM12 2.3C10.51 2.3 9.3 3.51 9.3 5C9.3 6.49 10.51 7.7 12 7.7C13.49 7.7 14.7 6.49 14.7 5C14.7 3.51 13.49 2.3 12 2.3Z" fill="#FFF" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 my-0">
                                {linking ? 'Linking your Shopify store...' : 'Connecting to Shopify...'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-[280px] mx-auto leading-relaxed my-0">
                                {linking
                                    ? 'Fulfilling secure connection and syncing settings. Please do not close this window.'
                                    : 'Fetching Shopify credentials and verification parameters.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !info) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 py-8 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

                {/* Tranzit Group Logo above card */}
                <div className="flex flex-col items-center text-center space-y-2 mb-6 animate-in fade-in slide-in-from-top-8 duration-500">
                    <img
                        src={theme === 'dark' ? brandLogoDark : brandLogo}
                        alt="Tranzit Group Logo"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <div className="w-full max-w-[440px] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center gap-6">
                        {/* Error Alert Badge */}
                        <div className="rounded-full bg-red-50 dark:bg-red-950/20 p-3.5 text-red-500 dark:text-red-400 ring-4 ring-red-50 dark:ring-red-950/10">
                            <AlertCircle className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 my-0">Shopify Connection Failed</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed my-0">
                                {error}
                            </p>
                        </div>

                        <Button
                            type="button"
                            className="w-full"
                            onClick={goToLogin}
                        >
                            Back to Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!info || !token) {
        return null;
    }

    const isAuthenticated = Boolean(getAuthToken());

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 py-8 relative overflow-hidden transition-colors duration-300">
            {/* Decorative background gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

            {/* Tranzit Group Logo above card */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6 animate-in fade-in slide-in-from-top-8 duration-500">
                <img
                    src={theme === 'dark' ? brandLogoDark : brandLogo}
                    alt="Tranzit Group Logo"
                    className="h-16 w-auto object-contain"
                />
            </div>

            <div className="w-full max-w-[440px] bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl shadow-xl p-6 md:p-8 text-center animate-in fade-in zoom-in-95 duration-300">

                {/* Connecting Visualizer */}
                <div className="flex items-center justify-between w-full gap-4 py-4 px-2 relative mb-2">
                    {/* Tranzit Logo container */}
                    <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-center p-2 shadow-sm hover:scale-105 transition-transform">
                        <img
                            src={theme === 'dark' ? brandLogoDark : brandLogo}
                            alt="Tranzit"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    {/* Dotted connecting line */}
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="h-[2px] w-full bg-slate-200 dark:bg-zinc-800 rounded-full relative overflow-hidden">
                            <div
                                className="absolute top-0 bottom-0 left-0 bg-primary/80"
                                style={{
                                    width: '100%',
                                    backgroundImage: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                                    animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }}
                            />
                        </div>
                        <div className="absolute bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1.5 rounded-full shadow-sm flex items-center justify-center">
                            <Link2 className="w-4.5 h-4.5 text-slate-400 dark:text-zinc-500" />
                        </div>
                    </div>

                    {/* Shopify Logo container */}
                    <div className="w-14 h-14 rounded-xl bg-[#96BF48]/10 border border-[#96BF48]/20 flex items-center justify-center p-2.5 shadow-sm hover:scale-105 transition-transform">
                        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.14 7.5L13.72 1.9C13.43 1.6 13 1.45 12.56 1.45H11.44C11 1.45 10.57 1.6 10.28 1.9L4.86 7.5C4.57 7.79 4.41 8.22 4.41 8.66V20.55C4.41 21.62 5.29 22.5 6.36 22.5H17.64C18.71 22.5 19.59 21.62 19.59 20.55V8.66C19.59 8.22 19.43 7.79 19.14 7.5Z" fill="#96BF48" />
                            <path d="M12 9.5C9.51 9.5 7.5 7.49 7.5 5C7.5 2.51 9.51 0.5 12 0.5C14.49 0.5 16.5 2.51 16.5 5C16.5 7.49 14.49 9.5 12 9.5ZM12 2.3C10.51 2.3 9.3 3.51 9.3 5C9.3 6.49 10.51 7.7 12 7.7C13.49 7.7 14.7 6.49 14.7 5C14.7 3.51 13.49 2.3 12 2.3Z" fill="#FFF" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight my-0 mb-2 mt-4 text-center border-none">
                    Connect Shopify to Tranzit
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-center max-w-[320px] mx-auto">
                    {info.message}
                </p>

                {/* Info Card Container */}
                <div className="w-full bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/60 rounded-xl p-4.5 space-y-3.5 mb-6 text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
                            <Store className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide my-0 leading-none mb-1">Shopify Store</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate my-0 leading-normal">
                                {info.shop_name ?? info.shop}
                            </p>
                        </div>
                    </div>

                    {info.shop_owner_email && (
                        <div className="flex items-center gap-3 border-t border-slate-200/50 dark:border-zinc-800/40 pt-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide my-0 leading-none mb-1">Owner Email</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate my-0 leading-normal">
                                    {info.shop_owner_email}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg p-3 text-sm mb-6 text-left">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        <p className="my-0 leading-relaxed font-medium">{error}</p>
                    </div>
                )}

                {/* Actions */}
                {!isAuthenticated && (
                    <div className="flex flex-col gap-2.5 w-full">
                        <Button
                            type="button"
                            className="w-full font-bold shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
                            onClick={goToLogin}
                        >
                            Log in to link store
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full font-bold active:scale-[0.98] transition-all"
                            onClick={goToRegister}
                        >
                            Create account
                        </Button>
                    </div>
                )}

                {isAuthenticated && (
                    <Button
                        type="button"
                        disabled={linking}
                        className="w-full font-bold shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
                        onClick={() => completeLink(token, info.redirect_after_link)}
                    >
                        {linking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Link store to my account
                    </Button>
                )}

                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 text-center mt-6 mb-0">
                    Already linked?{' '}
                    <button
                        type="button"
                        className="font-bold text-primary hover:underline underline-offset-4 outline-none cursor-pointer bg-transparent border-none p-0 inline"
                        onClick={() => navigate('/settings/ecommerce')}
                    >
                        Go to integrations
                    </button>
                </p>
            </div>
        </div>
    );
}
