import React, { useState } from 'react'
import { ChevronRight, Search, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useHelpCenterArticles } from '../hooks/useHelpCenter'

const HelpCenterPage: React.FC = () => {
    const [query, setQuery] = useState('')
    const { data, isLoading } = useHelpCenterArticles(query)

    const categories = data?.data || []

    return (
        <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f9fbfd_0%,#f5f7fb_100%)]">
            <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-5 py-6 lg:px-8">
                <div className="text-[18px] text-slate-500">
                    Support / <span className="font-semibold text-slate-700">Help Center</span>
                </div>

                <Card className="rounded-3xl border-slate-200/80 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)]">
                    <CardContent className="px-6 py-8 sm:px-10 sm:py-10">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-700">
                                How can we help?
                            </h1>
                            <p className="mt-3 text-[15px] text-slate-500">
                                Search for articles or browse by category
                            </p>
                            <div className="mx-auto mt-6 max-w-xl">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search help articles"
                                        className="h-12 rounded-2xl border-slate-300 bg-white pl-11 text-sm shadow-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {categories.map((category, idx) => (
                                <Card
                                    key={idx}
                                    className="overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3">
                                        <h2 className="text-[15px] font-semibold text-slate-700">
                                            {category.category || 'Uncategorized'}
                                        </h2>
                                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-100 px-2 text-xs font-semibold text-slate-500">
                                            {category.articles.length}
                                        </span>
                                    </div>

                                    <div className="divide-y divide-slate-200/80">
                                        {category.articles.map((article) => (
                                            <Link
                                                key={article.slug}
                                                to={`/help-center/${article.slug}`}
                                                className="flex items-center justify-between gap-3 px-4 py-4 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                            >
                                                <span>{article.title}</span>
                                                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {categories.length === 0 ? (
                            <Card className="rounded-2xl border-dashed border-slate-300 bg-white/80 shadow-none">
                                <CardContent className="px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-600">No help articles found.</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Try a different keyword or browse the available categories.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    )
}

export default HelpCenterPage