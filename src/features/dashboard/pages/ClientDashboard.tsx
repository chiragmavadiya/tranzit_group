import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCard } from "../components/StatCard";
import { TransactionList } from "../components/TransactionList";
import { DashboardTable } from "../components/DashboardTable";
import {
  DollarSign,
  FileText,
  LayoutDashboard
} from "lucide-react";
import type { Transaction, DashboardOrder } from "../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

export default function ClientDashboard() {
  // Mock Data
  const stats = [
    { label: "Total Orders", value: 39, icon: LayoutDashboard },
    { label: "Total Spend", value: "$152.35", icon: DollarSign, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
    { label: "Invoice Pending", value: 1, icon: FileText, color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" },
  ];

  const transactions: Transaction[] = [
    { id: '1', type: 'debit', title: 'Wallet', subtitle: 'Consignment', amount: 8.64, date: '1 min ago' },
    { id: '2', type: 'credit', title: 'Wallet', subtitle: 'Add Money', amount: 8.64, date: '2 mins ago' },
  ];

  const orders: DashboardOrder[] = [
    { id: 1, orderNumber: '01KFA29K67CZ6XXXYZBZZT59W8N', suburb: 'Melbourne', amount: 11.63, status: 'Printed' },
    { id: 2, orderNumber: '01KFA259ZV9P7TC9CVRC9MQ56Q', suburb: 'Officer', amount: 109.43, status: 'Printed' },
    { id: 3, orderNumber: '01KF4HZJKW8KMXTR5GNJDYXQEJ', suburb: 'Officer', amount: 13.65, status: 'Printed' },
    { id: 4, orderNumber: '01KDYJ5P7QH5ZYX46WW0CF1HAE', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 5, orderNumber: '01KDYJ5P5PPFZ0WCJNG9N3R6Y1', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 6, orderNumber: '01KDYJ5P4EJ0M7W580ZPWGMFZ5', suburb: 'Melbourne', amount: 9.00, status: 'Printed' },
    { id: 7, orderNumber: '01KDYJ5P3737Z5N0Q8PV2F07NY', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 8, orderNumber: '01KFA29K67CZ6XXXYZBZZT59W8N', suburb: 'Melbourne', amount: 11.63, status: 'Printed' },
    { id: 9, orderNumber: '01KFA259ZV9P7TC9CVRC9MQ56Q', suburb: 'Officer', amount: 109.43, status: 'Printed' },
    { id: 10, orderNumber: '01KF4HZJKW8KMXTR5GNJDYXQEJ', suburb: 'Officer', amount: 13.65, status: 'Printed' },
    { id: 11, orderNumber: '01KDYJ5P7QH5ZYX46WW0CF1HAE', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 12, orderNumber: '01KDYJ5P5PPFZ0WCJNG9N3R6Y1', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 13, orderNumber: '01KDYJ5P4EJ0M7W580ZPWGMFZ5', suburb: 'Melbourne', amount: 9.00, status: 'Printed' },
    { id: 14, orderNumber: '01KDYJ5P3737Z5N0Q8PV2F07NY', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 15, orderNumber: '01KFA29K67CZ6XXXYZBZZT59W8N', suburb: 'Melbourne', amount: 11.63, status: 'Printed' },
    { id: 16, orderNumber: '01KFA259ZV9P7TC9CVRC9MQ56Q', suburb: 'Officer', amount: 109.43, status: 'Printed' },
    { id: 17, orderNumber: '01KF4HZJKW8KMXTR5GNJDYXQEJ', suburb: 'Officer', amount: 13.65, status: 'Printed' },
    { id: 18, orderNumber: '01KDYJ5P7QH5ZYX46WW0CF1HAE', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 19, orderNumber: '01KDYJ5P5PPFZ0WCJNG9N3R6Y1', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 20, orderNumber: '01KDYJ5P4EJ0M7W580ZPWGMFZ5', suburb: 'Melbourne', amount: 9.00, status: 'Printed' },
    { id: 21, orderNumber: '01KDYJ5P3737Z5N0Q8PV2F07NY', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 22, orderNumber: '01KFA29K67CZ6XXXYZBZZT59W8N', suburb: 'Melbourne', amount: 11.63, status: 'Printed' },
    { id: 23, orderNumber: '01KFA259ZV9P7TC9CVRC9MQ56Q', suburb: 'Officer', amount: 109.43, status: 'Printed' },
    { id: 24, orderNumber: '01KF4HZJKW8KMXTR5GNJDYXQEJ', suburb: 'Officer', amount: 13.65, status: 'Printed' },
    { id: 25, orderNumber: '01KDYJ5P7QH5ZYX46WW0CF1HAE', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 26, orderNumber: '01KDYJ5P5PPFZ0WCJNG9N3R6Y1', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
    { id: 27, orderNumber: '01KDYJ5P4EJ0M7W580ZPWGMFZ5', suburb: 'Melbourne', amount: 9.00, status: 'Printed' },
    { id: 28, orderNumber: '01KDYJ5P3737Z5N0Q8PV2F07NY', suburb: 'Melbourne', amount: '-', status: 'Payment Pending' },
  ];

  const columns = [
    { header: "ORDER NUMBER", key: "orderNumber" as keyof DashboardOrder, cell: (val: string) => val ? <NavLink replace to={`/orders/${val}`} className="text-blue-600 dark:text-blue-400 cursor-pointer font-bold hover:underline">{val}</NavLink> : '-' },
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
    <div className="p-page-padding space-y-6 overflow-y-auto animate-in fade-in duration-700">
      <WelcomeBanner
        variant="blue"
        userName="Welcome to Tranzit Group, Customer1 User"
        description="Manage pickups, create shipments, and track every parcel in real time, all from one dashboard built to keep your delivery costs low."
        buttons={[
          { label: "Send Parcel", variant: "default", onClick: () => console.log("Send Parcel clicked") },
          { label: "View Orders", variant: "outline", onClick: () => console.log("View Orders clicked") },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
          <DashboardTable
            title="Recent Orders"
            subtitle="Orders"
            data={orders}
            columns={columns}
          />
        </div>
        <div className="xl:col-span-4 h-[550px]">
          <TransactionList transactions={transactions} />
        </div>

      </div>
    </div>
  );
}
