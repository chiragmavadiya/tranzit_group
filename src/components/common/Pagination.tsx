import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SelectComponent from '../ui/select';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  pageSizeInFooter?: boolean;
}

// const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className,
  pageSizeInFooter = false,
}) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const onItemsPerPageChange = (val: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(val);
    }
  }
  return (
    <div className={cn("px-4 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50 dark:border-zinc-900 bg-white/50 dark:bg-transparent", className)}>

      {/* <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50 dark:border-zinc-900 bg-white/50 dark:bg-transparent"> */}
      <span className="text-[12px] font-medium text-slate-500">
        Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} entries
      </span>
      {pageSizeInFooter && (
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-500 dark:text-zinc-400">Page size:</span>
          <SelectComponent
            className='h-8 w-16'
            value={pageSize.toString()}
            onValueChange={(val) => val && onItemsPerPageChange(parseInt(val))}
            data={DEFAULT_PAGE_SIZES}
            placeholder="Select view"
          />
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-md" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-md" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white text-xs font-bold">
          {currentPage}
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-md" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-md" onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages}>
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
      {/* </div> */}
    </div>
  );
};

// Simple pagination component for basic use cases
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <span className="text-sm font-medium px-3">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};