import { NavLink } from "react-router-dom";
import type { Order } from "./types";
import type { Column } from "@/components/common/types/DataTable.types";

import { ArchiveRestore, Eye, Loader2, MoreVertical, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownCustomMenu } from "@/components/ui/dropdown-menu";
import { CustomTooltip } from "@/components/common/CustomTooltip";
import { SourceStatusBadge, StatusBadge } from "./components/StatusBadge";
import { formateCurrency } from "@/lib/utils";
import { canRestoreByPaymentStatus } from "./utils/order-details.utils";
import { AddressStatusBadge, AddressStatusIcon, dash } from "./components/address-validation/AddressStatusIcon";
import Favicon from '@/assets/favicon.png';
import { CustomerNameCell } from "./components/CustomerNameCell";
import type { PackingDocument } from "./services/orders.api";

export const getOrdersColumns = (
  role: string = "customer",
  orderType: string = 'new',
  navigate: any,
  customerEditClick: (id: string) => void,
  courierEditClick: (row: Order) => void,
  onDownloadLabel?: (orderId: string) => void,
  onCancelOrder?: (orderId: string) => void,
  downloadingLabelId?: string | null,
  fromCustomer: boolean = false,
  onArchiveOrder?: (orderId: string) => void,
  updateToArchiveId?: string | null,
  onPrint?: (orderNumber: string | number, amount: number, row: Order) => void,
  printingOrderId?: string | number | null,
  canReadWrite: boolean = true,
  onRestoreOrder?: (orderNumber: string) => void,
  restoringOrderId?: string | null,
  onDownloadPackingDocument?: (document: PackingDocument, orderNumbers: string[]) => void,
): Column<Order>[] => {
  const packingActions = (value: string) => [
    {
      label: "Print packing slip",
      onClick: () => onDownloadPackingDocument?.("packing-slip", [value]),
    },
    {
      label: "Print packing summary",
      onClick: () => onDownloadPackingDocument?.("packing-summary", [value]),
    },
  ]

  const printedAndShippedActions = (value: string, courier_code: string = "") => [
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
    ...packingActions(value),
    {
      label: courier_code === 'couriersplease' || Boolean(!courier_code) ? "Archived order" : "Cancel order",
      onClick: () => courier_code === 'couriersplease' || Boolean(!courier_code) ? onArchiveOrder?.(value) : onCancelOrder?.(value),
      // icon: Archive,
      variant: "destructive" as const,
      className: "text-red-600 dark:text-red-400 font-medium"
    }
  ]

  const newActions = (value: string) => [
    {
      label: "Consign order",
      onClick: () => navigate(`${role === "admin" ? "/admin/orders/consign" : "/orders/consign"}/${value}`),
      // icon: Eye,
    },
    // {
    //   label: "Cancel order",
    //   onClick: () => {
    //     onCancelOrder?.(value);
    //   },
    //   // variant: "destructive" as const,
    //   className: "font-medium hover:text"
    // },
    ...packingActions(value),
    {
      label: "Archive order",
      onClick: () => {
        onArchiveOrder?.(value);
      },
      variant: "destructive" as const,
      className: "text-red-600 dark:text-red-400 font-medium"
    },

  ]

  // The archived row carries a second action (Restore) for admins, so it needs more room.
  const showRestore = orderType === 'archived' && role === 'admin' && !fromCustomer && canReadWrite;
  const actionsWidth = orderType === "new" && !fromCustomer ? "160px" : showRestore ? "90px" : "50px";

  return (
    [
      {
        header: 'ORDER #',
        key: 'order_number',
        sticky: 'left',
        disableToggle: true,
        width: '110px',
        cell: (value: string) => (
          <NavLink to={`${role === "admin" ? "/admin" : ""}/orders/${(orderType === 'new' && !fromCustomer && canReadWrite) ? 'consign' : 'view'}/${value}`} className="font-medium text-primary underline">
            {value}
          </NavLink>
        )
      },
      {
        header: orderType === 'new' ? 'ORDER DATE' : 'SHIPPED',
        key: 'consignment_date',
        // width: '140px',
        className: 'break-normal',
        cell: (value: string) => value
      },
      {
        header: 'ORDER REF.',
        key: 'order_reference',
        // width: '140px',
      },
      {
        header: 'CUSTOMER',
        key: 'customer_name',
        width: "160px",
        cell: (value: string, row: Order) => (
          <CustomerNameCell
            value={value}
            row={row}
            isAdmin={role === 'admin'}
            orderType={orderType}
            customerEditClick={customerEditClick}
            fromCustomer={fromCustomer}
            canReadWrite={canReadWrite}
          />
        )
      },
      {
        header: 'SUBURB',
        key: 'suburb',
        // width: '120px',
        className: 'break-normal'
      },
      {
        header: 'ADDRESS',
        key: 'address_status',
        width: '120px',
        cell: (_value: string, row: Order) => (
          <AddressStatusBadge status={row.address_status} message={row.address_message} />
        )
      },
      {
        header: 'CARRIER & PRODUCT', key: 'courier',
        width: "180px",
        cell: (value: string, row: Order) => (
          <>
            {orderType === 'new' && canReadWrite ? (<div className="w-[calc(100%+12px)] flex gap-1 justify-between items-center uppercase font-semibold py-1 px-1.5 -mx-1.5 transition-all duration-250 border border-transparent group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 group-hover/row:bg-white dark:group-hover/row:bg-zinc-900 rounded-sm text-slate-800 dark:text-zinc-200">
              <div className="flex items-center gap-1 flex-1">
                {(row?.courier_logo || row?.courier_logo_url) && (
                  <div className="shrink-0">
                    <img src={row?.courier_logo || row?.courier_logo_url} className="h-6! max-w-[60px] object-contain" />
                  </div>
                )}
                <div className="whitespace-normal break-words font-normal text-slate-800 dark:text-zinc-200 leading-tight">
                  <span>{value && value !== 'unknown' ? value : '-'}</span>
                  {row.product_id && <span className="font-normal text-xs text-slate-500 dark:text-zinc-400"> - {row.product_id}</span>}
                </div>
              </div>
              <Pencil onClick={(e) => { e.stopPropagation(); courierEditClick(row); }} height={12} width={12} className="h-3! w-3! cursor-pointer text-primary opacity-0 group-hover/row:opacity-100 shrink-0 ml-auto" />
            </div>) : (
              <div className="flex items-center gap-1">
                {(row?.courier_logo || row?.courier_logo_url) && (
                  <div className="shrink-0">
                    <img src={row?.courier_logo || row?.courier_logo_url} className="h-6! min-w-[60px] object-contain" />
                  </div>
                )}
                <div className="whitespace-normal break-normal font-normal leading-tight text-slate-800 dark:text-zinc-200">
                  <span>{value && value !== 'unknown' ? value : '-'}</span>
                  {row.product_id && <span className="font-normal text-xs text-slate-500 dark:text-zinc-400"> - {row.product_id}</span>}
                </div>
              </div>
            )}
          </>
        )
      },

      // ...(orderType === 'new' ? [{
      //   header: 'STATUS', key: 'status', cell: (value: string) => <StatusBadge status={value === "Payment pending" ? "Courier not assign" : value} />
      // }] : []),
      ...((orderType !== 'new' && orderType !== 'printed') ? [{
        header: 'TRANSIT STATUS',
        key: 'tracking_status',
        // width: '150px',
        cell: (value: string) => <StatusBadge status={value} />
      }] : []),
      ...(orderType === 'archived' ? [{
        header: 'ORDER STATUS',
        key: 'status',
        // width: '150px',
        cell: (value: string) => <StatusBadge status={value === "Payment pending" ? "Courier not assign" : value} />
      }] : []),
      {
        header: 'AMOUNT',
        key: 'amount',
        // width: '100px',
        cell: (value: string) => <span className="font-medium"> {Number(value) === 0 ? '-' : formateCurrency(Number(value))}</span>
      },
      ...(orderType !== 'shipped' && orderType !== 'new' ? [{
        header: 'PAYMENT STATUS',
        key: 'payment_status',
        // width: '150px',
        cell: (value: string) => <StatusBadge status={value} />
      }] : []),
      {
        header: 'SOURCE / STATUS',
        key: 'order_type',
        width: '150px',
        cell: (value: string, row: Order) => (
          <div className="flex flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <CustomTooltip title={value}>
                <img src={row?.order_source_icon || Favicon} className="h-6 max-w-[70px] object-contain shrink-0" alt="" />
              </CustomTooltip>
              {!row?.order_source_icon && (
                <span className="capitalize truncate leading-tight">{value}</span>
              )}
            </div>
            {row?.fulfillment_status && row?.order_source_icon && <SourceStatusBadge status={row.fulfillment_status} />}
          </div>
        )
      },
      {
        header: "",
        key: "order_number",
        sticky: 'right',
        noPrint: true,
        disableToggle: true,
        width: actionsWidth,
        cell: (value: string, row: Order) => (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {fromCustomer || !canReadWrite ? (
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
                  {showRestore && canRestoreByPaymentStatus(row.payment_status) && (
                    <CustomTooltip title="Restore Order">
                      <Button
                        onClick={() => onRestoreOrder?.(value)}
                        disabled={restoringOrderId === value}
                        variant="ghost"
                        size="sm"
                        className="h-fit w-fit p-0 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      >
                        {restoringOrderId === value ? (
                          <Loader2 className="h-4.5! w-4.5! animate-spin" />
                        ) : (
                          <ArchiveRestore className="h-4.5! w-4.5!" />
                        )}
                      </Button>
                    </CustomTooltip>
                  )}
                </>
              )}
              {orderType === 'new' && (
                <>
                  {((role === 'admin' && !row.is_own_courier) || (role !== 'admin')) && (
                    <Button
                      className="h-8 px-4 font-normal"
                      onClick={() => onPrint?.(row.order_number, Number(row.amount), row)}
                      disabled={String(printingOrderId) === String(row.order_number)}
                    >
                      {String(printingOrderId) === String(row.order_number) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Printer className="h-4 w-4 mr-2" />
                      )}
                      Print
                    </Button>
                  )}
                  <DropdownCustomMenu
                    menus={newActions(value)}
                    contentClassName="w-52"
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
                  menus={printedAndShippedActions(value, row.courier_code)}
                  contentClassName="w-52"
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

export const getAddressCheckerColumns = (
  role: string = "customer",
  onUpdate: (orderNumber: string) => void,
): Column<Order>[] => [
    {
      header: 'ORDER #',
      key: 'order_number',
      sticky: 'left',
      width: '110px',
      cell: (value: string) => (
        <NavLink to={`${role === "admin" ? "/admin" : ""}/orders/consign/${value}`} className="font-medium text-primary underline">
          {value}
        </NavLink>
      ),
    },
    {
      header: 'ORDER DATE',
      key: 'consignment_date',
      className: 'break-normal',
    },
    {
      header: 'LOOK UP CONTACT',
      key: 'customer_name',
      width: '180px',
      cell: (value: string, row: Order) => (
        <span className="inline-flex items-center gap-1.5 uppercase font-medium">
          <AddressStatusIcon status={row.address_status} message={row.address_message} />
          {value || '-'}
        </span>
      ),
    },
    {
      header: 'STREET',
      key: 'address_street',
      cell: (value: string) => dash(value),
    },
    {
      header: 'SUBURB',
      key: 'suburb',
      cell: (value: string) => dash(value),
    },
    {
      header: 'POSTCODE',
      key: 'address_postcode',
      cell: (value: string) => dash(value),
    },
    {
      header: 'STATE',
      key: 'address_state',
      cell: (value: string) => dash(value),
    },
    {
      header: 'COUNTRY',
      key: 'address_country',
      cell: (value: string) => dash(value) === '-' ? 'Australia' : dash(value),
    },
    {
      header: 'SUGGESTED ADDRESS',
      key: 'address_suggestions',
      width: '200px',
      cell: (_value: string, row: Order) => {
        const [first, ...rest] = row.address_suggestions || [];
        if (!first) {
          return <span className="text-slate-400 dark:text-zinc-500">No suggestion</span>;
        }

        return (
          <div className="flex flex-col gap-0.5">
            <span className="uppercase font-medium text-emerald-700 dark:text-emerald-400">
              {first.suburb} {first.state} {first.postcode}
            </span>
            {rest.length > 0 && (
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                +{rest.length} more — use Update to pick
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: '',
      key: 'address_status',
      width: '110px',
      cell: (_value: string, row: Order) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 gap-1.5 font-semibold"
          onClick={() => onUpdate(row.order_number)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Update
        </Button>
      ),
    },
  ];
