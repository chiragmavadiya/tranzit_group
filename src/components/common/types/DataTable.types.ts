import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: keyof T | string;
  cell?: (value: any, row: T, index: number) => ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  className?: string;
  sticky?: 'left' | 'right';
  hidden?: boolean;
}

export interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc' | null;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  // Row identification
  rowKey?: keyof T | ((row: T) => string);
  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedRows: string[]) => void;
  // Sorting
  sortable?: boolean;
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  // Pagination
  pagination?: boolean;
  pageSizeInFooter?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Search
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Column management
  columnSettings?: boolean;
  defaultVisibleColumns?: string[];
  onColumnVisibilityChange?: (visibleColumns: string[]) => void;
  // Styling
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  cellClassName?: string;
  // Loading and empty states
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  // Row actions
  onRowClick?: (row: T, index: number) => void;
  // Custom components
  customHeader?: ReactNode | (() => ReactNode);
  headerClass?: string;
  headerTitle?: string;
  headerDescription?: string;
  customFooter?: ReactNode | (() => ReactNode);
  onExport?: (type: "pdf" | "excel" | "print" | "csv") => void;
  isExporting?: boolean;
}

// Common cell renderer types
export type CellRenderer<T> = (value: any, row: T, index: number) => ReactNode;

// Predefined column types for common use cases
export interface ActionColumn<T> extends Omit<Column<T>, 'cell'> {
  cell: (value: any, row: T, index: number) => ReactNode;
}

export interface StatusColumn<T> extends Omit<Column<T>, 'cell'> {
  cell?: (value: string, row: T, index: number) => ReactNode;
  statusConfig?: Record<string, { className: string; label?: string }>;
}

export interface LinkColumn<T> extends Omit<Column<T>, 'cell'> {
  cell?: (value: any, row: T, index: number) => ReactNode;
  href?: string | ((row: T) => string);
  onClick?: (row: T, index: number) => void;
}