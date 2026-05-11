import { cn } from "@/lib/utils";
import { ShoppingBag, Users, FileText, Tag } from "lucide-react";

interface AdminWelcomeBannerProps {
  userName: string;
  ordersCount: number;
  customersCount: number;
  pendingInvoicesCount: number;
  undeliveredOrders: number;
  periodLabels?: Record<string, string>;
  className?: string;
  setActivePeriod: React.Dispatch<React.SetStateAction<"all" | "month" | "year">>;
  activePeriod: "all" | "month" | "year";
}

export function AdminWelcomeBanner({
  userName,
  ordersCount,
  customersCount,
  pendingInvoicesCount,
  undeliveredOrders,
  periodLabels,
  className,
  setActivePeriod,
  activePeriod
}: AdminWelcomeBannerProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-6 transition-all duration-300",
      className
    )}>
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 dark:bg-blue-900/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-50/50 dark:bg-purple-900/10 rounded-full -ml-30 -mb-30 blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 flex-1 space-y-3 text-center xl:text-left w-full">
        {/* Eyebrow */}
        <div className="flex items-center justify-center xl:justify-start gap-2 mb-1">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500">
            Tranzit Group • Live Dashboard
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
          Welcome back, <span className="text-transparent pr-1 bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 italic!">{userName}</span> 👋
        </h1>

        {/* Subtext */}
        <p className="text-[14px] font-medium text-slate-500 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto xl:mx-0">
          Here's what's happening with your business today. You have <span className="font-bold text-slate-900 dark:text-zinc-200">{ordersCount} orders</span> this month and <span className="font-bold text-amber-600 dark:text-amber-400">{pendingInvoicesCount} pending invoices</span> that need attention.
        </p>
      </div>

      {/* Stats and Period Selector */}
      <div className="relative z-10 flex flex-col items-center xl:items-end gap-5 w-full xl:w-auto">
        {/* Period Selector - Top Right */}
        <div className="flex bg-slate-50 dark:bg-zinc-900/50 p-1 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          {Object.keys(periodLabels || {}).map((key) => (
            <button
              key={key}
              onClick={() => setActivePeriod(key as any)}
              className={cn(
                "px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200",
                activePeriod === key
                  ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-slate-200 dark:ring-zinc-700"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300"
              )}
            >
              {periodLabels?.[key]}
            </button>
          ))}
        </div>

        {/* Stats Badges - Bottom Row */}
        <div className="flex flex-wrap justify-center xl:justify-end items-center gap-3 w-full">
          <div className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-default shadow-sm hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-bold whitespace-nowrap">{ordersCount} Orders</span>
          </div>

          <div className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-default shadow-sm hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-bold whitespace-nowrap">{customersCount} Customers</span>
          </div>

          <div className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-300 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-default shadow-sm hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-bold whitespace-nowrap">{pendingInvoicesCount} Invoices</span>
          </div>

          <div className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-700 dark:text-rose-300 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-default shadow-sm hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-bold whitespace-nowrap">{undeliveredOrders} Undelivered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
