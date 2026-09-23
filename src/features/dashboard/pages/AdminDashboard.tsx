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
  ShoppingCart,
  DollarSign
} from "lucide-react";
import { useDashboardMetrics } from "../hooks/useDashboard";
import type { AdminMetrics } from "../types";
import { useState, useMemo } from "react";
import { format, parse, isValid } from "date-fns";
import { LinkCell, StatusCell } from "@/components/common";
import { formatCurrency } from "@/features/orders/utils/order-details.utils";
import BarChart from "@/components/common/charts/BarChart";
import type { DateFilterValue } from "@/components/common/DateFilter/types";
import { calculateDateRange } from "@/components/common/DateFilter/utils";
import type { Invoice } from "@/features/invoices/types";

export default function AdminDashboard() {
  const [filterValue, setFilterValue] = useState<DateFilterValue>(() => {
    const range = calculateDateRange('thisMonth');
    return {
      type: 'thisMonth',
      from: format(range.from, 'dd/MM/yyyy'),
      to: format(range.to, 'dd/MM/yyyy'),
      label: range.label,
    };
  });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (filterValue.from) {
      const parsedFrom = parse(filterValue.from, 'dd/MM/yyyy', new Date());
      if (isValid(parsedFrom)) {
        params.to_date_from = format(parsedFrom, 'yyyy-MM-dd');
      }
    }
    if (filterValue.to) {
      const parsedTo = parse(filterValue.to, 'dd/MM/yyyy', new Date());
      if (isValid(parsedTo)) {
        params.to_date_to = format(parsedTo, 'yyyy-MM-dd');
      }
    }
    return params;
  }, [filterValue]);

  const { data: metricsData, isLoading } = useDashboardMetrics(queryParams);

  const metrics = metricsData?.data as AdminMetrics;

  const secondaryStats = [
    {
      label: `Australia Post Estimated Billing (${filterValue.label})`,
      value: formatCurrency(Number(metrics?.australia_post_estimated_billing || 0)),
      // subValue: "Australia Post Estimated Billing",
      icon: DollarSign,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      loading: isLoading,
      link: {
        text: 'Show Reports',
        path: `/admin/auspost-report?start_date=${encodeURIComponent(filterValue.from || '')}&end_date=${encodeURIComponent(filterValue.to || '')}`
      }
    },
    {
      label: "Total Margin Amount",
      value: formatCurrency(Number(metrics?.totalMarginAmount || 0)),
      // subValue: "Total Margin Amount",
      icon: TrendingDown,
      loading: isLoading,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    },
    {
      label: "Total Order Amount",
      value: formatCurrency(Number(metrics?.totalOrderAmount || 0)),
      // subValue: "Total Order Amount",
      icon: ShoppingCart,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      loading: isLoading
    },
  ];

  const tertiaryStats = [
    {
      label: "Paid Invoices Amount",
      value: formatCurrency(Number(metrics?.totalPaidInvoiceAmount || 0)),
      // subValue: "Total Paid Invoices Amount",
      icon: FileText,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      loading: isLoading
    },
    {
      label: "Unpaid Invoices Amount",
      value: formatCurrency(Number(metrics?.totalUnpaidInvoiceAmount || 0)),
      // subValue: "Total Unpaid Invoices Amount",
      icon: FileText,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      loading: isLoading
    },
    {
      label: "Total Invoice Amount",
      value: formatCurrency(Number(metrics?.totalInvoiceAmount || 0)),
      // subValue: "Total Invoice Amount",
      icon: FileText,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      loading: isLoading
    },
    {
      label: "Total Pickup Charge Amount",
      value: formatCurrency(Number(metrics?.totalPickupChargeAmount || 0)),
      // subValue: "Total Pickup Charges Amount",
      icon: Truck,
      color: "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary",
      loading: isLoading
    },
  ];

  const columns = [
    { header: "#", key: "id", cell: (val: string, row: any) => val ? <LinkCell value={`#${row?.invoice_number}`} className="font-bold text-primary" path={`/admin/invoices/${val}`} /> : '-' },
    { header: "STATUS", key: "status", cell: (val: string) => <StatusCell value={val} /> },
    { header: "CUSTOMER", key: "user", cell: (_: string, row: Invoice) => (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 dark:text-zinc-200">{row.customer_full_name || row.user?.name}</span>
              <span className="text-xs text-gray-500 dark:text-zinc-400">{row.customer_email || row.user?.email}</span>
            </div>
          ) },
    { header: "TOTAL", key: "amount", cell: (val: unknown) => `$${Number(val).toFixed(2)}` },
    { header: "ISSUED DATE", key: "invoice_date" },
  ];

  return (
    <div className="p-page-padding space-y-4 overflow-y-auto animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-12">
          <AdminWelcomeBanner
            userName="Super Admin"
            ordersCount={metrics?.totalOrder || 0}
            customersCount={metrics?.totalCustomers || 0}
            pendingInvoicesCount={metrics?.totalInvoiceCount || 0}
            undeliveredOrders={metrics?.totalUndeliveredOrder || 0}
            className="w-full"
            filterValue={filterValue}
            onFilterChange={setFilterValue}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <BarChart
          data={metrics?.chart?.bars || []}
          summary={metrics?.chart?.summary}
          loading={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {secondaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tertiaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} className="lg:col-span-1" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-4 min-h-[400px]">
          <TransactionList
            transactions={metrics?.transactions || []}
            loading={isLoading}
          />
        </div>

        <div className="xl:col-span-8">
          <DashboardTable
            title="Pending Invoices"
            subtitle="Pending Invoices"
            role="admin"
            columns={columns}
            filterValue={filterValue}
          />
        </div>
      </div>
    </div>
  );
}
