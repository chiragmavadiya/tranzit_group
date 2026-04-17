import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { helpCenterArticles } from '@/features/help-center/constants'

const HelpCenterArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const article = helpCenterArticles.find((entry) => entry.slug === slug)

    if (!article) {
        return <Navigate to="/help-center" replace />
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f9fbfd_0%,#f5f7fb_100%)]">
            <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-5 py-6 lg:px-8">
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
                                    <p className="mt-4 text-lg text-slate-500">{article.subtitle}</p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="h-10 rounded-md border-slate-300 px-4 text-slate-600 hover:bg-slate-50"
                                render={
                                    <Link to="/help-center">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Help Center
                                    </Link>
                                }
                            />
                        </div>

                        <div className="mt-5 border-t border-slate-200 pt-5">
                            <div className="space-y-6">
                                {article.qas.map((qa) => (
                                    <section key={qa.question} className="space-y-4">
                                        <h2 className="text-[17px] font-semibold text-slate-700">
                                            {qa.question}
                                        </h2>
                                        <div className="space-y-4 text-[15px] leading-8 text-slate-600">
                                            {qa.answer.map((paragraph, index) => (
                                                <p key={`${qa.question}-${index}`}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default HelpCenterArticlePage