import { Card, CardContent } from "@/components/ui/card";
import type { StatItem } from "../types";
import { cn } from "@/lib/utils";

interface StatCardProps extends StatItem {
  className?: string;
}

export function StatCard({ label, value, icon: Icon, subValue, color, className }: StatCardProps) {
  return (
    <Card className={cn("border ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 transition-colors duration-300", className)}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          color || "bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest leading-tight">
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {value}
            </span>
            {subValue && (
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase">
                {subValue}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
