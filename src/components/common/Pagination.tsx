import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import SelectComponent from '../ui/select';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';
import { FormSelect } from '@/features/orders/components/OrderFormUI';

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
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const siblingCount = 1;
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPageNumbers >= totalPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      for (let i = 1; i <= leftItemCount; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
      return pages;
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      pages.push(1);
      pages.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
      return pages;
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("px-4 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50 dark:border-zinc-900 bg-white/50 dark:bg-transparent", className)}>

      {/* <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50 dark:border-zinc-900 bg-white/50 dark:bg-transparent"> */}
      <span className="text-[12px] font-medium text-slate-500">
        Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} entries
      </span>
      {pageSizeInFooter && (
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-500 dark:text-zinc-400">Page size:</span>
          {/* <SelectComponent
            className='h-8 w-16'
            value={pageSize.toString()}
            onValueChange={(val) => val && onItemsPerPageChange(parseInt(val))}
            data={DEFAULT_PAGE_SIZES}
            placeholder="Select view"
          /> */}
          <FormSelect
            className='h-8 w-16'
            value={pageSize.toString()}
            onValueChange={(val) => val && onItemsPerPageChange(parseInt(val))}
            options={DEFAULT_PAGE_SIZES}
            placeholder="Select view"
          />
        </div>
      )}
      <div className="flex items-center gap-1.5">
        {/* First Page - Hidden on small screens */}
        <Button
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary dark:bg-zinc-800 dark:text-zinc-300 transition-colors border-none hidden md:inline-flex",
            currentPage === 1 && "opacity-40 pointer-events-none"
          )}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </Button>

        {/* Previous Page */}
        <Button
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary dark:bg-zinc-800 dark:text-zinc-300 transition-colors border-none",
            currentPage === 1 && "opacity-40 pointer-events-none"
          )}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, idx) => {
          if (pageNumber === '...') {
            return (
              <div
                key={`dots-${idx}`}
                className="h-8 w-8 hidden md:flex items-center justify-center text-xs font-semibold rounded-lg bg-slate-50 dark:bg-zinc-900/50 text-slate-400 dark:text-zinc-600 select-none"
              >
                ...
              </div>
            );
          }

          const isActive = pageNumber === currentPage;
          const isFirst = pageNumber === 1;
          const isLast = pageNumber === totalPages;
          return (
            <Button
              key={pageNumber}
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0 text-xs font-semibold rounded-lg transition-colors border-none",
                isActive
                  ? "bg-primary text-white hover:bg-primary/95"
                  : "bg-slate-100 hover:bg-primary/10 hover:text-primary dark:bg-zinc-800 dark:text-zinc-300",
                (!isActive && !isFirst && !isLast) && "hidden md:inline-flex"
              )}
              onClick={() => onPageChange(Number(pageNumber))}
            >
              {pageNumber}
            </Button>
          );
        })}

        {/* Next Page */}
        <Button
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary dark:bg-zinc-800 dark:text-zinc-300 transition-colors border-none",
            currentPage >= totalPages && "opacity-40 pointer-events-none"
          )}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          ›
        </Button>

        {/* Last Page - Hidden on small screens */}
        <Button
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary dark:bg-zinc-800 dark:text-zinc-300 transition-colors border-none hidden md:inline-flex",
            currentPage >= totalPages && "opacity-40 pointer-events-none"
          )}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          »
        </Button>

        {/* Mobile page indicator */}
        <span className="md:hidden text-xs font-medium text-slate-500 dark:text-zinc-400 ml-2">
          {currentPage} of {totalPages}
        </span>
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