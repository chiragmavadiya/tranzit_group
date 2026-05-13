import { NavLink } from "react-router-dom";
import type { Order } from "./types";
import type { Column } from "@/components/common/types/DataTable.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Eye, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/common/CustomTooltip";

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

export const getOrdersColumns = (role: string = "customer", orderType: string = 'new', navigate: any): Column<Order>[] => [
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
  {
    header: "",
    key: "order_number",
    cell: (value: string) => {
      if (orderType === "new") {
        return (
          <div className="flex gap-2">
            <CustomTooltip title="Preview Order">
              <Button
                onClick={() => navigate(`${role === "admin" ? "/admin/orders/edit" : "/orders/edit"}/${value}`)}
                variant="ghost"
                size="sm"
                className="h-fit w-fit p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </CustomTooltip>
            <CustomTooltip title="Consign Order">
              <Button
                onClick={() => navigate(`${role === "admin" ? "/admin/orders/consign" : "/orders/consign"}/${value}`)}
                variant="ghost"
                size="sm"
                className="h-fit w-fit p-0"
              >
                <PackagePlus className="h-4 w-4" />
              </Button>
            </CustomTooltip>
          </div>
        )
      }
    }
  }
];
