import { useState, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
import { Button } from '@/components/ui/button';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import DatePicker from '@/components/common/DatePicker';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ConformationModal } from '@/components/common/ConformationModal';
import { format } from 'date-fns';
import {
  useBlackoutDays,
  useCreateBlackoutDay,
  useUpdateBlackoutDay,
  useDeleteBlackoutDay,
} from '../hooks/useBlackoutDays';
import type { BlackoutDayPayload } from '../services/blackout-days.service';
import useLocalStorage from '@/hooks/useLocalStorage';

interface BlackoutDayItem {
  id: string;
  name: string;
  date: string; // 'yyyy-MM-dd'
  created_at: string;
}

const DEFAULT_FORM_STATE = {
  name: '',
  date: undefined as Date | undefined,
};

export default function BlackoutDaysPage() {
  const [search, setSearch] = useLocalStorage<string>('blackout_days_search', '');
  const [page, setPage] = useLocalStorage<number>('blackout_days_current_page', 1);
  const [pageSize, setPageSize] = useLocalStorage<number>('blackout_days_page_size', 25);

  const debouncedSearch = useDebounce(search, 400);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delete Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  // API hooks
  const filters = useMemo(() => ({
    page,
    per_page: pageSize,
    search: debouncedSearch || undefined,
  }), [page, pageSize, debouncedSearch]);

  const { data: apiData, isLoading } = useBlackoutDays(filters);
  const createMutation = useCreateBlackoutDay();
  const updateMutation = useUpdateBlackoutDay();
  const deleteMutation = useDeleteBlackoutDay();

  const configs = useMemo<BlackoutDayItem[]>(() => {
    const rawData = apiData?.data;
    if (!rawData) return [];
    const items = Array.isArray(rawData) ? rawData : (rawData.data || []);
    return items.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      date: item.date,
      created_at: item.created_at || '',
    }));
  }, [apiData]);

  const handleOpenModal = useCallback((item?: BlackoutDayItem) => {
    setErrors({});
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        date: item.date ? new Date(item.date) : undefined,
      });
    } else {
      setEditingId(null);
      setFormData(DEFAULT_FORM_STATE);
    }
    setIsModalOpen(true);
  }, []);

  const handleFormChange = (key: keyof typeof DEFAULT_FORM_STATE, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Holiday name is required';
    }
    if (!formData.date) {
      newErrors.date = 'Holiday date is required';
    } else {
      const selectedDateStr = format(formData.date, 'yyyy-MM-dd');
      // Prevent duplicate holiday dates
      const isDuplicate = configs.some(
        (item) => item.date === selectedDateStr && item.id !== editingId
      );
      if (isDuplicate) {
        newErrors.date = 'A holiday on this date already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const dateString = formData.date ? format(formData.date, 'yyyy-MM-dd') : '';

    const payload: BlackoutDayPayload = {
      name: formData.name,
      date: dateString,
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleDeleteClick = useCallback((id: string) => {
    setIdToDelete(id);
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = () => {
    if (idToDelete) {
      deleteMutation.mutate(idToDelete, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setIdToDelete(null);
        },
      });
    }
  };

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, [setSearch, setPage]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, [setPageSize, setPage]);

  const columns = useMemo<Column<BlackoutDayItem>[]>(
    () => [
      {
        header: 'HOLIDAY NAME',
        key: 'name',
        className: 'font-semibold text-slate-800 dark:text-zinc-200 px-4',
        cell: (value: string) => value || '-',
      },
      {
        header: 'HOLIDAY DATE',
        key: 'date',
        className: 'px-4',
        cell: (value: string) => {
          if (!value) return '-';
          const date = new Date(value);
          return date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
      },
      {
        header: 'CREATED AT',
        key: 'created_at',
        className: 'px-4',
        cell: (value: string) => {
          if (!value) return '-';
          const date = new Date(value);
          return date.toLocaleDateString('en-AU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        key: 'actions',
        header: 'ACTION',
        sticky: 'right',
        cell: (_, row: BlackoutDayItem) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleOpenModal(row)}
            >
              <Edit2 className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-955/20 text-red-600 dark:text-red-400"
              onClick={() => handleDeleteClick(row.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleDeleteClick, handleOpenModal]
  );

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-none h-auto">
        <div className="p-0">
          <DataTable
            headerTitle="Blackout Days"
            headerDescription="Manage public holidays and days where carrier pickup operations are suspended."
            data={configs}
            columns={columns}
            loading={isLoading}
            searchable
            searchValue={search}
            onSearchChange={handleSearchChange}
            totalItems={
              apiData?.meta?.total ||
              (Array.isArray(apiData?.data) ? apiData?.data.length : 0)
            }
            currentPage={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            className="text-xs pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto"
            exportable={false}
            customHeader={
              <Button
                onClick={() => handleOpenModal()}
                className="h-8 bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Blackout Day
              </Button>
            }
          />
        </div>
      </div>

      <CustomModel
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingId ? 'Edit Blackout Day' : 'Add Blackout Day'}
        onSubmit={handleSubmit}
        submitText={editingId ? 'Update' : 'Save'}
        isLoading={createMutation.isPending || updateMutation.isPending}
        contentClass="sm:max-w-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800"
      >
        <div className="space-y-4 py-2 px-1">
          <FormInput
            label="Holiday Name"
            value={formData.name}
            onChange={(val) => handleFormChange('name', val)}
            placeholder="e.g. Christmas Day"
            isFullWidth={true}
            required
            error={!!errors.name}
            errormsg={errors.name}
          />

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-slate-700 dark:text-zinc-400 block mb-1">
              Holiday Date <span className="text-destructive">*</span>
            </label>
            <DatePicker
              date={formData.date}
              setDate={(date) => handleFormChange('date', date)}
              className="w-full h-8"
            />
            {errors.date && (
              <div className="text-red-500 text-[11px] w-full mt-0.5">{errors.date}</div>
            )}
          </div>
        </div>
      </CustomModel>

      <ConformationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Blackout Day"
        description="Are you sure you want to delete this blackout day? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
