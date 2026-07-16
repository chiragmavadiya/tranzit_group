import { Skeleton } from "@/components/ui/skeleton";

export const ClientDashboardSkeleton = () => {
    return (
        <div className="p-page-padding space-y-4 overflow-y-auto animate-in fade-in duration-500">
            {/* Welcome Banner Skeleton */}
            <div className="relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-cyan-900/5 border-blue-100/50 dark:border-blue-900/20 shadow-xl">
                {/* Animated Background Elements matching the actual banner */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-4 left-4 w-20 h-20 bg-blue-200/20 dark:bg-blue-500/5 rounded-full animate-pulse"></div>
                    <div className="absolute top-4 right-16 w-12 h-12 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-8 left-1/4 w-16 h-16 bg-cyan-200/20 dark:bg-cyan-500/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-4 right-8 w-8 h-8 bg-purple-200/30 dark:bg-purple-500/10 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-64 md:w-80 bg-slate-200 dark:bg-zinc-800" /> {/* Welcome title */}
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-slate-200 dark:bg-zinc-800 rounded-full"></div>
                                <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-zinc-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full max-w-[550px] bg-slate-200 dark:bg-zinc-800" />
                            <Skeleton className="h-4 w-5/6 max-w-[550px] bg-slate-200 dark:bg-zinc-800" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Skeleton className="h-10 w-32 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                            <Skeleton className="h-10 w-28 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center md:items-end gap-6">
                        <div className="w-24 h-24 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 rounded-2xl flex items-center justify-center">
                            <Skeleton className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-zinc-800" />
                        </div>
                        <div className="flex gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800/50">
                                    <Skeleton className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-zinc-800" />
                                        <Skeleton className="h-4 w-12 bg-slate-200 dark:bg-zinc-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Columns Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                {/* Left Column (Recent Orders table) */}
                <div className="xl:col-span-8">
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm h-[515px] flex flex-col">
                        {/* Table Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-zinc-800">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32 bg-slate-100 dark:bg-zinc-900" />
                                <Skeleton className="h-3.5 w-16 bg-slate-100 dark:bg-zinc-900" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-12 bg-slate-100 dark:bg-zinc-900" />
                                <Skeleton className="h-8 w-44 bg-slate-100 dark:bg-zinc-900" />
                                <Skeleton className="h-8 w-20 bg-slate-100 dark:bg-zinc-900" />
                            </div>
                        </div>
                        {/* Table Rows */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                                    <Skeleton className="h-4 w-24 bg-slate-100 dark:bg-zinc-900" />
                                    <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-zinc-900" />
                                    <Skeleton className="h-4 w-16 bg-slate-100 dark:bg-zinc-900" />
                                    <Skeleton className="h-5 w-16 rounded-full bg-slate-100 dark:bg-zinc-900" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Transactions list) */}
                <div className="xl:col-span-4">
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm h-[515px] flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-transparent">
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-36 bg-slate-100 dark:bg-zinc-900" />
                                <Skeleton className="h-3.5 w-24 bg-slate-100 dark:bg-zinc-900" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full bg-slate-100 dark:bg-zinc-900" />
                        </div>
                        {/* Rows */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center py-1">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900" />
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-4 w-28 bg-slate-100 dark:bg-zinc-900" />
                                            <Skeleton className="h-3.5 w-20 bg-slate-100 dark:bg-zinc-900" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-14 bg-slate-100 dark:bg-zinc-900" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};