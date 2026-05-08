import React, { Suspense } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useHelpCenterArticles } from '../hooks/useHelpCenter'
import HelpCenterSidebar from './HelpCenterSidebar'

const HelpCenterLayout: React.FC = () => {
    console.log('HelpCenterLayout render...')
    const { slug } = useParams<{ slug: string }>()
    const { data, isLoading } = useHelpCenterArticles('')

    const categories = React.useMemo(() => data?.data || [], [data])

    // Find current article title for breadcrumb
    const currentArticle = React.useMemo(() => categories
        .flatMap(cat => cat.articles)
        .find(art => art.slug === slug), [categories, slug])

    return (
        <div className="flex h-full flex-col overflow-hidden bg-slate-50/30 dark:bg-zinc-950">
            {/* Help Center Header & Breadcrumbs */}
            <div className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-6 py-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                        <Link
                            to="/help-center"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <Home className="h-3.5 w-3.5" />
                            <span>Help Center</span>
                        </Link>
                        {currentArticle && (
                            <>
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="font-medium text-slate-700 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-md">
                                    {currentArticle.title}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <HelpCenterSidebar categories={categories} isLoading={isLoading} />
                <main className="flex-1 overflow-y-auto">
                    <Suspense
                        fallback={
                            <div className="flex h-full items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                                        Loading article...
                                    </p>
                                </div>
                            </div>
                        }
                    >
                        <Outlet context={{ categories, isLoading }} />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

export default HelpCenterLayout
