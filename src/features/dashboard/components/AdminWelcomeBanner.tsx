import { cn } from "@/lib/utils";
import { ShoppingBag, Users, FileText, Sparkles } from "lucide-react";
import { DateFilter } from "@/components/common/DateFilter";
import type { DateFilterValue } from "@/components/common/DateFilter/types";
import { NavLink } from "react-router-dom";

interface AdminWelcomeBannerProps {
  userName: string;
  ordersCount: number;
  customersCount: number;
  pendingInvoicesCount: number;
  undeliveredOrders: number;
  className?: string;
  filterValue: DateFilterValue;
  onFilterChange: (value: DateFilterValue) => void;
}

export function AdminWelcomeBanner({
  userName,
  ordersCount,
  customersCount,
  pendingInvoicesCount,
  // undeliveredOrders,
  className,
  filterValue,
  onFilterChange,
}: AdminWelcomeBannerProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-lg py-4 px-6 md:py-4 md:px-8 shadow-lg flex flex-col xl:flex-row items-center justify-between gap-6 transition-all duration-300",
      className
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-4 w-20 h-20 bg-blue-200/30 dark:bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-16 w-12 h-12 bg-indigo-200/40 dark:bg-indigo-500/15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-1/4 w-16 h-16 bg-cyan-200/30 dark:bg-cyan-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 right-8 w-8 h-8 bg-purple-200/40 dark:bg-purple-500/15 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <Sparkles className="absolute top-6 right-6 w-6 h-6 text-yellow-400/50 animate-spin" style={{ animationDuration: '3s' }} />
        <Sparkles className="absolute bottom-2 left-2 w-4 h-4 text-pink-400/50 animate-spin" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        {/* Additional Creative Elements */}
        <div className="absolute top-10 left-125 w-4 h-4 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 Q100,50 200,100 T400,100 V200 H0 Z" fill="currentColor" className="text-blue-300 dark:text-blue-700 animate-pulse" style={{ animationDuration: '5s' }} />
          </svg>
        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-50/50 dark:bg-purple-900/10 rounded-full -ml-30 -mb-30 blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 flex-1 text-center xl:text-left w-full">
        {/* Heading */}
        <h1 className="my-0 text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
          Welcome back, <span className="text-transparent pr-1 bg-clip-text bg-linear-to-r from-primary to-primary/80">{userName}</span> 👋
        </h1>
      </div>

      {/* Stats and Period Selector */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4 w-full xl:w-auto">
        <DateFilter
          value={filterValue}
          onChange={onFilterChange}
          fromDashboard={true}
        />

        {/* Separator line (visible only on desktop) */}
        <div className="hidden lg:block h-6 w-px bg-slate-200 dark:bg-zinc-800" />

        {/* Stats Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          <NavLink
            to={`/admin/orders?start_date=${encodeURIComponent(filterValue.from || '')}&end_date=${encodeURIComponent(filterValue.to || '')}`}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{ordersCount} Orders</span>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/20 text-primary transition-all hover:bg-primary/10 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{customersCount} Customers</span>
          </NavLink>

          <NavLink
            to={`/admin/invoices?start_date=${encodeURIComponent(filterValue.from || '')}&end_date=${encodeURIComponent(filterValue.to || '')}`}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-300 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{pendingInvoicesCount} Invoices</span>
          </NavLink>

          {/* <div className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-700 dark:text-rose-300 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-default shadow-sm hover:shadow-md">
            <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{undeliveredOrders} Undelivered</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
