import React, { Suspense, useEffect, useMemo } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Loader2, Settings2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import SettingsSidebar from './SettingsSidebar';

const SettingsLayout: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { data: response, isLoading } = useSettings();

    const categories = useMemo(() => response?.data || [], [response]);

    useEffect(() => {
        // Redirect to first category if we are at the root settings path and categories are loaded
        if (!isLoading && categories.length > 0) {
            if (location.pathname === '/admin/settings' || location.pathname === '/admin/settings/') {
                navigate(`/admin/settings/${categories[0].slug}`, { replace: true });
            }
        }
    }, [location.pathname, navigate, isLoading, categories]);

    const currentCategory = React.useMemo(() =>
        categories.find(c => c.slug === categoryId), [categories, categoryId]);

    return (
        <div className="flex h-full flex-col overflow-hidden bg-slate-50/30 dark:bg-zinc-950">
            {/* Header / Breadcrumbs */}
            <div className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-6 py-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                            <Settings2 className="h-3.5 w-3.5" />
                            <span>System Settings</span>
                        </div>
                        {currentCategory && (
                            <>
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="font-medium text-slate-700 dark:text-zinc-100">
                                    {currentCategory.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <SettingsSidebar categories={categories} isLoading={isLoading} />
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <Suspense
                        fallback={
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="animate-spin text-blue-400 h-10 w-10" />
                            </div>
                        }
                    >
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default SettingsLayout;
