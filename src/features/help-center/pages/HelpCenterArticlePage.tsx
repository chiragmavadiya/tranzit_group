import React from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useHelpArticleDetails } from '../hooks/useHelpCenter'

const HelpCenterArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const { data, isLoading } = useHelpArticleDetails(slug || '')

    if (!isLoading && (!data || !data.status)) {
        return <Navigate to="/help-center" replace />
    }

    const article = data?.data

    return (
        <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f9fbfd_0%,#f5f7fb_100%)]">
            <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-5 py-6 lg:px-8">
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : article ? (
                    <>
                        <div className="text-[18px] text-slate-500">
                            Support / <span className="text-slate-500">Help Center</span> /{' '}
                            <span className="font-semibold text-slate-700">{article.title}</span>
                        </div>

                        <Card className="rounded-3xl border-slate-200/80 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)]">
                            <CardContent className="px-5 py-5 sm:px-7 sm:py-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-4">
                                        <Badge className="h-7 rounded-md bg-slate-200 px-3 text-slate-700 hover:bg-slate-200">
                                            {article.category}
                                        </Badge>
                                        <div>
                                            <h1 className="text-4xl font-semibold tracking-tight text-slate-700">
                                                {article.title}
                                            </h1>
                                            {article.short_description && (
                                                <p className="mt-4 text-lg text-slate-500">
                                                    {article.short_description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Link to="/help-center">
                                        <Button
                                            variant="outline"
                                            className="h-10 rounded-md border-slate-300 px-4 text-slate-600 hover:bg-slate-50"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-5 border-t border-slate-200 pt-5">
                                    <div 
                                        className="prose prose-slate max-w-none dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: article.content || '' }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default HelpCenterArticlePage