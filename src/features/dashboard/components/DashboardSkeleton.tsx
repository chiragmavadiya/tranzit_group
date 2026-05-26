import { Skeleton } from "@/components/ui/skeleton";

export const ClientDashboardSkeleton = () => {
    return (
        <div className="p-page-padding space-y-4 overflow-y-auto animate-in fade-in duration-500">
            {/* Welcome Banner Skeleton */}
            <div className="relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-cyan-50/30 dark:from-blue-900/5 dark:via-indigo-900/5 dark:to-cyan-900/5 border-blue-100/20 dark:border-blue-900/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-9 w-64 md:w-80" /> {/* Welcome title */}
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full max-w-xl" />
                            <Skeleton className="h-4 w-5/6 max-w-xl" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Skeleton className="h-10 w-32 rounded-lg" />
                            <Skeleton className="h-10 w-28 rounded-lg" />
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center md:items-end gap-6">
                        <Skeleton className="w-24 h-24 rounded-2xl" /> {/* Box Graphic placeholder */}
                        <div className="flex gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2.5 px-4 py-2 rounded-2xl border border-white/20 dark:border-zinc-800/50">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-12" />
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
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
                        {/* Table Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-zinc-800">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3.5 w-16" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-12" />
                                <Skeleton className="h-8 w-44" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </div>
                        {/* Table Rows */}
                        <div className="p-4 space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Transactions list) */}
                <div className="xl:col-span-4">
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-zinc-800">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-36" />
                                <Skeleton className="h-3.5 w-24" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        {/* Rows */}
                        <div className="p-4 space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-xl" />
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-3.5 w-20" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-14" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};