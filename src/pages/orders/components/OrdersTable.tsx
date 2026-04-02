import { useState, useMemo, type ReactNode } from 'react';
import { Package, MoreHorizontal, Settings2 } from 'lucide-react';
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Order } from '../types';
import { COLUMN_CONFIG } from '../constants';

const Badge = ({ variant, children }: { variant: Order['status'], children: ReactNode }) => {
  const styles = {
    New: 'bg-blue-100 text-blue-700 border-blue-200',
    Printed: 'bg-amber-100 text-amber-700 border-amber-200',
    Shipped: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Archived: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold border", styles[variant])}>
      {children}
    </span>
  );
};

interface OrdersTableProps {
  orders: Order[];
}

const DEFAULT_VISIBLE_COLUMNS = ['id_display', 'date', 'customer', 'type', 'status', 'total'];

export function OrdersTable({ orders }: OrdersTableProps) {
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
    <div className="flex-1 overflow-auto relative custom-scrollbar">
      <Table className="min-w-max">
        <TableHeader className="sticky top-0 z-20 bg-gray-50 shadow-sm border-b">
          <TableRow className="hover:bg-transparent border-b-0">
            {filteredColumns.map((col) => (
              <TableHead key={col.header} className={cn("text-xs font-bold text-gray-500 uppercase tracking-wider h-12 bg-gray-50", col.className)}>
                {col.header}
              </TableHead>
            ))}
            <TableHead className="text-right h-12 bg-gray-50 pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                  <Settings2 className="h-4 w-4 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {COLUMN_CONFIG.map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.key}
                        className="capitalize"
                        checked={visibleColumns.includes(col.key)}
                        onCheckedChange={() => toggleColumn(col.key)}
                      >
                        {col.header}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                {filteredColumns.map((col) => {
                  const value = order[col.key as keyof Order];
                  return (
                    <TableCell key={col.key} className={cn("py-4 text-sm text-gray-600", col.className)}>
                      {col.key === 'status' ? (
                        <Badge variant={value as Order['status']}>{value as string}</Badge>
                      ) : col.key === 'total' ? (
                        `$${(value as number).toFixed(2)}`
                      ) : col.key === 'print_button' ? (
                        <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">Print</Button>
                      ) : Array.isArray(value) ? (
                        <div className="flex gap-1">
                          {value.map((tag, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{tag}</span>
                          ))}
                        </div>
                      ) : (
                        value as string
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="text-right pr-4">
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={filteredColumns.length + 1} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                  <Package className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-500 font-medium text-lg">No orders found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
