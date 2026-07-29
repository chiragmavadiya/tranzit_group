import { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { ConformationModal } from '@/components/common/ConformationModal';
import { Button } from '@/components/ui/button';
import { SURCHARGE_COLUMNS } from '../columns';
import { AddSurchargeDialog } from '../components/AddSurchargeDialog';
import {
  useCourierSurcharges,
  useCourierSurchargeMutations,
  useExportCourierSurcharge
} from '../hooks/useCourierSurcharge';
import type { CourierSurcharge } from '../types';
import { useDebounce } from '@/hooks/useDebounce';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function CourierSurchargePage() {
  const [search, setSearch] = useLocalStorage('courier-surcharge-search', '');
  const [page, setPage] = useLocalStorage('courier-surcharge-page', 1);
  const [pageSize, setPageSize] = useLocalStorage('courier-surcharge-page-size', 25);

  const { data: listResponse, isLoading } = useCourierSurcharges({
    search: useDebounce(search, 500),
    page,
    per_page: pageSize
  });

  const { deleteSurcharge, isDeleting } = useCourierSurchargeMutations();
  const { mutate, isPending } = useExportCourierSurcharge();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CourierSurcharge | null>(null);
  const [deletingRow, setDeletingRow] = useState<CourierSurcharge | null>(null);

  const handleDelete = () => {
    if (deletingRow) {
      deleteSurcharge(deletingRow.id, {
        onSuccess: () => setDeletingRow(null)
      });
    }
  };

  const onAddSurcharge = useCallback(() => {
    setEditingRow(null);
    setIsAddOpen(true);
  }, []);

  const columns = useMemo(() => SURCHARGE_COLUMNS(
    (row) => {
      setEditingRow(row);
      setIsAddOpen(true);
    },
    (row) => setDeletingRow(row)
  ), []);

  const onExport = useCallback((format: "pdf" | "excel" | "print" | "csv") => mutate({ format, search }), [mutate, search])

  const headerContent = useMemo(() => (
    <Button
      onClick={onAddSurcharge}
      className="global-btn"
    >
      <Plus className="w-4 h-4" />
      <span>Add Surcharge</span>
    </Button>
  ), [onAddSurcharge]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-none h-auto">
        <DataTable
          headerTitle="Courier Surcharge List"
          columns={columns}
          data={listResponse?.data || []}
          loading={isLoading}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          totalItems={listResponse?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onExport={onExport}
          isExporting={isPending}
          className="text-xs pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto"
          customHeader={headerContent}
        />
      </div>

      {/* Dialogs */}
      <AddSurchargeDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        initialData={editingRow}
      />

      <ConformationModal
        open={!!deletingRow}
        onOpenChange={(open) => !open && setDeletingRow(null)}
        onConfirm={handleDelete}
        title="Delete Surcharge"
        description={`Are you sure you want to delete the surcharge "${deletingRow?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
