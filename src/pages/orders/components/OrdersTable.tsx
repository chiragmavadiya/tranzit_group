import { useState, useMemo, type ReactNode } from 'react';
import { Package, MoreHorizontal, Settings2, Eye, Truck, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MOCK_DATA_TYPE } from '../types';
import { COLUMN_CONFIG, Order_status_styles } from '../constants';
import { ColumnSettings } from './ColumnSettings';

const Badge = ({ variant, children, border }: { variant: MOCK_DATA_TYPE['status'] | MOCK_DATA_TYPE['Payment_Status'], children: ReactNode, border?: boolean }) => {
  return (
    // if border is false then bg is transperent
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", Order_status_styles[variant], border ? "border" : "bg-transparent")}>
      {children}
    </span>
  );
};

const PreIcon = {
  'Shopify': 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
  'Woocommerce': 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg',
}

const PrefixedIcon = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      {PreIcon[children as keyof typeof PreIcon] && <img src={PreIcon[children as keyof typeof PreIcon]} alt="shopify" className="w-4 h-4 text-gray-500 dark:text-zinc-400" />}
      {children}
    </div>
  );
};

const OrderActionMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer outline-none">
        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" sideOffset={5} className="z-50 min-w-40 p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900">
          <DropdownMenuItem className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 group/item">
            <Eye className="w-4 h-4 mr-2.5 text-gray-400 dark:text-zinc-500 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors" />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-200">View order</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 group/item mt-0.5">
            <Truck className="w-4 h-4 mr-2.5 text-gray-400 dark:text-zinc-500 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors" />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-200">Consign</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}

interface OrdersTableProps {
  orders: MOCK_DATA_TYPE[];
  sortConfig: {
    key: string | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (key: string) => void;
}

// const DEFAULT_VISIBLE_COLUMNS = ['id_display', 'date', 'customer', 'type', 'status', 'total'];
const DEFAULT_VISIBLE_COLUMNS = ['customer', 'id_display', 'Suburb', 'amount', 'status', 'Payment_Status', 'courier', 'Order_Type'];


export function OrdersTable({ orders, sortConfig, onSort }: OrdersTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);

  const filteredColumns = useMemo(() => {
    return COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="flex-1 overflow-auto relative custom-scrollbar min-h-0">
      <Table className={cn("min-w-max", orders.length === 0 && "h-full")}>
        <TableHeader className="sticky top-0 z-20 bg-gray-50 dark:bg-zinc-900 shadow-sm border-b dark:border-zinc-800">
          <TableRow className="hover:bg-transparent border-b-0">
            {filteredColumns.map((col) => (
              <TableHead
                key={col.header}
                className={cn(
                  "text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider h-12 bg-gray-50 dark:bg-zinc-900 cursor-pointer hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 transition-colors group/head",
                  col.className
                )}
                onClick={() => onSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.header}
                  <div className={cn(
                    "transition-all duration-200",
                    sortConfig.key === col.key ? "opacity-100 text-blue-600 dark:text-blue-400 scale-110" : "opacity-0 group-hover/head:opacity-50"
                  )}>
                    {sortConfig.key === col.key ? (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right h-12 w-4 bg-gray-50 dark:bg-zinc-900 pr-4 sticky right-0 z-30 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] border-l dark:border-zinc-800">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-6 p-0">
                  <Settings2 className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-0 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-xl z-50">
                    <ColumnSettings
                      visibleColumns={visibleColumns}
                      onToggleColumn={toggleColumn}
                      onSetVisibleColumns={setVisibleColumns}
                    />
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={cn(orders.length === 0 && "h-full")}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id_display} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group border-b dark:border-zinc-800">
                {/* in status if Courier Not Assigned then display text in red border and red text and if Payment Pending then display text in orange border and orange text and if Paid then display text in green border and green text */}
                {filteredColumns.map((col) => {
                  const value = order[col.key as keyof MOCK_DATA_TYPE];
                  return (
                    <TableCell key={col.key} className={cn("py-4 text-sm text-gray-600 dark:text-zinc-300", col.className)}>
                      {col.key === 'status' || col.key === 'Payment_Status' ? (
                        <Badge variant={value as MOCK_DATA_TYPE['status'] | MOCK_DATA_TYPE['Payment_Status']} border={col.key === 'status'} >{value as string}</Badge>
                      ) : col.key === "Order_Type" ? (
                        <PrefixedIcon>{value as string}</PrefixedIcon>
                      ) :
                        col.key === 'print_button' ? (
                          <Button variant="outline" size="sm" className="h-7 text-[10px] px-2 dark:border-zinc-700 dark:hover:bg-zinc-800">Print</Button>
                        ) : Array.isArray(value) ? (
                          <div className="flex gap-1">
                            {value.map((tag, i) => (
                              <span key={i} className="text-[10px] bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-zinc-400">{tag}</span>
                            ))}
                          </div>
                        ) : (
                          value as string || "-"
                        )}
                    </TableCell>
                  );
                })}
                <TableCell className="text-right pr-4 sticky right-0 bg-white/95 dark:bg-zinc-950/95 group-hover:bg-gray-50/95 dark:group-hover:bg-zinc-900/95 transition-colors z-10 border-l dark:border-zinc-800 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <OrderActionMenu />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="h-full hover:bg-transparent border-0">
              <TableCell colSpan={filteredColumns.length + 1} className="h-full align-middle text-center">
                <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                  <Package className="w-12 h-12 text-gray-300 dark:text-zinc-700 pointer-events-none" />
                  <p className="text-gray-500 dark:text-zinc-400 font-medium text-lg">No orders found</p>
                  <p className="text-gray-400 dark:text-zinc-500 text-sm text-center px-4">Try adjusting your filters or search terms.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
