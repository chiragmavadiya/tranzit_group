import { useState } from "react";

import { Card, CardTitle, CardContent } from "@/components/ui/card";
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
}

export function DashboardTable<T extends { id: number }>({
  title,
  subtitle,
  data,
  className,
  columns
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


  const customeHeader = () => (
    <div className="flex flex-col gap-0.5">
      <CardTitle className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
        {title}
      </CardTitle>
      <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-tight">
        {subtitle}
      </p>
    </div>
  )

  return (
    <Card className={cn("border gap-0 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden group transition-colors duration-300 p-0", className)}>
      {/* <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:bg-gray-50/50 dark:group-hover:bg-zinc-800/50 transition-colors">
        <CustomeHeader />
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs w-[160px] md:w-[220px] bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-blue-600"
            />
          </div>
          <SelectComponent
            data={[
              { key: '10', value: '10' },
              { key: '25', value: '25' },
              { key: '50', value: '50' },
            ]}
            value={pageSize.toString()}
            placeholder="Select Page Size"
            className="w-[60px] h-8 text-xs font-bold"
            onValueChange={(value: string | null) => value && setPageSize(Number(value))}
          />
        </div>
      </CardHeader> */}
      <CardContent className="p-0 bg-white dark:bg-zinc-950 flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 h-[400px]">
          {/* <Table className="max-h-[500px] overflow-y-auto">
            <TableHeader className="bg-white dark:bg-zinc-950 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-zinc-800">
                {columns.map((col) => (
                  <TableHead key={String(col.key)} className="h-12 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5">
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.id} className="group/row bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="px-5 py-3.5 text-xs font-medium text-gray-700 dark:text-zinc-300">
                      {col.key === 'status' ? (
                        <StatusBadge status={row[col.key] as string} />
                      ) : col.key === 'orderNumber' || col.key === 'invoiceNumber' ? (
                        <span className="text-blue-600 dark:text-blue-400 cursor-pointer font-bold hover:underline">
                          {String(row[col.key])}
                        </span>
                      ) : col.cell ? (
                        col.cell(row[col.key])
                      ) : (
                        String(row[col.key])
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {currentData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 text-center text-gray-500 dark:text-zinc-400 font-medium text-xs italic">
                    No records found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table> */}

          <DataTable
            data={data}
            columns={columns}
            rowKey="id"
            // Selection
            // selectable
            // selectedRows={selectedRows}
            // onSelectionChange={setSelectedRows}
            // Sorting
            // sortConfig={sortConfig}
            // onSort={(key) => setSortConfig({ key, direction: 'asc' })}
            // Search
            searchable
            searchValue={search}
            onSearchChange={handleSearchChange}
            // searchPlaceholder="Search users..."
            // Pagination
            pagination
            pageSize={pageSize}
            onPageChange={(e) => setPage(e)}
            onPageSizeChange={handlePageSizeChange}
            currentPage={page}
            totalItems={data.length}
            customHeader={customeHeader}
          // Row actions
          // onRowClick={(user) => viewUser(user)}
          // Styling
          />
        </div>
      </CardContent>
    </Card>
  );
}
