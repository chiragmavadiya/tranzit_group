import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { ConformationModal } from '@/components/common/ConformationModal';
import { Button } from '@/components/ui/button';
import { POSTCODE_COLUMNS } from '../columns';
import { AddPostcodeDialog } from '../components/AddPostcodeDialog';
import type { CourierPostcode, CourierPostcodeFormData } from '../types';
import {
  useCourierPostcodes,
  useCreateCourierPostcode,
  useUpdateCourierPostcode,
  useDeleteCourierPostcode,
  useExportCourierPostcodes
} from '../hooks/useCourierPostcode';
import { useDebounce } from '@/hooks/useDebounce';
import { downloadFile } from '@/lib/utils';
import { showToast } from '@/components/ui/custom-toast';

export default function CourierPostcodePage() {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CourierPostcode | null>(null);
  const [deletingRow, setDeletingRow] = useState<CourierPostcode | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const debouncedSearch = useDebounce(search, 500);

  const { data: postcodeData, isLoading } = useCourierPostcodes({
    search: debouncedSearch,
    page,
    per_page: pageSize
  });

  const { mutate: createPostcode, isPending: isCreating } = useCreateCourierPostcode();
  const { mutate: updatePostcode, isPending: isUpdating } = useUpdateCourierPostcode();
  const { mutate: deletePostcode, isPending: isDeleting } = useDeleteCourierPostcode();
  const { mutate: exportPostcodes, isPending: isExporting } = useExportCourierPostcodes();

  const handleAddPostcode = (formData: CourierPostcodeFormData) => {
    if (editingRow) {
      updatePostcode({ id: editingRow.id, data: formData }, {
        onSuccess: () => {
          showToast('Postcode updated successfully', "success");
          setIsAddOpen(false);
          setEditingRow(null);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to update postcode', "error");
        }
      });
    } else {
      createPostcode(formData, {
        onSuccess: () => {
          showToast('Postcode created successfully', "success");
          setIsAddOpen(false);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to create postcode', "error");
        }
      });
    }
  };

  const handleDelete = () => {
    if (deletingRow) {
      deletePostcode(deletingRow.id, {
        onSuccess: () => {
          showToast('Postcode deleted successfully', "success");
          setDeletingRow(null);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to delete postcode', "error");
        }
      });
    }
  };

  const handleExport = (format: string) => {
    exportPostcodes({ format, search: debouncedSearch }, {
      onSuccess: (blob) => {
        downloadFile(blob, `courier-postcodes-${new Date().getTime()}.${format === 'excel' ? 'xlsx' : format}`);
        showToast('Exported successfully', "success");
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || 'Failed to export', "error");
      }
    });
  };

  const columns = useMemo(() => POSTCODE_COLUMNS(
    (row) => {
      setEditingRow(row);
      setIsAddOpen(true);
    },
    (row) => setDeletingRow(row)
  ), []);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className='rounded-2xl min-h-[500px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-1 flex flex-col border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <DataTable
          columns={columns as any}
          data={postcodeData?.data || []}
          searchable
          searchValue={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          pageSize={pageSize}
          onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
          className="pb-3 text-xs"
          totalItems={postcodeData?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          loading={isLoading}
          exportable
          isExporting={isExporting}
          onExport={handleExport}
          customHeader={
            <Button
              onClick={() => {
                setEditingRow(null);
                setIsAddOpen(true);
              }}
              className="gap-2 text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-bold">Add Postcode</span>
            </Button>
          }
        />
      </div>

      <AddPostcodeDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddPostcode}
        initialData={editingRow}
        isLoading={isCreating || isUpdating}
      />

      <ConformationModal
        open={!!deletingRow}
        onOpenChange={(open) => !open && setDeletingRow(null)}
        title="Delete Postcode"
        description="Are you sure you want to delete this courier postcode? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
