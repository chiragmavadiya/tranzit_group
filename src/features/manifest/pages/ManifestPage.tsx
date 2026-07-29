import { useState, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { getManifestColumns } from '../columns';
import { useManifests, useExportManifests, useDownloadManifestPDF } from '../hooks/useManifest';
import { useDebounce } from '@/hooks/useDebounce';
import type { Manifest } from '../types';
import { useAppSelector } from '@/hooks/store.hooks';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function ManifestPage() {
  const [search, setSearch] = useLocalStorage<string>('manifest_search', '');
  const [page, setPage] = useLocalStorage<number>('manifest_current_page', 1);
  const [pageSize, setPageSize] = useLocalStorage<number>('manifest_page_size', 25);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: response, isLoading } = useManifests({
    search: debouncedSearch || undefined,
    page,
    per_page: pageSize
  });

  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.get_quote === 'full', [is_sub_user, team_access]);
  const canOrderView = useMemo(() => !is_sub_user || team_access?.permissions?.order === 'read_only' || team_access?.permissions?.order === 'full', [is_sub_user, team_access]);


  const { mutate: exportManifests, isPending: isExporting } = useExportManifests();
  const downloadPDFMutation = useDownloadManifestPDF();

  const handleExport = (format: string) => {
    exportManifests({ format, search: debouncedSearch });
  };

  const handleDownloadPDF = useCallback((row: Manifest) => {
    if (!row.order_number) return;
    setDownloadingId(row.order_number);
    downloadPDFMutation.mutate(row.pdf_url, {
      onSettled: () => {
        setDownloadingId(null);
      }
    });
  }, [downloadPDFMutation]);

  const columns = useMemo(() =>
    getManifestColumns(handleDownloadPDF, downloadingId, canReadWrite, canOrderView),
    [handleDownloadPDF, downloadingId, canReadWrite, canOrderView]
  );

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
        <DataTable
          headerTitle="Manifest Orders"
          headerDescription="View, track, and download manifest files for your consignments."
          columns={columns}
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
          className="text-xs pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto"
          onExport={handleExport}
          exportable={canReadWrite}
          isExporting={isExporting}
          headerPosition="left"
        />
      </div>
    </div>
  );
}
