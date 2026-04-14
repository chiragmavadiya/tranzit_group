import { Plus, Download, Upload, ChevronDown, ShoppingBag, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateOrderDialog from './CreateOrderDialog';

export function OrdersHeader() {
  const [orderDialogMode, setOrderDialogMode] = useState<'order' | 'return' | null>(null);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Orders</h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-1">Manage and track your customer orders across all channels.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium dark:text-zinc-300 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
        <Button variant="outline" className="gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-medium dark:text-zinc-300">
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none group px-3 h-8 rounded-lg flex items-center outline-none focus-visible:ring-0">
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
            <ChevronDown className="w-4 h-4 ml-0.5 opacity-70 group-aria-expanded:rotate-180 transition-transform duration-200" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl rounded-xl">
            <DropdownMenuItem
              className="gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 group transition-colors"
              onClick={() => setOrderDialogMode('order')}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 dark:text-zinc-100 text-[13px]">Create an order</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">Standard customer order</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:bg-orange-50 dark:focus:bg-orange-900/20 group transition-colors mt-1"
              onClick={() => setOrderDialogMode('return')}
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 dark:text-zinc-100 text-[13px]">Create a return order</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">Process order returns</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {orderDialogMode && (
          <CreateOrderDialog
            open={!!orderDialogMode}
            onOpenChange={(open: boolean) => !open && setOrderDialogMode(null)}
            type={orderDialogMode}
          />
        )}
      </div>
    </div>
  );
}
