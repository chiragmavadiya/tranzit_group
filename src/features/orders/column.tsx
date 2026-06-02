import { NavLink } from "react-router-dom";
import type { Order } from "./types";
import type { Column } from "@/components/common/types/DataTable.types";

import { Eye, Loader2, MoreVertical, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownCustomMenu } from "@/components/ui/dropdown-menu";
import { CustomTooltip } from "@/components/common/CustomTooltip";
import { StatusBadge } from "./components/StatusBadge";
import { formateCurrency } from "@/lib/utils";
import Favicon from '@/assets/favicon.png';
import { CustomerNameCell } from "./components/CustomerNameCell";

export const getOrdersColumns = (
  role: string = "customer",
  orderType: string = 'new',
  navigate: any,
  customerEditClick: (id: string) => void,
  onDownloadLabel?: (orderId: string) => void,
  _onCancelOrder?: (orderId: string) => void,
  downloadingLabelId?: string | null,
  fromCustomer: boolean = false,
  onArchiveOrder?: (orderId: string) => void,
  updateToArchiveId?: string | null
): Column<Order>[] => {
  const printedAndShippedActions = (value: string) => [
    {
      label: "View order",
      onClick: () => navigate(`${role === "admin" ? "/admin/orders/view" : "/orders/view"}/${value}`),
      // icon: Eye,
    },
    {
      label: "Download Label",
      onClick: () => onDownloadLabel?.(value),
      // icon: Download,
    },
    {
      label: "Archived order",
      onClick: () => {
        onArchiveOrder?.(value);
      },
      // icon: Archive,
      variant: "destructive" as const,
      className: "text-red-600 dark:text-red-400 font-medium"
    }
  ]

  const newActions = (value: string) => [
    {
      label: "View order",
      onClick: () => navigate(`${role === "admin" ? "/admin/orders/view" : "/orders/view"}/${value}`),
      // icon: Eye,
    },
    {
      label: "Archive order",
      onClick: () => {
        onArchiveOrder?.(value);
      },
      variant: "destructive" as const,
      className: "text-red-600 dark:text-red-400 font-medium"
    },
  ]
  return (
    [
      {
        header: 'ORDER #',
        key: 'order_number',
        className: 'text-primary font-bold',
        // sticky: 'left',
        cell: (value: string) => (
          <NavLink to={`${role === "admin" ? "/admin" : ""}/orders/${(orderType === 'new' && !fromCustomer) ? 'consign' : 'view'}/${value}`} className="font-bold text-primary underline">
            {value}
          </NavLink>
        )

      },
      {
        header: orderType === 'new' ? 'ORDER DATE' : 'SHIPPED', key: 'consignment_date',
        width: '200px',
        cell: (value: string) => value
      },
      {
        header: 'CUSTOMER',
        key: 'customer_name',
        width: '220px',
        cell: (value: string, row: Order) => (
          <CustomerNameCell
            value={value}
            row={row}
            orderType={orderType}
            customerEditClick={customerEditClick}
            fromCustomer={fromCustomer}
          />
        )
      },
      {
        header: 'SUBURB', key: 'suburb', width: '140px'
      },
      {
        header: 'CARRIER & PRODUCT', key: 'courier',
        width: '220px',
        cell: (value: string, row: Order) => (
          <div className="flex items-center gap-1">
            <div>
              <img src={row?.courier_logo || row?.courier_logo_url} className="h-6" alt="" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{value !== 'unknown' ? value : '-'}</span>
              {row.product_id && <span className="font-normal text-sm">Product - {row.product_id}</span>}
            </div>
          </div>
        )
      },

      ...(orderType === 'new' ? [{
        header: 'STATUS', key: 'status', cell: (value: string) => <StatusBadge status={value === "Payment pending" ? "Courier not assign" : value} />
      }] : []),
      ...((orderType == 'archived' || orderType === 'shipped') ? [{
        header: 'TRANSIT STATUS', key: 'tracking_status', cell: (value: string) => <StatusBadge status={value} />
      }] : []),
      ...(orderType === 'archived' ? [{
        header: 'ORDER STATUS', key: 'status', cell: (value: string) => <StatusBadge status={value === "Payment pending" ? "Courier not assign" : value} />
      }] : []),
      {
        header: 'AMOUNT', key: 'amount', cell: (value: string) => <span className="font-medium"> {formateCurrency(Number(value))}</span>
      },
      ...(orderType !== 'shipped' ? [{
        header: 'PAYMENT STATUS', key: 'payment_status', cell: (value: string) => <StatusBadge status={value} />
      }] : []),
      {
        header: 'ORDER SOURCE', key: 'order_type',
        cell: (value: string, row: Order) => (
          <div className="flex items-center gap-2">
            <img src={row?.order_source_icon || Favicon} className="h-4 w-4" alt="" />
            <span className="capitalize">{value}</span>
          </div>
        )
      },

      {
        header: "",
        key: "order_number",
        cell: (value: string) => (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {fromCustomer ? (
              <>
                <CustomTooltip title="View Order">

                  <Button
                    onClick={() => navigate(`${role === "admin" ? "/admin/orders/view" : "/orders/view"}/${value}`)}
                    variant="ghost"
                    size="sm"
                    className="h-fit w-fit p-0"
                  >
                    <Eye className="h-4.5! w-4.5!" />
                  </Button>
                </CustomTooltip>
              </>
            ) : (<>

              {(orderType === 'archived') && (
                <CustomTooltip title="View Order">
                  <Button
                    onClick={() => navigate(`${role === "admin" ? "/admin/orders/view" : "/orders/view"}/${value}`)}
                    variant="ghost"
                    size="sm"
                    className="h-fit w-fit p-0"
                  >
                    <Eye className="h-4.5! w-4.5!" />
                  </Button>
                </CustomTooltip>
              )}
              {orderType === 'new' && (
                <>
                  <Button className="h-9 px-6">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <DropdownCustomMenu
                    menus={newActions(value)}
                    contentClassName="w-40"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {downloadingLabelId === value ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      ) : (
                        <MoreVertical className="h-4! w-4!" />
                      )}
                    </Button>
                  </DropdownCustomMenu>
                </>
              )}
              {(orderType === 'printed' || orderType === 'shipped') && (
                <DropdownCustomMenu
                  menus={printedAndShippedActions(value)}
                  contentClassName="w-40"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {(downloadingLabelId === value || updateToArchiveId === value) ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <MoreVertical className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownCustomMenu>
              )}
            </>)
            }
          </div >
        )
      }
    ]
  )
};
