import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHelpArticleDetails } from '../hooks/useHelpCenter'

const HelpCenterArticlePage: React.FC = () => {
    console.log('HelpCenter artical page render...')
    const { slug } = useParams<{ slug: string }>()
    const { data, isLoading } = useHelpArticleDetails(slug || '')

    if (!isLoading && (!data || !data.status)) {
        return <Navigate to="/help-center" replace />
    }

    const article = data?.data

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto px-6 py-8 lg:px-10 lg:py-12">
                {isLoading ? (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-7 w-24 rounded-full" />
                            <Skeleton className="h-10 w-3/4 sm:h-12" />
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-5/6" />
                            </div>
                            <Skeleton className="h-4 w-40 pt-2" />
                        </div>

                        <div className="border-t border-slate-200 dark:border-zinc-800 pt-8 space-y-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
                            ))}
                        </div>
                    </div>
                ) : article ? (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1">
                                {article.category}
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-4xl md:text-5xl">
                                {article.title}
                            </h1>
                            {article.short_description && (
                                <p className="text-xl text-slate-600 dark:text-zinc-400 leading-relaxed">
                                    {article.short_description}
                                </p>
                            )}
                            <div className="flex items-center gap-4 pt-2 text-sm text-slate-500 dark:text-zinc-500">
                                <span>Updated {new Date(article.updated).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-zinc-800 pt-8">
                            <article
                                className="prose prose-slate lg:prose-lg max-w-none dark:prose-invert 
                                prose-headings:font-bold prose-headings:tracking-tight
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-2xl prose-img:shadow-lg
                                rich-text-content"
                                dangerouslySetInnerHTML={{ __html: article.content || '' }}
                            />
                        </div>

                        <div className="mt-16 rounded-2xl bg-slate-100 dark:bg-zinc-900 p-8 text-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Was this article helpful?</h3>
                            <div className="mt-4 flex justify-center gap-4">
                                <Button variant="outline" className="rounded-full px-6">Yes</Button>
                                <Button variant="outline" className="rounded-full px-6">No</Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default HelpCenterArticlePage