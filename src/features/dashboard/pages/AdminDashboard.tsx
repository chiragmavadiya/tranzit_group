import { AdminWelcomeBanner } from "../components/AdminWelcomeBanner";
import { StatCard } from "../../../components/common/StatCard";
import { TransactionList } from "../components/TransactionList";
import { DashboardTable } from "../components/DashboardTable";
import {
  // Users,
  FileText,
  // LayoutDashboard,
  // Tag,
  TrendingDown,
  BarChart3,
  CreditCard
} from "lucide-react";
import { useDashboardMetrics } from "../hooks/useDashboard";
import type { AdminMetrics } from "../types";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { StatusCell } from "@/components/common";

export default function AdminDashboard() {
  const { data: metricsData, isLoading } = useDashboardMetrics();

  const metrics = metricsData?.data as AdminMetrics;
  const [activePeriod, setActivePeriod] = useState<'all' | 'month' | 'year'>('month');

  // Real Data from API
  // const topStats = [
  //   {
  //     label: "Orders",
  //     value: metrics?.statsByPeriod[activePeriod]?.orders,
  //     icon: LayoutDashboard,
  //     loading: isLoading
  //   },
  //   {
  //     label: "Customers",
  //     value: metrics?.statsByPeriod[activePeriod]?.customers,
  //     icon: Users,
  //     color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  //     loading: isLoading
  //   },
  //   {
  //     label: "Invoice Pending",
  //     value: metrics?.statsByPeriod[activePeriod]?.pendingInvoices,
  //     icon: FileText,
  //     color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  //     loading: isLoading
  //   },
  //   {
  //     label: "Labels Undelivered",
  //     value: metrics?.statsByPeriod[activePeriod]?.undeliveredOrders,
  //     icon: Tag,
  //     color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  //     loading: isLoading
  //   },
  // ];

  const secondaryStats = [
    {
      label: "Margin",
      value: metrics?.financeByPeriod[activePeriod]?.margin || '0',
      subValue: "Total Margin Amount",
      icon: TrendingDown,
      loading: isLoading
    },
    {
      label: "Orders",
      value: metrics?.financeByPeriod[activePeriod]?.orderAmount || 0,
      subValue: "Total Order Amount",
      icon: BarChart3,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      loading: isLoading
    },
    {
      label: "Paid Invoices",
      value: metrics?.financeByPeriod[activePeriod]?.paidInvoiceAmount || 0,
      subValue: "Total Paid Invoices Amount",
      icon: FileText,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      loading: isLoading
    },
  ];

  const tertiaryStats = [
    {
      label: "Unpaid Invoices",
      value: metrics?.financeByPeriod[activePeriod]?.unpaidInvoiceAmount || 0,
      subValue: "Total Unpaid Invoices Amount",
      icon: FileText,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      loading: isLoading
    },
    {
      label: "Invoices",
      value: metrics?.financeByPeriod[activePeriod]?.invoiceAmount || 0,
      subValue: "Total Invoice Amount",
      icon: CreditCard,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      loading: isLoading
    },
  ];

  const columns = [
    { header: "#", key: "id", cell: (val: string) => val ? <NavLink replace to={`/admin/invoices/${val}`} className="text-blue-600 dark:text-blue-400 cursor-pointer font-bold hover:underline">#{val}</NavLink> : '-' },
    { header: "STATUS", key: "status", cell: (val: string) => <StatusCell value={val} /> },
    { header: "TOTAL", key: "amount", cell: (val: unknown) => `$${Number(val).toFixed(2)}` },
    { header: "ISSUED DATE", key: "invoice_date" },
  ];

  return (
    <div className="p-page-padding space-y-4 overflow-y-auto animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-12">
          <AdminWelcomeBanner
            userName="Super Admin"
            ordersCount={metrics?.statsByPeriod[activePeriod]?.orders || 0}
            customersCount={metrics?.statsByPeriod[activePeriod]?.customers || 0}
            pendingInvoicesCount={metrics?.statsByPeriod[activePeriod]?.pendingInvoices || 0}
            undeliveredOrders={metrics?.statsByPeriod[activePeriod]?.undeliveredOrders || 0}
            periodLabels={metrics?.periodLabels || {}}
            className="w-full"
            setActivePeriod={setActivePeriod}
            activePeriod={activePeriod}
          />
        </div>
        {/* <div className="lg:col-span-12 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Statistics</h2>
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
              {Object.keys(metrics?.periodLabels || {}).map((key) => (
                <button key={key} onClick={() => setActivePeriod(key as any)} className={`px-3 py-1 text-[11px] font-bold rounded-md hover:bg-white dark:hover:bg-zinc-700 transition-all ${activePeriod === key ? 'text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/20' : 'text-slate-500'}`}>
                  {metrics?.periodLabels?.[key]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topStats.map((stat, idx) => (
              <StatCard key={idx} {...stat} className="border-none" />
            ))}
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {secondaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tertiaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} className="lg:col-span-1" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-4 h-[500px]">
          <TransactionList
            transactions={{
              last28days: metrics?.last28Days || [],
              lastmonth: metrics?.lastMonth || [],
              lastyear: metrics?.lastYear || []
            }}
            loading={isLoading}
          />
        </div>

        <div className="xl:col-span-8">
          <DashboardTable
            title="Pending Invoices"
            subtitle="Pending Invoices"
            role="admin"
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}
