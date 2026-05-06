import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/common";
import { useAdminInvoices, useExportAdminInvoices } from "@/features/invoices/hooks/useInvoices";
import { useOrders, useExportOrders } from "@/features/orders/hooks/useOrders";
import { useDebounce } from "@/hooks/useDebounce";

interface DashboardTableProps<T> {
  title: string;
  subtitle: string;
  role: 'admin' | 'customer';
  columns: Column<T>[];
  className?: string;
  pageSize?: number;
}

export function DashboardTable<T extends { id: number }>({
  title,
  subtitle,
  role,
  className,
  columns,
  pageSize: initialPageSize = 25
}: DashboardTableProps<T>) {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const debouncedSearch = useDebounce(search, 500);

  // Memoized params for API hooks
  const params = useMemo(() => ({
    search: debouncedSearch,
    page: page,
    per_page: pageSize,
    // Dashboard usually shows pending/recent activity
    ...(role === 'admin' ? { status: 'pending' } : {})
  }), [debouncedSearch, page, pageSize, role]);

  // Data fetching hooks
  const adminQuery = useAdminInvoices(params, role === 'admin');
  const customerQuery = useOrders(params, role === 'customer');

  // Export hooks
  const adminExport = useExportAdminInvoices();
  const customerExport = useExportOrders();

  // Select the active query based on role
  const activeQuery = role === 'admin' ? adminQuery : customerQuery;
  
  // Extract data and total count safely
  const tableData = (activeQuery.data?.data || []) as unknown as T[];
  const totalItems = (activeQuery.data as any)?.meta?.total || tableData.length;
  const isLoading = activeQuery.isLoading;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); // Reset to first page on search
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleExport = (format: string) => {
    if (role === 'admin') {
      adminExport.mutate({
        format,
        search: debouncedSearch,
        // Match the dashboard view filters if any specific ones are applied
      });
    } else {
      customerExport.mutate({
        format: format as any,
        search: debouncedSearch,
      });
    }
  };

  const isExporting = adminExport.isPending || customerExport.isPending;

  return (
    <Card className={cn("border gap-0 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden group transition-colors duration-300 p-0", className)}>
      <CardContent className="p-0 bg-white dark:bg-zinc-950 flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 h-[450px]">
          <DataTable
            data={tableData}
            columns={columns}
            rowKey="id"
            searchable
            searchValue={search}
            onSearchChange={handleSearchChange}
            pagination
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={handlePageSizeChange}
            currentPage={page}
            totalItems={totalItems}
            headerTitle={title}
            headerDescription={subtitle}
            className='pb-3'
            loading={isLoading}
            onExport={handleExport}
            isExporting={isExporting}
            exportable={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
