import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { AUSPOST_COLUMNS } from '../columns';
import { useAuspostOrderSummary, useExportAuspostOrderSummary } from '../hooks/useAuspostOrderSummary';
import { useDebounce } from '@/hooks/useDebounce';

export default function AuspostOrderSummaryPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const debouncedSearch = useDebounce(search, 500);

  const { data: response, isLoading } = useAuspostOrderSummary({
    search: debouncedSearch,
    page,
    per_page: pageSize
  });

  const { mutate: exportSummary, isPending: isExporting } = useExportAuspostOrderSummary();

  const handleExport = (format: string) => {
    exportSummary({ format, search: debouncedSearch });
  };

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
        <DataTable
          headerTitle="Auspost Order Summary"
          columns={AUSPOST_COLUMNS}
          data={response?.data || []}
          loading={isLoading}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          totalItems={response?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          className="text-xs pb-3 flex-none h-auto"
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
}
