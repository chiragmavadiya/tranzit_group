import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalFilteredItems: number;
  onItemsPerPageChange: (value: number) => void;
}

export function OrdersPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalFilteredItems,
  onItemsPerPageChange,
}: OrdersPaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50 transition-colors">
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-500 dark:text-zinc-400">
          Showing <span className="font-semibold text-gray-900 dark:text-zinc-100">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-zinc-100">{Math.min(currentPage * itemsPerPage, totalFilteredItems)}</span> of <span className="font-semibold text-gray-900 dark:text-zinc-100">{totalFilteredItems}</span> orders
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">Rows per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(val) => val && onItemsPerPageChange(parseInt(val))}
          >
            <SelectTrigger className="h-8 w-18 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[25, 50, 75, 100].map(size => (
                <SelectItem key={size} value={size.toString()} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-3 gap-1 border-gray-200 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {(() => {
            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
              startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            const pages = [];
            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  className={cn(
                    "w-8 h-8 rounded-md text-sm font-medium transition-colors",
                    currentPage === i
                      ? "bg-blue-600 dark:bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}

          {totalPages > 5 && currentPage + 2 < totalPages && (
            <>
              <span className="text-gray-400 dark:text-zinc-600 px-1">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 rounded-md text-sm font-medium transition-colors text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-3 gap-1 border-gray-200 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
