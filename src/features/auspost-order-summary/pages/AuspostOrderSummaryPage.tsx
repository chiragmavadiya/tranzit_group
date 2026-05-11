import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { AUSPOST_COLUMNS } from '../columns';
import { useAuspostOrderSummary } from '../hooks/useAuspostOrderSummary';
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

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
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
          className="text-xs pb-3"
          onExport={(type) => console.log(`Exporting as ${type}`)}
        />
      </div>
    </div>
  );
}
