import { NavLink } from "react-router-dom";
import type { Order } from "./types";
import type { Column } from "@/components/common/types/DataTable.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    'Printed': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
    'Payment pending': 'bg-amber-100 text-amber-600 dark:bg-blue-900/20 dark:text-blue-400',
    'Partial': 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    'Unpaid': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    'Draft': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
    'Paid': 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  };
  return (
    <Badge variant="secondary" className={cn("px-2 py-0 h-5 text-[10px] font-bold border-none", variants[status] || variants.Draft)}>
      {status}
    </Badge>
  );
};

export const getOrdersColumns = (role: string = "customer"): Column<Order>[] => [
  {
    header: 'ORDER #',
    key: 'order_number',
    className: 'text-blue-600 font-bold',
    sticky: 'left',
    cell: (value: string) => (
      <NavLink to={`${role === "admin" ? "/admin/orders/edit" : "/orders/edit"}/${value}`} className="font-bold text-blue-600 underline dark:text-blue-400 ">
        {value}
      </NavLink>
    )

  },
  {
    header: 'CUSTOMER NAME', key: 'customer_name'
  },
  {
    header: 'SUBURB', key: 'suburb'
  },
  {
    header: 'AMOUNT', key: 'amount'
  },
  {
    header: 'STATUS', key: 'status', cell: (value: string) => <StatusBadge status={value} />
  },
  {
    header: 'PAYMENT STATUS', key: 'payment_status', cell: (value: string) => <StatusBadge status={value} />
  },
  {
    header: 'COURIER', key: 'courier'
  },
  {
    header: 'ORDER TYPE', key: 'order_type'
  },
  {
    header: 'ORDER DATE', key: 'consignment_date'
  },
];
