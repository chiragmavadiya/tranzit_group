import { useState } from 'react';
import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, getNestedValue } from '@/lib/utils';
import SelectComponent from '../ui/select';
import { usePagination } from './hooks/usePagination';
import { Pagination } from './Pagination';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';
import type { Column, DataTableProps, SortConfig } from './types/DataTable.types';

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey = 'id',
  // Selection
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  // Sorting
  sortable = true,
  sortConfig,
  onSort,
  // Pagination
  pagination = true,
  pageSizeInFooter = false,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  onPageSizeChange,
  // Search
  searchable = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  // Styling
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  // Loading and empty states
  loading = false,
  emptyMessage = 'No data found',
  loadingMessage = 'Loading...',
  // Row actions
  onRowClick,
  // Custom components
  customHeader,
  headerClass,
  customFooter
}: DataTableProps<T>) {
  // Internal state for uncontrolled components
  const [internalSearch, setInternalSearch] = useState('');
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([]);

  // Use controlled or uncontrolled values
  const currentSearch = searchValue !== undefined ? searchValue : internalSearch;
  const currentSortConfig = sortConfig !== undefined ? sortConfig : internalSortConfig;
  const currentSelectedRows = selectedRows !== undefined ? selectedRows : internalSelectedRows;

  // Get row identifier
  const getRowId = (row: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return String(row[rowKey]);
  };

  // Use pagination hook
  const paginationResult = usePagination(data, {
    initialPage: currentPage,
    initialPageSize: pageSize,
    page: currentPage,
    pageSize: pageSize,
    onPageChange,
    onPageSizeChange,
  });

  const {
    paginatedData,
    currentPage: paginationCurrentPage,
    pageSize: paginationPageSize,
    totalPages,
    totalItems: paginationTotalItems,
    goToPage,
    setPageSize: setPaginationPageSize,
  } = paginationResult;
  // Use paginated data or all data based on pagination setting
  const displayData = pagination ? paginatedData : data;
  const actualTotalItems = totalItems || paginationTotalItems;

  // Handlers
  const handleSort = (key: string) => {
    if (!sortable) return;

    const newDirection =
      currentSortConfig.key === key && currentSortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';

    const newSortConfig = { key, direction: newDirection as 'asc' | 'desc' };

    if (onSort) {
      onSort(key);
    } else {
      setInternalSortConfig(newSortConfig);
    }
  };

  const handleSearch = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
    // Reset to first page when searching
    goToPage(1);
  };

  const handleSelectAll = () => {
    const allIds = displayData.map(getRowId);
    const newSelection = currentSelectedRows.length === allIds.length ? [] : allIds;

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedRows(newSelection);
    }
  };

  const handleSelectRow = (rowId: string) => {
    const newSelection = currentSelectedRows.includes(rowId)
      ? currentSelectedRows.filter(id => id !== rowId)
      : [...currentSelectedRows, rowId];

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedRows(newSelection);
    }
  };

  const renderCell = (column: Column<T>, row: T, index: number) => {
    if (column.cell) {
      const value = column.accessor ? getNestedValue(row, column.accessor as string) : row[column.key];
      return column.cell(value, row, index);
    }

    const value = column.accessor ? getNestedValue(row, column.accessor as string) : row[column.key];
    return String(value || '-');
  };

  return (
    <div className={cn("flex flex-col group flex-1 min-h-0", className)}>
      {/* Header with search and controls */}
      {(searchable || customHeader) && (
        <div className={cn("flex items-center justify-between gap-4 p-4 border-b bg-gray-50/50 dark:bg-transparent relative", headerClass)}>
          <div className="flex items-center gap-2 ml-auto">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={currentSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-54 h-8"
                />
              </div>
            )}
            {pagination && !pageSizeInFooter && (
              <SelectComponent
                data={DEFAULT_PAGE_SIZES}
                value={paginationPageSize.toString()}
                placeholder="Select Page Size"
                className="w-[60px] h-8 text-xs font-bold"
                onValueChange={(value: string | null) => value && setPaginationPageSize(Number(value))}
              />
            )}
            {typeof customHeader === 'function' ? (customHeader as () => ReactNode)() : customHeader}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <Table className={cn("min-w-full", tableClassName)}>
          <TableHeader className={cn("bg-white dark:bg-zinc-950 sticky top-0 z-10", headerClassName)}>
            <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-zinc-800">
              {selectable && (
                <TableHead className="h-12 text-[14px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5">
                  <Checkbox
                    checked={currentSelectedRows.length === displayData.length && displayData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-12 text-[12px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5",
                    column.sortable !== false && sortable && "cursor-pointer hover:bg-muted/50",
                    column.sticky === 'left' && "sticky left-0 bg-background z-20",
                    column.sticky === 'right' && "sticky right-0 bg-background z-20",
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortable && column.sortable !== false && currentSortConfig.key === column.key && (
                      currentSortConfig.direction === 'asc'
                        ? <ArrowUp className="w-4 h-4" />
                        : <ArrowDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-32 text-center"
                >
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = currentSelectedRows.includes(rowId);

                return (
                  <TableRow
                    key={rowId}
                    className={cn(
                      "group/row bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors",
                      isSelected && "bg-muted",
                      onRowClick && "cursor-pointer",
                      typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {selectable && (
                      <TableCell className="px-5 py-3.5 text-xs font-medium text-gray-700 dark:text-zinc-300">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(rowId)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          `px-5 py-3.5 text-xs font-medium text-gray-700 dark:text-zinc-300`,
                          column.sticky === 'left' && "sticky left-0 bg-background",
                          column.sticky === 'right' && "sticky right-0 bg-background",
                          column.className,
                          cellClassName
                        )}
                      >
                        {renderCell(column, row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && !loading && displayData.length > 0 && (
        <Pagination
          currentPage={paginationCurrentPage}
          totalPages={totalPages}
          pageSize={paginationPageSize}
          totalItems={actualTotalItems}
          onPageChange={goToPage}
          onPageSizeChange={setPaginationPageSize}
          className="border-t"
          pageSizeInFooter={pageSizeInFooter}
        />
      )}

      {/* Custom Footer */}
      {typeof customFooter === 'function' ? (customFooter as () => ReactNode)() : customFooter}
    </div>
  );
}