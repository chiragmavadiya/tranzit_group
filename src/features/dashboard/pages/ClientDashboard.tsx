import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCard } from "../../../components/common/StatCard";
import { TransactionList } from "../components/TransactionList";
import { DashboardTable } from "../components/DashboardTable";
import {
  DollarSign,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

import { useDashboardMetrics } from "../hooks/useDashboard";
import type { DashboardOrder, CustomerMetrics } from "../types";
import { useNavigate } from "react-router";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { data: metricsData, isLoading } = useDashboardMetrics();

  // Real Data from API
  const metrics = metricsData?.data as CustomerMetrics;

  const stats = [
    {
      label: "Total Orders",
      value: isLoading ? 0 : metrics?.totalOrder ?? 0,
      icon: LayoutDashboard
    },
    {
      label: "Total Spend",
      value: isLoading ? '$0' : (typeof metrics?.totalSpend === 'number' ? `$${metrics.totalSpend.toFixed(2)}` : (metrics?.totalSpend || "$0.00")),
      icon: DollarSign,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
    },
    {
      label: "Invoice Pending",
      value: isLoading ? 0 : metrics?.pendingInvoiceCount ?? 0,
      icon: FileText,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    },
  ];

  const columns = [
    { header: "ORDER NUMBER", key: "order_number" as keyof DashboardOrder, cell: (val: string) => val ? <NavLink replace to={`/orders/${val}`} className="text-blue-600 dark:text-blue-400 cursor-pointer font-bold hover:underline">{val}</NavLink> : '-' },
    { header: "SUBURB", key: "suburb" as keyof DashboardOrder },
    { header: "AMOUNT", key: "amount" as keyof DashboardOrder, cell: (val: unknown) => (typeof val === 'number' ? `$${val.toFixed(2)}` : (val as string)) as React.ReactNode },
    { header: "STATUS", key: "status" as keyof DashboardOrder, cell: (val: unknown) => <StatusBadge status={val as string} /> },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, string> = {
      'Printed': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
      'Payment Pending': 'bg-amber-100 text-amber-600 dark:bg-blue-900/20 dark:text-blue-400',
      'Partial': 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      'Unpaid': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      'Draft': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
    };
    return (
      <Badge variant="secondary" className={cn("px-2 py-0 h-5 text-[10px] font-bold border-none", variants[status] || variants.Draft)}>
        {status}
      </Badge>
    );
  };


  return (
    <div className="p-page-padding space-y-4 overflow-y-auto animate-in fade-in duration-700">
      <WelcomeBanner
        variant="blue"
        userName="Welcome to Tranzit Group, Customer1 User"
        description="Manage pickups, create shipments, and track every parcel in real time, all from one dashboard built to keep your delivery costs low."
        buttons={[
          { label: "Send Parcel", variant: "default", onClick: () => navigate("/orders/create") },
          { label: "View Orders", variant: "outline", onClick: () => navigate("/orders") },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-8">
          <DashboardTable
            title="Recent Orders"
            subtitle="Orders"
            role="customer"
            columns={columns}
          />
        </div>
        <div className="xl:col-span-4 h-[550px]">
          {/* {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : (
          )} */}
          <TransactionList transactions={metrics?.transactions} loading={isLoading} />
        </div>

      </div>
    </div>
  );
}
