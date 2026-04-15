import { useState, useMemo } from 'react';

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginationResult<T> {
  // Current state
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  
  // Pagination info
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Paginated data
  paginatedData: T[];
  
  // Actions
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setPageSize: (size: number) => void;
  
  // Pagination metadata
  getPageInfo: () => {
    from: number;
    to: number;
    total: number;
  };
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  // Controlled mode
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): PaginationResult<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    page: controlledPage,
    pageSize: controlledPageSize,
    onPageChange,
    onPageSizeChange,
  } = options;

  // Internal state for uncontrolled mode
  const [internalPage, setInternalPage] = useState(initialPage);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);

  // Use controlled or uncontrolled values
  const currentPage = controlledPage !== undefined ? controlledPage : internalPage;
  const currentPageSize = controlledPageSize !== undefined ? controlledPageSize : internalPageSize;

  // Calculate pagination values
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = Math.min(startIndex + currentPageSize, totalItems);
  
  // Paginated data
  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // Navigation helpers
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Action handlers
  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    
    if (onPageChange) {
      onPageChange(clampedPage);
    } else {
      setInternalPage(clampedPage);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  const handleSetPageSize = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      setInternalPageSize(size);
    }
    
    // Reset to first page when changing page size
    goToPage(1);
  };

  const getPageInfo = () => ({
    from: totalItems === 0 ? 0 : startIndex + 1,
    to: endIndex,
    total: totalItems,
  });

  return {
    // Current state
    currentPage,
    pageSize: currentPageSize,
    totalPages,
    totalItems,
    
    // Pagination info
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    
    // Paginated data
    paginatedData,
    
    // Actions
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setPageSize: handleSetPageSize,
    
    // Pagination metadata
    getPageInfo,
  };
}

// Utility hook for server-side pagination
export interface UseServerPaginationOptions {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function useServerPagination(options: UseServerPaginationOptions) {
  const { page, pageSize, total, onPageChange, onPageSizeChange } = options;

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const goToPage = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, totalPages));
    onPageChange(clampedPage);
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      goToPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      goToPage(page - 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  const handleSetPageSize = (size: number) => {
    onPageSizeChange(size);
    // Reset to first page when changing page size
    goToPage(1);
  };

  const getPageInfo = () => ({
    from: total === 0 ? 0 : startIndex + 1,
    to: endIndex,
    total,
  });

  return {
    // Current state
    currentPage: page,
    pageSize,
    totalPages,
    totalItems: total,
    
    // Pagination info
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    
    // Actions
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setPageSize: handleSetPageSize,
    
    // Pagination metadata
    getPageInfo,
  };
}