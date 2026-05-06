import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCard } from "../../../components/common/StatCard";
import { TransactionList } from "../components/TransactionList";
import { DashboardTable } from "../components/DashboardTable";
import {
  Users,
  FileText,
  LayoutDashboard,
  Tag,
  TrendingDown,
  BarChart3,
  CreditCard,
  Loader2
} from "lucide-react";
import { useDashboardMetrics } from "../hooks/useDashboard";
import type { AdminMetrics } from "../types";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: metricsData, isLoading } = useDashboardMetrics();

  const metrics = metricsData?.data as AdminMetrics;
  const [activePeriod, setActivePeriod] = useState<'all' | 'month' | 'year'>('month');

  // Real Data from API
  const topStats = [
    {
      label: "Orders",
      value: isLoading ? 0 : metrics?.statsByPeriod[activePeriod]?.orders,
      icon: LayoutDashboard
    },
    {
      label: "Customers",
      value: isLoading ? 0 : metrics?.statsByPeriod[activePeriod]?.customers,
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
    },
    {
      label: "Invoice Pending",
      value: isLoading ? 0 : metrics?.statsByPeriod[activePeriod]?.pendingInvoices,
      icon: FileText,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    },
    {
      label: "Labels Undelivered",
      value: isLoading ? 0 : metrics?.statsByPeriod[activePeriod]?.undeliveredOrders,
      icon: Tag,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
    },
  ];

  const secondaryStats = [
    {
      label: "Margin",
      value: isLoading ? 0 : (metrics?.financeByPeriod[activePeriod]?.margin || '0'),
      subValue: "Total Margin Amount",
      icon: TrendingDown
    },
    {
      label: "Orders",
      value: isLoading ? 0 : (metrics?.financeByPeriod[activePeriod]?.orderAmount || 0),
      subValue: "Total Order Amount",
      icon: BarChart3,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
    },
    {
      label: "Paid Invoices",
      value: isLoading ? 0 : (metrics?.financeByPeriod[activePeriod]?.paidInvoiceAmount || 0),
      subValue: "Total Paid Invoices Amount",
      icon: FileText,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
    },
  ];

  const tertiaryStats = [
    {
      label: "Unpaid Invoices",
      value: isLoading ? 0 : (metrics?.financeByPeriod[activePeriod]?.unpaidInvoiceAmount || 0),
      subValue: "Total Unpaid Invoices Amount",
      icon: FileText,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
    },
    {
      label: "Invoices",
      value: isLoading ? 0 : (metrics?.financeByPeriod[activePeriod]?.invoiceAmount || 0),
      subValue: "Total Invoice Amount",
      icon: CreditCard,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    },
  ];

  // const transactions: Transaction[] = [
  //   { id: '1', type: 'debit', title: 'System', subtitle: 'Label Generation', amount: 22.10, date: '1 min ago' },
  // ];

  // const invoices: DashboardInvoice[] = [
  //   {
  //     "id": 1,
  //     "user_id": 7,
  //     "invoice_number": "0001",
  //     "amount": "85.00",
  //     "invoice_date": "2025-12-29T13:00:00.000000Z",
  //     "amount_paid": "11.00",
  //     "status": "partial",
  //     "user": {
  //       "name": "Shikhar Test",
  //       "email": "shikhar+5@digisite.com.au",
  //       "id": 7
  //     },
  //     "balance": 74,
  //     "DT_RowIndex": 1
  //   },
  //   {
  //     "id": 2,
  //     "user_id": 2,
  //     "invoice_number": "0002",
  //     "amount": "122.10",
  //     "invoice_date": "2025-12-29T13:00:00.000000Z",
  //     "amount_paid": "0.00",
  //     "status": "unpaid",
  //     "user": {
  //       "name": "Customer1 User",
  //       "email": "customer1@example.com",
  //       "id": 2
  //     },
  //     "balance": 122.1,
  //     "DT_RowIndex": 2
  //   },
  //   {
  //     "id": 3,
  //     "user_id": 9,
  //     "invoice_number": "0003",
  //     "amount": "100.00",
  //     "invoice_date": "2025-12-30T13:00:00.000000Z",
  //     "amount_paid": "50.00",
  //     "status": "partial",
  //     "user": {
  //       "name": "Chirag 10 Gondaliya 10",
  //       "email": "chirag.magecurious@gmail.com",
  //       "id": 9
  //     },
  //     "balance": 50,
  //     "DT_RowIndex": 3
  //   },
  //   {
  //     "id": 4,
  //     "user_id": 9,
  //     "invoice_number": "0004",
  //     "amount": "901.36",
  //     "invoice_date": "2026-02-19T13:00:00.000000Z",
  //     "amount_paid": "50.00",
  //     "status": "partial",
  //     "user": {
  //       "name": "Chirag 10 Gondaliya 10",
  //       "email": "chirag.magecurious@gmail.com",
  //       "id": 9
  //     },
  //     "balance": 851.36,
  //     "DT_RowIndex": 4
  //   },
  //   {
  //     "id": 5,
  //     "user_id": 23,
  //     "invoice_number": "0005",
  //     "amount": "300.00",
  //     "invoice_date": "2026-02-26T13:00:00.000000Z",
  //     "amount_paid": "0.00",
  //     "status": "draft",
  //     "user": {
  //       "name": "Chirag Test",
  //       "email": "chirag.gondaliya03@gmail.com",
  //       "id": 23
  //     },
  //     "balance": 300,
  //     "DT_RowIndex": 5
  //   },
  //   {
  //     "id": 7,
  //     "user_id": 7,
  //     "invoice_number": "0007",
  //     "amount": "900.00",
  //     "invoice_date": "2026-02-27T13:00:00.000000Z",
  //     "amount_paid": "650.00",
  //     "status": "partial",
  //     "user": {
  //       "name": "Shikhar Test",
  //       "email": "shikhar+5@digisite.com.au",
  //       "id": 7
  //     },
  //     "balance": 250,
  //     "DT_RowIndex": 6
  //   },
  //   {
  //     "id": 8,
  //     "user_id": 7,
  //     "invoice_number": "0008",
  //     "amount": "740.00",
  //     "invoice_date": "2026-02-27T13:00:00.000000Z",
  //     "amount_paid": "0.00",
  //     "status": "draft",
  //     "user": {
  //       "name": "Shikhar Test",
  //       "email": "shikhar+5@digisite.com.au",
  //       "id": 7
  //     },
  //     "balance": 740,
  //     "DT_RowIndex": 7
  //   }
  // ];

  const columns = [
    { header: "#", key: "id", cell: (val: string) => val ? <NavLink replace to={`/admin/invoices/${val}`} className="text-blue-600 dark:text-blue-400 cursor-pointer font-bold hover:underline">#{val}</NavLink> : '-' },
    { header: "STATUS", key: "status" },
    { header: "TOTAL", key: "amount", cell: (val: unknown) => `$${Number(val).toFixed(2)}` },
    { header: "ISSUED DATE", key: "invoice_date" },
  ];

  return (
    <div className="p-page-padding space-y-4 overflow-y-auto animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-4">
          <WelcomeBanner
            variant="purple"
            userName="Welcome back, Super Admin"
            description="Tranzit Group dashboard overview"
            className="h-full py-4"
          />
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6">
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
              <StatCard key={idx} {...stat} className="border-none shadow-md bg-slate-50/50 dark:bg-zinc-900/30" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secondaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tertiaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} className="lg:col-span-1" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-4 h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <TransactionList transactions={{
              last28days: [],
              lastmonth: [],
              lastyear: []
            }} />
          )}
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
