import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/common";

interface DashboardTableProps<T> {
  title: string;
  subtitle: string;
  data: T[];
  pageSize?: number;
  className?: string;
  searchValue?: string;
  columns: Column<T>[];
  loading?: boolean;
}

export function DashboardTable<T extends { id: number }>({
  title,
  subtitle,
  data,
  className,
  columns,
  loading = false
}: DashboardTableProps<T>) {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const handleSearchChange = (val: string) => {
    setSearch(val)
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)

  }

  return (
    <Card className={cn("border gap-0 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden group transition-colors duration-300 p-0", className)}>
      <CardContent className="p-0 bg-white dark:bg-zinc-950 flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 h-[400px]">
          <DataTable
            data={data}
            columns={columns}
            rowKey="id"
            searchable
            searchValue={search}
            onSearchChange={handleSearchChange}
            pagination
            pageSize={pageSize}
            onPageChange={(e) => setPage(e)}
            onPageSizeChange={handlePageSizeChange}
            currentPage={page}
            totalItems={data.length}
            headerTitle={title}
            headerDescription={subtitle}
            className='pb-3'
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
