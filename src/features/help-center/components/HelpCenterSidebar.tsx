import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, FileText } from 'lucide-react'
import type { HelpCenterCategory } from '../types'
import { cn } from '@/lib/utils'

interface HelpCenterSidebarProps {
    categories: HelpCenterCategory[]
    isLoading: boolean
}

const HelpCenterSidebar: React.FC<HelpCenterSidebarProps> = ({ categories, isLoading }) => {
    const { slug } = useParams<{ slug: string }>()

    if (isLoading) {
        return (
            <div className="w-72 max-w-1/4 border-r border-slate-200 dark:border-zinc-800 p-4 space-y-4 hidden lg:block">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-24 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />
                        <div className="h-8 w-full bg-slate-50 dark:bg-zinc-900 rounded animate-pulse" />
                        <div className="h-8 w-full bg-slate-50 dark:bg-zinc-900 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="w-72 max-w-1/4 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto lg:block">
            <div className="p-4 space-y-6">
                {categories.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                            {category.category || 'General'}
                        </h3>
                        <div className="space-y-1">
                            {category.articles.map((article) => (
                                <Link
                                    key={article.slug}
                                    to={`/help-center/${article.slug}`}
                                    className={cn(
                                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                                        slug === article.slug
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                                    )}
                                >
                                    <FileText className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{article.title}</span>
                                    {slug === article.slug && (
                                        <ChevronRight className="ml-auto h-3 w-3" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HelpCenterSidebar
