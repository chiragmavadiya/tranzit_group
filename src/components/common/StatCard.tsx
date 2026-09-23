import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatItem } from "./types/statCard.types";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Link } from "react-router-dom";

function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("border ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 h-full", className)}>
      <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <Skeleton className="h-3 w-16" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}


export const StatCard = memo(({ label, value, icon: Icon, subValue, color, className, contentClassName, iconBg, iconColor, loading = false, link }: StatItem) => {
  if (loading) return <StatCardSkeleton />
  return (
    <Card className={cn("border ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 transition-all duration-300 hover:shadow-lg hover:border-primary/50 h-full", className)}>
      <CardContent className={cn("py-3 px-5 flex flex-col justify-between h-full gap-2", contentClassName)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wide leading-tight mb-1">
              {label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900 dark:text-white">
                {value}
              </span>
              {subValue && (
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase">
                  {subValue}
                </span>
              )}
            </div>
          </div>
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
            color || "bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400",
            iconBg
          )}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>

        {link && (
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
            <Link
              to={link.path}
              className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group/link transition-colors"
            >
              <span>{link.text}</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
})


