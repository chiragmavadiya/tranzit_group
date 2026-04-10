import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MoreHorizontal, Settings2, Eye, Truck, CheckCircle2, ArrowUp, ArrowDown, Trash } from 'lucide-react';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import Dropdown, {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { cn, getNestedValue } from '@/lib/utils';
import type { Order } from '../types';
import { COLUMN_CONFIG } from '../constants';
import { ColumnSettings } from './ColumnSettings';
import { Checkbox } from '@/components/ui/checkbox';

const OrderActionMenu = ({ order }: { order: Order }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors outline-none">
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" className="z-50 min-w-40 p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900">
          <DropdownMenuItem
            className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
            onClick={() => navigate(`/orders/${searchParams.get('type') || 'new'}/${order.order_number}`)}
          >
            <Eye className="w-4 h-4 mr-2.5 text-gray-400" />
            <span className="text-sm font-medium">View order</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 mt-0.5">
            <Truck className="w-4 h-4 mr-2.5 text-gray-400" />
            <span className="text-sm font-medium">Consign</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 mt-0.5">
            <Trash className="w-4 h-4 mr-2.5 text-gray-400" />
            <span className="text-sm font-medium ">Delete Order</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

interface OrdersTableProps {
  orders: Order[];
  sortConfig: {
    key: string | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (key: string) => void;
}

const DEFAULT_VISIBLE_COLUMNS = [
  'order_number',
  'created_at',
  'receiver_payload.name',
  'receiver_payload.company',
  'receiver_payload.state',
  'receiver_payload.country'
];

export function OrdersTable({ orders, sortConfig, onSort }: OrdersTableProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredColumns = useMemo(() => {
    return COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  const toggleAll = () => {
    if (selectedRows.length === orders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(orders.map(o => o.order_number));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="flex-1 overflow-auto relative custom-scrollbar border rounded-lg bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 z-0">
      <Table className={cn("min-w-max border-separate border-spacing-0", orders.length === 0 && "h-full")}>
        <TableHeader className="sticky top-0 bg-white dark:bg-zinc-900 border-b z-1">
          <TableRow className="hover:bg-transparent border-b-0">
            {/* Checkbox Header */}
            <TableHead className="w-12 h-10 px-4 border-r border-gray-200 dark:border-zinc-800 text-center sticky left-0 z-30 bg-white dark:bg-zinc-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              <Checkbox
                checked={selectedRows.length === orders.length && orders.length > 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>

            {filteredColumns.map((col) => {
              const isOrderNumber = col.key === 'order_number';
              return (
                <TableHead
                  key={col.key}
                  className={cn(
                    "h-10 px-4 dark:border-zinc-800 text-[11px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors",
                    isOrderNumber && "sticky left-[48px] z-30 bg-white dark:bg-zinc-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r",
                    col.className
                  )}
                  onClick={() => onSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
              );
            })}

            {/* Gear Icon Header */}
            <TableHead className="w-10 h-10 px-2 text-center sticky right-0 bg-white dark:bg-zinc-900 z-30 border-l border-gray-200 dark:border-zinc-800">
              <Dropdown
                content={<ColumnSettings
                  columns={COLUMN_CONFIG}
                  visibleColumns={visibleColumns}
                  onToggleColumn={toggleColumn}
                  onSetVisibleColumns={setVisibleColumns}
                />}
              >
                <Settings2 className="h-4 w-4 text-blue-500" />
              </Dropdown>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={cn(orders.length === 0 && "h-full")}>
          {orders.length > 0 ? (
            orders.map((order, idx) => (
              <TableRow
                key={order.order_number}
                className={cn(
                  "hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group transition-all",
                  idx % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900/40" : "bg-white dark:bg-zinc-950"
                )}
              >
                {/* Row Checkbox */}
                <TableCell className="z-0 w-12 px-4 border-r border-gray-200 dark:border-zinc-800 text-center sticky left-0 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <Checkbox
                    checked={selectedRows.includes(order.order_number)}
                    onCheckedChange={() => toggleRow(order.order_number)}
                  />
                </TableCell>

                {filteredColumns.map((col) => {
                  const value = getNestedValue(order, col.key);
                  const isOrderNumber = col.key === 'order_number';

                  return (
                    <TableCell
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-[13px] dark:border-zinc-800 whitespace-nowrap",
                        isOrderNumber ? "z-0 text-blue-600 font-bold hover:underline cursor-pointer sticky left-[48px] bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r" : "text-gray-700 dark:text-zinc-300",
                        col.className
                      )}
                      onClick={() => col.key === 'order_number' && navigate(`/orders/${searchParams.get('tab') || 'new'}/${order.order_number}`)}
                    >
                      {col.key.includes('name') || col.key === 'customer' ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{String(value || "-")}</span>
                        </div>
                      ) : col.key === 'source' ? (
                        // diplay value as html
                        <div dangerouslySetInnerHTML={{ __html: value }} />
                      ) : (
                        String(value || "-")
                      )}
                    </TableCell>
                  );
                })}

                {/* Row Actions */}
                <TableCell className="w-10 px-2 text-center sticky right-0 transition-colors z-0 border-l border-gray-200 dark:border-zinc-800 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] bg-inherit">
                  <OrderActionMenu order={order} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="h-full hover:bg-transparent">
              <TableCell colSpan={filteredColumns.length + 2} className="h-full text-center text-gray-500">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

