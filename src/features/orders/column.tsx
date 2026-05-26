import { NavLink } from "react-router-dom";
import type { Order } from "./types";
import type { Column } from "@/components/common/types/DataTable.types";

import { Download, Eye, PackagePlus, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/common/CustomTooltip";
import { StatusBadge } from "./components/StatusBadge";
import { formatDate } from "date-fns";
import { formateCurrency } from "@/lib/utils";
import Favicon from '@/assets/favicon.png';
import { CustomerNameCell } from "./components/CustomerNameCell";

export const getOrdersColumns = (
  role: string = "customer",
  orderType: string = 'new',
  navigate: any,
  customerEditClick: (id: string) => void,
  onDownloadLabel?: (orderId: string) => void,
  onCancelOrder?: (orderId: string) => void,
  downloadingLabelId?: string | null,
): Column<Order>[] => [
    {
      header: 'ORDER #',
      key: 'order_number',
      className: 'text-primary font-bold',
      // sticky: 'left',
      cell: (value: string) => (
        <NavLink to={`${role === "admin" ? "/admin" : ""}/orders/${orderType === 'new' ? 'consign' : 'edit'}/${value}`} className="font-bold text-primary underline">
          {value}
        </NavLink>
      )

    },
    {
      header: orderType === 'new' ? 'ORDER DATE' : 'SHIPPED', key: 'consignment_date',
      width: '200px',
      cell: (value: string) => formatDate(value, 'dd/MM/yyyy hh:mm a')
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
        />
      )
    },
    {
      header: 'SUBURB', key: 'suburb', width: '140px'
    },
    {
      header: 'CARRIER & PRODUCT', key: 'courier',
      cell: (value: string, row: Order) => (
        <div className="flex items-center gap-1">
          {/* <img src={row?.courier_logo || 'https://api.tranzit.digisite.net/assets/img/couriers/direct-freight.png'} className="h-6" alt="" /> */}
          <img src={row?.courier_logo || 'https://api.tranzit.digisite.net/assets/img/couriers/logo-auspost.png'} className="h-6" alt="" />
          <span>{value}</span>
        </div>
      )
    },
    {
      header: 'STATUS', key: 'status', cell: (value: string) => <StatusBadge status={value === "Payment pending" ? "Courier not assign" : value} />
    },
    {
      header: 'AMOUNT', key: 'amount', cell: (value: string) => <span className="font-medium"> {formateCurrency(Number(value))}</span>
    },
    {
      header: 'PAYMENT STATUS', key: 'payment_status', cell: (value: string) => <StatusBadge status={value} />
    },
    {
      header: 'ORDER SOURCE', key: 'order_type',
      cell: (value: string) => (
        <div className="flex items-center gap-2">
          <img src={Favicon} className="h-4 w-4" alt="" />
          <span className="capitalize">{value}</span>
        </div>
      )
    },

    {
      header: "",
      key: "order_number",
      cell: (value: string) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
          {orderType === 'new' && (
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
          )}
          {orderType === 'printed' && (
            <>
              <CustomTooltip title={downloadingLabelId === value ? "Downloading..." : "Download Label"}>
                <Button
                  onClick={() => onDownloadLabel?.(value)}
                  variant="ghost"
                  size="sm"
                  className="h-fit w-fit p-0 group/button"
                  disabled={downloadingLabelId === value}
                >
                  {downloadingLabelId === value ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 text-primary" />
                  )}
                </Button>
              </CustomTooltip>
              <CustomTooltip title="Cancel Order">
                <Button
                  onClick={() => onCancelOrder?.(value)}
                  variant="ghost"
                  size="sm"
                  className="h-fit w-fit p-0 group/button"
                >
                  <Trash className="h-4 w-4 group-hover/button:text-destructive" />
                </Button>
              </CustomTooltip>
            </>
          )}
        </div>
      )
    }
  ];
