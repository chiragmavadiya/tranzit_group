import { useState, useMemo, memo } from 'react';
import type { MouseEvent, ReactNode } from 'react'
import { ArrowUp, ArrowDown, Search, Settings } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn, getNestedValue } from '@/lib/utils';
import { usePagination } from './hooks/usePagination';
import { Pagination } from './Pagination';
import { TableSkeleton } from './TableSkeleton';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';
import type { Column, DataTableProps, SortConfig } from './types/DataTable.types';
import DropdownCustomContent from '../ui/dropdown-menu';
import { CustomLabel, FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { ExportMenu } from './ExportMenu';
import useLocalStorage from '@/hooks/useLocalStorage';

const DataTableComponent = <T extends Record<string, any>>(props: DataTableProps<T>) => {
  const {
    data,
    columns,
    rowKey = 'id',
    // Selection
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    selectOnRowClick = false,
    // Sorting
    sortable = false,
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
    // Column management
    moduleName,
    // Styling
    className,
    tableClassName,
    headerClassName,
    rowClassName,
    cellClassName,
    // Loading and empty states
    loading = false,
    emptyMessage = 'No data found',
    // Row actions
    onRowClick,
    // Custom components
    header = true,
    customHeader,
    headerPosition = 'right',
    headerTitle,
    headerDescription,
    headerClass,
    customFooter,
    onExport,
    isExporting,
    exportable = true,
    print = true
  } = props;
  // Internal state for uncontrolled components
  const [internalSearch, setInternalSearch] = useState('');
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([]);
  const [colDropdownOpen, setColDropdownOpen] = useState(false);
  // Persist the hidden keys rather than the visible ones, so a column added in a later
  // release shows up by default instead of disappearing for users who already saved a
  // preference. Without a moduleName the toggles stay session-only, as before.
  const [hiddenColumns, setHiddenColumns] = useLocalStorage<string[]>(
    moduleName ? `${moduleName}_hidden_columns` : '',
    []
  );

  // Checkbox edits are staged here and only reach the table on Apply.
  const [draftHiddenColumns, setDraftHiddenColumns] = useState<string[]>(hiddenColumns);

  const visible = columns.filter(c => !hiddenColumns.includes(c.key));
  // Fall back to everything if a stale preference would hide the entire table.
  const visibleColumns = visible.length ? visible : columns;
  const draftVisibleColumns = columns.filter(c => !draftHiddenColumns.includes(c.key));

  // Looked up once per render instead of an indexOf scan per header and per cell,
  // which was O(columns) inside a loop over every cell of every row.
  const columnIndexes = useMemo(() => new Map(columns.map((c, i) => [c, i])), [columns]);

  const handleColDropdownOpenChange = (open: boolean) => {
    // Re-sync on open so a draft the user walked away from doesn't linger.
    if (open) setDraftHiddenColumns(hiddenColumns);
    setColDropdownOpen(open);
  };

  const handleToggleColumn = (columnKey: string) => {
    const isHidden = draftHiddenColumns.includes(columnKey);
    // Always leave at least one column on screen.
    if (!isHidden && draftVisibleColumns.length <= 1) return;

    setDraftHiddenColumns(
      isHidden
        ? draftHiddenColumns.filter(k => k !== columnKey)
        : [...draftHiddenColumns, columnKey]
    );
  };

  const handleApplyColumns = () => {
    setHiddenColumns(draftHiddenColumns);
    setColDropdownOpen(false);
  };

  // Reset takes effect immediately — it does not wait for Apply — and closes like Apply.
  const handleResetColumns = () => {
    setColDropdownOpen(false);
    setDraftHiddenColumns([]);
    setHiddenColumns([]);
  };

  const renderedColumns = columns.length > 7 ? visibleColumns : columns;
  const columnSettingsMenu = (
    <DropdownCustomContent
      open={colDropdownOpen}
      onOpenChange={handleColDropdownOpenChange}
      triggerClassName="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors cursor-pointer outline-none"
      contentClassName="border border-gray-200 dark:border-zinc-800 shadow-lg"
      content={
        <div
          className="flex flex-col max-h-[340px] p-2 bg-white dark:bg-zinc-950 text-gray-800 dark:text-zinc-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
            Toggle Columns
          </div>
          <div className="h-px my-1 bg-gray-100 dark:bg-zinc-800" />
          <div className="flex flex-col min-h-0 overflow-y-auto">
            {columns.filter((c) => !c.disableToggle).map((col) => {
              const isChecked = draftVisibleColumns.some(c => c.key === col.key);
              const isDisabled = isChecked && draftVisibleColumns.length <= 1;
              return (
                <div
                  key={col.key}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer text-sm font-medium transition-colors select-none",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!isDisabled) {
                      handleToggleColumn(col.key);
                    }
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => {
                      if (!isDisabled) {
                        handleToggleColumn(col.key);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={isDisabled}
                  />
                  <span className="truncate">{col.header || col.key}</span>
                </div>
              );
            })}
          </div>
          <div className="h-px my-1 bg-gray-100 dark:bg-zinc-800" />
          <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetColumns}
              disabled={!draftHiddenColumns.length && !hiddenColumns.length}
            >
              Reset
            </Button>
            <Button size="sm" onClick={handleApplyColumns}>
              Apply
            </Button>
          </div>
        </div>
      }
    >
      <Settings className="w-4 h-4" />
    </DropdownCustomContent>
  );

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
    totalItems,
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
  // If totalItems is provided, we assume server-side pagination so we don't slice the data again
  const displayData = pagination
    ? (totalItems !== undefined ? data : paginatedData)
    : data;
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

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, row: T, rowId: string, index: number) => {
    onRowClick?.(row, index);
    if (!selectable || !selectOnRowClick) return;
    // The row's own controls act on their own — they must not also toggle the selection.
    if ((event.target as Element).closest('a, button, input, select, textarea, [role="menuitem"]')) return;
    handleSelectRow(rowId);
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
      {header && (
        <div className={cn(
          "flex flex-col lg:flex-row w-full border-b justify-between gap-3 px-4 py-3 lg:items-center min-h-[3.5rem] h-auto print:hidden",
          headerClass?.replace(/\bh-\d+\b/g, '')
        )}>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-gray-800 dark:text-zinc-200 my-0">
              {headerTitle}
            </h1>
            {headerDescription && (
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-0">
                {typeof headerDescription === 'function' ? headerDescription() : headerDescription}
              </p>
            )}
          </div>
          {/* Header with search and controls */}
          {(searchable || customHeader) && (
            <div className="flex flex-wrap items-center gap-3 relative print:hidden w-full lg:w-auto justify-start lg:justify-end lg:ml-auto">
              {headerPosition === 'left' && customHeader && (
                <div className="w-full sm:w-auto">
                  {typeof customHeader === 'function' ? (customHeader as () => ReactNode)() : customHeader}
                </div>
              )}

              {/* Page Size & Export Row */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                {pagination && !pageSizeInFooter && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CustomLabel label="Show:" required={false} />
                    <FormSelect
                      className="w-[90px] h-8 text-xs font-bold"
                      value={pageSize.toString()}
                      onValueChange={(value: string | null) => value && setPaginationPageSize(Number(value))}
                      options={DEFAULT_PAGE_SIZES}
                      placeholder="Select Page Size"
                      allowClear={false}
                      searchdisable
                    />
                  </div>
                )}
                {exportable && data.length > 0 && (
                  <div className="shrink-0">
                    <ExportMenu
                      onExport={onExport}
                      isExporting={isExporting}
                      print={print}
                    />
                  </div>
                )}
              </div>

              {searchable && (
                <FormInput
                  placeholder={searchPlaceholder}
                  value={currentSearch}
                  onChange={handleSearch}
                  icon={Search}
                  className="w-full sm:w-62 h-8"
                />
              )}

              {headerPosition === 'right' && customHeader && (
                <div className="w-full sm:w-auto">
                  {typeof customHeader === 'function' ? (customHeader as () => ReactNode)() : customHeader}
                </div>
              )}
            </div>
          )}
        </div>)}

      {/* Table */}
      <div className="flex-1 min-h-[200px] overflow-auto">
        <Table className={cn("min-w-full", tableClassName)}>
          <TableHeader className={cn("bg-white dark:bg-zinc-950 sticky top-0 z-10 shadow-sm", headerClassName)}>
            <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-zinc-800">
              {selectable && (
                <TableHead
                  className="sticky left-0 z-20 bg-white dark:bg-zinc-950 h-9 text-[14px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wide px-5 pr-3! print:hidden border-b border-gray-100 dark:border-zinc-800"
                  style={{ minWidth: '50px', width: '50px', maxWidth: '50px' }}
                >
                  <Checkbox
                    checked={currentSelectedRows.length === displayData.length && displayData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}

              {renderedColumns.map((column, index) => {
                const originalIndex = columnIndexes.get(column) ?? -1;
                return (
                  <TableHead
                    key={`${column.key}-${originalIndex}`}
                    className={cn(
                      "py-2 whitespace-normal break-normal text-[13px] xl:text-sm font-bold text-gray-900 dark:text-zinc-100 capitalize tracking-wide px-3",
                      column.sortable !== false && sortable && "cursor-pointer hover:bg-muted/50",
                      column.sticky === 'left' && "sticky bg-white dark:bg-zinc-950 z-20 shadow-[inset_-1px_0_0_0_#ebe6e7] dark:shadow-[inset_-1px_0_0_0_#27272a]",
                      column.sticky === 'left' ? selectable ? 'left-[50px]' : 'left-0' : '',
                      column.sticky === 'right' && "sticky right-0 bg-white dark:bg-zinc-950 z-20 shadow-[inset_1px_0_0_0_#ebe6e7] dark:shadow-[inset_1px_0_0_0_#27272a]",
                      column.className,
                      column.noPrint && 'print:hidden'
                    )}
                    style={{ minWidth: column.width }}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      {column.header && <div className="flex items-center gap-2">
                        {column.header}
                        {sortable && column.sortable !== false && currentSortConfig.key === column.key && (
                          currentSortConfig.direction === 'asc'
                            ? <ArrowUp className="w-4 h-4" />
                            : <ArrowDown className="w-4 h-4" />
                        )}
                      </div>}
                      {columns.length > 7 && index === renderedColumns.length - 1 && (
                        <div onClick={(e) => e.stopPropagation()} className="ml-auto flex items-center print:hidden">
                          {columnSettingsMenu}
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton columns={renderedColumns.length} selectable={selectable} rows={pageSize} />
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={renderedColumns.length + (selectable ? 1 : 0)}
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
                      "group/row border-b border-gray-100 dark:border-zinc-800 transition-colors",
                      isSelected
                        ? "bg-slate-100 dark:bg-zinc-900"
                        : "bg-white dark:bg-zinc-950 hover:bg-primary/5 dark:hover:bg-primary/10",
                      (onRowClick || (selectable && selectOnRowClick)) && "cursor-pointer",
                      typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName
                    )}
                    aria-selected={selectable ? isSelected : undefined}
                    onClick={(event) => handleRowClick(event, row, rowId, index)}
                  >
                    {selectable && (
                      <TableCell className={cn(
                        "sticky left-0 z-[2] px-2 pl-5 py-[5px] text-sm font-medium text-gray-700 dark:text-zinc-300 print:hidden transition-colors",
                        isSelected
                          ? "bg-slate-100 dark:bg-zinc-900"
                          : "bg-white dark:bg-zinc-950 group-hover/row:bg-slate-50 dark:group-hover/row:bg-zinc-900/50"
                      )}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(rowId)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}

                    {renderedColumns.map((column) => {
                      const originalIndex = columnIndexes.get(column) ?? -1;
                      return (
                        <TableCell
                          key={`${column.key}-${rowId}-${originalIndex}`}
                          className={cn(
                            `px-3 break-normal py-[6px] min-h-12 text-[13px] xl:text-sm text-gray-800 dark:text-zinc-300 whitespace-normal transition-colors`,
                            column.sticky === 'left' && cn(
                              "sticky left-0 shadow-[inset_-1px_0_0_0_#ebe6e7] dark:shadow-[inset_-1px_0_0_0_#27272a]",
                              isSelected
                                ? "bg-slate-100 dark:bg-zinc-900"
                                : "bg-white dark:bg-zinc-950 group-hover/row:bg-slate-50 dark:group-hover/row:bg-zinc-900/50"
                            ),
                            column.sticky === 'left' ? selectable ? 'left-[50px] z-[2]' : 'left-0 z-[2]' : '',

                            column.sticky === 'right' && cn(
                              "sticky right-0 z-[2] shadow-[inset_1px_0_0_0_#ebe6e7] dark:shadow-[inset_1px_0_0_0_#27272a]",
                              isSelected
                                ? "bg-slate-100 dark:bg-zinc-900"
                                : "bg-white dark:bg-zinc-950 group-hover/row:bg-slate-50 dark:group-hover/row:bg-zinc-900/50"
                            ),
                            isSelected && "font-semibold",
                            column.className,
                            cellClassName,
                            column.noPrint && 'print:hidden'
                          )}
                          style={{ minWidth: column.width }}
                        >
                          {renderCell(column, row, index)}
                        </TableCell>
                      );
                    })}
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
          className="border-t print:hidden"
          pageSizeInFooter={pageSizeInFooter}
        />
      )}

      {/* Custom Footer */}
      {typeof customFooter === 'function' ? (customFooter as () => ReactNode)() : customFooter}
    </div>
  );
};

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;