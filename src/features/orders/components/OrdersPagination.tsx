import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectComponent from '@/components/ui/select';

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
    <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950 transition-colors">
      {/* Navigation on the Left */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center mx-2">
          <span className="text-[13px] font-medium text-gray-900 dark:text-zinc-100 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded">
            {currentPage}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(totalPages)}
          className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Page Size in the Center */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-gray-500 dark:text-zinc-400">Page size:</span>
        <SelectComponent
          className='h-8 w-16'
          value={itemsPerPage.toString()}
          onValueChange={(val) => val && onItemsPerPageChange(parseInt(val))}
          data={[
            { key: "25", value: "25" },
            { key: "50", value: "50" },
            { key: "75", value: "75" },
            { key: "100", value: "100" },
          ]}
          placeholder="Select view"
        />
      </div>

      {/* Item info on the Right */}
      <div className="text-[13px] text-gray-500 dark:text-zinc-400 font-medium">
        {totalFilteredItems > 0 ? (
          <>
            <span className="text-gray-900 dark:text-zinc-100">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-gray-900 dark:text-zinc-100">{Math.min(currentPage * itemsPerPage, totalFilteredItems)}</span> of <span className="text-gray-900 dark:text-zinc-100">{totalFilteredItems}</span> items
          </>
        ) : (
          "0 items"
        )}
      </div>
    </div>
  );
}

