import { useCallback } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { UNDELIVERED_COLUMNS } from '../columns';
import { useUndeliveredParcels, useExportUndeliveredParcels } from '../hooks/useUndeliveredParcel';
import { useDebounce } from '@/hooks/useDebounce';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function UndeliveredParcelPage() {
  const [search, setSearch] = useLocalStorage<string>('undelivered_parcel_search', '');
  const [page, setPage] = useLocalStorage<number>('undelivered_parcel_page', 1);
  const [pageSize, setPageSize] = useLocalStorage<number>('undelivered_parcel_page_size', 25);

  const debouncedSearch = useDebounce(search, 500);

  const handleSearchChange = useCallback((val: string) => {
    setPage(1);
    setSearch(val);
  }, [setPage, setSearch]);

  const handlePageSizeChange = useCallback((val: number) => {
    setPage(1);
    setPageSize(val);
  }, [setPage, setPageSize]);

  const { data: response, isLoading } = useUndeliveredParcels({
    search: debouncedSearch,
    page,
    per_page: pageSize
  });

  const exportMutation = useExportUndeliveredParcels();

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
        <DataTable
          headerTitle="Un-Delivered Parcel"
          columns={UNDELIVERED_COLUMNS}
          data={response?.data || []}
          loading={isLoading}
          searchable
          searchValue={search}
          onSearchChange={handleSearchChange}
          totalItems={response?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          className="text-xs pb-3 flex-none h-auto"
          onExport={(format) => exportMutation.mutate({ format, search: debouncedSearch })}
          isExporting={exportMutation.isPending}
        />
      </div>
    </div>
  );
}
