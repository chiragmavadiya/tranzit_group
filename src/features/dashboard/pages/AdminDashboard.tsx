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
  Truck,
  ShoppingCart
} from "lucide-react";
import { useDashboardMetrics } from "../hooks/useDashboard";
import type { AdminMetrics } from "../types";
import { NavLink } from "react-router-dom";
import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { StatusCell } from "@/components/common";
import { formatCurrency } from "@/features/orders/utils/order-details.utils";

export default function AdminDashboard() {
  const [activePeriod, setActivePeriod] = useState<string>('month');

  // Temporary states for date pickers in Welcome Banner
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(new Date());

  // Applied states that trigger the query
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(new Date());

  const handleApply = () => {
    setAppliedStartDate(tempStartDate);
    setAppliedEndDate(tempEndDate);
  };

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    params.activePeriod = activePeriod;
    if (activePeriod === 'all') {
      if (appliedStartDate) {
        const formatted = format(appliedStartDate, 'yyyy/MM/dd');
        params.to_date_from = formatted;
      }
      if (appliedEndDate) {
        const formatted = format(appliedEndDate, 'yyyy/MM/dd');
        params.to_date_to = formatted;
      }
    }
    return params;
  }, [activePeriod, appliedStartDate, appliedEndDate]);

  const { data: metricsData, isLoading } = useDashboardMetrics(queryParams);

  const metrics = metricsData?.data as AdminMetrics;

  const secondaryStats = [
    {
      label: "Margin",
      value: formatCurrency(metrics?.financeByPeriod[activePeriod]?.margin || 0),
      subValue: "Total Margin Amount",
      icon: TrendingDown,
      loading: isLoading,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    },
    {
      label: "Orders",
      value: formatCurrency(metrics?.financeByPeriod[activePeriod]?.orderAmount || 0),
      subValue: "Total Order Amount",
      icon: ShoppingCart,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      loading: isLoading
    },
    {
      label: "Paid Invoices",
      value: formatCurrency(metrics?.financeByPeriod[activePeriod]?.paidInvoiceAmount || 0),
      subValue: "Total Paid Invoices Amount",
      icon: FileText,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      loading: isLoading
    },
  ];

  const tertiaryStats = [
    {
      label: "Unpaid Invoices",
      value: formatCurrency(metrics?.financeByPeriod[activePeriod]?.unpaidInvoiceAmount || 0),
      subValue: "Total Unpaid Invoices Amount",
      icon: FileText,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      loading: isLoading
    },
    {
      label: "Invoices",
      value: formatCurrency(metrics?.financeByPeriod[activePeriod]?.invoiceAmount || 0),
      subValue: "Total Invoice Amount",
      icon: FileText,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      loading: isLoading
    },
    {
      label: "Total Pickup Charges",
      value: formatCurrency(metrics?.financeByPeriod[activePeriod]?.pickupCharges || 0),
      subValue: "Total Pickup Charges Amount",
      icon: Truck,
      color: "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary",
      loading: isLoading
    },
  ];

  const columns = [
    { header: "#", key: "id", cell: (val: string) => val ? <NavLink replace to={`/admin/invoices/${val}`} className="text-primary cursor-pointer font-bold hover:underline">#{val}</NavLink> : '-' },
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
            startDate={tempStartDate}
            setStartDate={setTempStartDate}
            endDate={tempEndDate}
            setEndDate={setTempEndDate}
            onApply={handleApply}
          />
        </div>
        {/* <div className="lg:col-span-12 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Statistics</h2>
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
              {Object.keys(metrics?.periodLabels || {}).map((key) => (
                <button key={key} onClick={() => setActivePeriod(key as any)} className={`px-3 py-1 text-[11px] font-bold rounded-md hover:bg-white dark:hover:bg-zinc-700 transition-all ${activePeriod === key ? 'text-primary bg-primary/10' : 'text-slate-500'}`}>
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
