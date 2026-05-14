import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransactionMetrics } from "../types";
import { Wallet, Plus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownCustomMenu
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { format } from "date-fns";

interface TransactionListProps {
  // metrics: AdminMetrics | CustomerMetrics;
  className?: string;
  transactions: TransactionMetrics;
  loading?: boolean;
}

const periodsKey = {
  last28Days: 'Last 28 days',
  lastMonth: 'Last month',
  lastYear: 'Last year'
} as const;

const countKeys = {
  last28Days: 'last28DaysCount',
  lastMonth: 'lastMonthOrderCount',
  lastYear: 'lastYearCount'
} as const;
const TransactionListSkeleton = () => (
  <div className="space-y-1">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center justify-between p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16 opacity-70" />
          </div>
        </div>
        <Skeleton className="h-4 w-14" />
      </div>
    ))}
  </div>
);


export function TransactionList({ transactions, className, loading }: TransactionListProps) {
  const [activePeriod, setActivePeriod] = useState<keyof typeof periodsKey>('last28Days');
  // The error occurs because CustomerMetrics might not have these properties directly.
  // We use type assertion to tell TypeScript that we expect these arrays to exist 
  // on the object we're currently processing.
  const currentTransactions = (transactions as any)?.[activePeriod.toLowerCase() as keyof typeof transactions] || [];
  const currentCount = (transactions as any)?.[countKeys[activePeriod]] || currentTransactions.length || 0;

  const formattedDate = (date: string) => format(
    new Date(date),
    "dd MMM yyyy"
  );

  return (
    <Card className={cn("border p-0 gap-0 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-transparent group-hover:bg-gray-50/50 dark:group-hover:bg-zinc-800/50 transition-colors">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-lg font-bold text-gray-800 dark:text-zinc-100">
            Transactions ({currentCount})
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-zinc-500 mb-0">
            {periodsKey[activePeriod]} activity
          </p>
        </div>

        <DropdownCustomMenu
          menus={[
            { label: "Last 28 Days", className: activePeriod == "last28Days" ? "bg-primary/10 text-primary font-medium" : "font-medium", onClick: () => { setActivePeriod('last28Days'); } },
            { label: "Last month", className: activePeriod == "lastMonth" ? "bg-primary/10 text-primary font-medium" : "font-medium", onClick: () => { setActivePeriod('lastMonth'); } },
            { label: "Last year", className: activePeriod == "lastYear" ? "bg-primary/10 text-primary font-medium" : "font-medium", onClick: () => { setActivePeriod('lastYear'); } },
          ]}
        >
          <button className="text-slate-400 hover:text-primary transition-colors outline-none">
            <MoreVertical className="w-5 h-5" />
          </button>
        </DropdownCustomMenu>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
        <div className="space-y-1">
          {loading && <TransactionListSkeleton />}
          {!loading && currentTransactions?.map((tx: any) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  tx.transaction_type === 2 ? "bg-slate-50 dark:bg-zinc-900 text-slate-500" : "bg-primary/10 text-primary"
                )}>
                  {tx.transaction_type === 2 ? <Wallet className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold text-gray-700 dark:text-zinc-200 leading-tight">
                    {tx.reason || tx.title}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 truncate">
                    {tx.payment_method || tx.type || formattedDate(tx.created_at)}
                  </span>
                </div>
              </div>
              <span className={cn(
                "text-[13px] font-bold tabular-nums",
                tx.transaction_type === 2 ? "text-[#F35555]" : "text-[#10B981]"
              )}>
                {tx.transaction_type === 2 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
          {!loading && (!currentTransactions || currentTransactions.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mb-3">
                <Wallet className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No transactions found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
