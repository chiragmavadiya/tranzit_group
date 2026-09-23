import { useState, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
import { Button } from '@/components/ui/button';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import DatePicker from '@/components/common/DatePicker';
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useDebounce } from '@/hooks/useDebounce';
import { ConformationModal } from '@/components/common/ConformationModal';
import { Switch } from '@/components/ui/switch';
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useToggleAnnouncementStatus,
} from '../hooks/useAnnouncement';
import type { AnnouncementPayload } from '../services/announcement.service';
import useLocalStorage from '@/hooks/useLocalStorage';

interface GlobalConfigItem {
  id: string;
  name: string;
  text: string;
  textColor: string;
  bgColor: string;
  expiryDate: string;
  customerId: string[];
  isActive: boolean;
}

const DEFAULT_FORM_STATE = {
  name: '',
  text: '',
  textColor: '#000000',
  bgColor: '#ffffff',
  expiryDate: undefined as Date | undefined,
  customerId: ['all'] as string[],
  isActive: true,
};

export default function GlobalConfigPage() {
  const [search, setSearch] = useLocalStorage<string>('global_config_search', '');
  const [page, setPage] = useLocalStorage<number>('global_config_current_page', 1);
  const [pageSize, setPageSize] = useLocalStorage<number>('global_config_page_size', 25);

  const debouncedSearch = useDebounce(search, 400);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delete Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  // Fetch customers
  const { data: customersData } = useCustomers({ per_page: 1000 }, true);

  // Memoized filters for useAnnouncements
  const filters = useMemo(() => ({
    page,
    per_page: pageSize,
    search: debouncedSearch || undefined,
  }), [page, pageSize, debouncedSearch]);

  // API hooks
  const { data: apiData, isLoading } = useAnnouncements(filters);
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  const toggleStatusMutation = useToggleAnnouncementStatus();

  const configs = useMemo<GlobalConfigItem[]>(() => {
    const rawData = apiData?.data;
    if (!rawData) return [];
    const items = rawData;
    return items.map((item) => ({
      id: item.id.toString(),
      name: item.text,
      text: item.text,
      textColor: item.text_color,
      bgColor: item.background_color,
      expiryDate: item.expire_date,
      customerId: item.target_type === 'all' ? ['all'] : item.customer_ids.map(String),
      isActive: !!item.is_active,
    }));
  }, [apiData]);

  const customerOptions = useMemo(() => {
    const list = [{ value: 'all', label: 'All Customers' }];
    if (customersData?.data) {
      customersData.data.forEach((c: any) => {
        list.push({
          value: c.id.toString(),
          label: `${c.first_name} ${c.last_name} (${c.email})`,
        });
      });
    }
    return list;
  }, [customersData]);

  const handleOpenModal = useCallback((item?: GlobalConfigItem) => {
    setErrors({});
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        text: item.text,
        textColor: item.textColor,
        bgColor: item.bgColor,
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
        customerId: Array.isArray(item.customerId) ? item.customerId : [item.customerId || 'all'],
        isActive: item.isActive,
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
    if (!formData.customerId?.length || formData.customerId.length === 0) newErrors.customerId = 'At least one customer must be selected';
    // if (!formData.name.trim()) newErrors.name = 'Please enter config name';
    if (!formData.text.trim()) newErrors.text = 'Please enter config text';
    if (!formData.textColor.trim()) newErrors.textColor = 'Please enter text color';
    if (!formData.bgColor.trim()) newErrors.bgColor = 'Please enter background color';
    if (!formData.expiryDate) newErrors.expiryDate = 'Please select expiry date';

    // Hex validation
    const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
    if (formData.textColor && !hexRegex.test(formData.textColor)) {
      newErrors.textColor = 'Must be a valid hex color code (e.g. #000000)';
    }
    if (formData.bgColor && !hexRegex.test(formData.bgColor)) {
      newErrors.bgColor = 'Must be a valid hex color code (e.g. #FFFFFF)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const expiryString = formData.expiryDate
      ? formData.expiryDate.toISOString().split('T')[0]
      : '';

    const payload: AnnouncementPayload = {
      target_type: formData.customerId.includes('all') ? 'all' : 'customer',
      customer_ids: formData.customerId.includes('all') ? undefined : formData.customerId.map(Number),
      text: formData.text,
      text_color: formData.textColor,
      background_color: formData.bgColor,
      expire_date: expiryString,
      is_active: formData.isActive,
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

  // const paginatedConfigs = useMemo(() => {
  //   const rawData = apiData?.data;
  //   if (!rawData) return [];

  //   if (Array.isArray(rawData)) {
  //     const filtered = configs.filter(item =>
  //       item.text.toLowerCase().includes(search.toLowerCase())
  //     );
  //     const startIndex = (page - 1) * pageSize;
  //     return filtered.slice(startIndex, startIndex + pageSize);
  //   }
  //   return configs;
  // }, [apiData, configs, page, pageSize, search]);

  const columns = useMemo<Column<GlobalConfigItem>[]>(
    () => [
      {
        header: 'CUSTOMER',
        key: 'customerId',
        width: '130px',
        cell: (value: string[] | string) => {
          const ids = Array.isArray(value) ? value : [value || 'all'];
          if (ids.length === 0 || ids.includes('all')) {
            return (
              <span className="px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium text-xs">
                All Customers
              </span>
            );
          }
          const names = ids.map(id => {
            const customerObj = customersData?.data?.find((c: any) => c.id.toString() === id);
            return customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : `ID: ${id}`;
          });
          return (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {names.map((name, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-semibold text-[10px]">
                  {name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        header: 'TEXT PREVIEW',
        key: 'text',
        cell: (value: string, row: GlobalConfigItem) => (
          <span
            style={{ color: row.textColor, backgroundColor: row.bgColor }}
            className="px-3 py-1 rounded-md text-xs font-semibold inline-block border border-black/5"
          >
            {value || '-'}
          </span>
        ),
      },
      {
        header: 'EXPIRY DATE',
        key: 'expiryDate',
        className: 'break-normal',
        cell: (value: string) => {
          if (!value) return '-';
          const date = new Date(value);
          return date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
      },
      {
        header: 'STATUS',
        key: 'isActive',
        cell: (value: boolean, row: GlobalConfigItem) => {
          const isPending = toggleStatusMutation.isPending && toggleStatusMutation.variables === row.id;
          const handleToggle = () => {
            toggleStatusMutation.mutate(row.id);
          };
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={value}
                disabled={isPending}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-slate-950"
              />
              {isPending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
            </div>
          );
        },
      },
      {
        key: 'actions',
        header: 'ACTION',
        sticky: 'right',
        cell: (_, row: GlobalConfigItem) => (
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
              className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
              onClick={() => handleDeleteClick(row.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleDeleteClick, handleOpenModal, customersData, toggleStatusMutation]
  );
<<<<<<< HEAD

=======
  console.log(apiData, 'apiData.data')
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-none h-auto">
        <div className="p-0">
          <DataTable
            headerTitle='Global Configuration'
            headerDescription="Manage global notification text, colors, and expiry configurations"
            data={configs}
            columns={columns}
            loading={isLoading}
            searchable
            searchValue={search}
            onSearchChange={handleSearchChange}
            totalItems={apiData?.meta?.total || 0}
            currentPage={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            className="text-xs pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto"
            exportable={false}
            customHeader={<Button
              onClick={() => handleOpenModal()}
              className="h-8 bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Config
            </Button>}

          />
        </div>
      </div>

      <CustomModel
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingId ? 'Edit Config' : 'Add Config'}
        onSubmit={handleSubmit}
        submitText={editingId ? 'Update' : 'Save'}
        isLoading={createMutation.isPending || updateMutation.isPending}
        contentClass="sm:max-w-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800"
      >
        <div className="space-y-4 py-2 px-1">
          <FormSelect
            label="Customer"
            placeholder="Select Customer or All Customers"
            value={formData.customerId || ['all']}
            onValueChange={(val) => {
              let nextValue = Array.isArray(val) ? val : [val];
              const hadAll = (formData.customerId || []).includes('all');
              const hasAll = nextValue.includes('all');
              if (hasAll && !hadAll) {
                nextValue = ['all'];
              } else if (nextValue.length > 1 && hasAll) {
                nextValue = nextValue.filter(v => v !== 'all');
              }
              handleFormChange('customerId', nextValue);
            }}
            options={customerOptions}
            className="col-span-12 md:col-span-12"
            allowClear={false}
            multiple
            required
            error={!!errors.customerId}
            errormsg={errors.customerId}
          />

          {/* <FormInput
            label="Name"
            value={formData.name}
            onChange={(val) => handleFormChange('name', val)}
            placeholder="Enter configuration name"
            isFullWidth={true}
            required
            error={!!errors.name}
            errormsg={errors.name}
          /> */}

          <FormInput
            label="Text"
            value={formData.text}
            onChange={(val) => handleFormChange('text', val)}
            placeholder="Enter display text"
            isFullWidth={true}
            required
            error={!!errors.text}
            errormsg={errors.text}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-slate-700 dark:text-zinc-400">
                Text Color <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <div className="relative w-8 h-8 overflow-hidden">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => handleFormChange('textColor', e.target.value)}
                    className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer"
                    style={{ padding: 0, appearance: 'none', WebkitAppearance: 'none' }}
                  />
                </div>
                <FormInput
                  placeholder="#000000"
                  value={formData.textColor}
                  onChange={(val) => handleFormChange('textColor', val)}
                  className="flex-1 col-span-12"
                  inputClassName="h-8 font-mono"
                  error={!!errors.textColor}
                  errormsg={errors.textColor}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[14px] font-medium text-slate-700 dark:text-zinc-400">
                Background Color <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <div className="relative w-8 h-8 overflow-hidden">
                  <input
                    type="color"
                    value={formData.bgColor}
                    onChange={(e) => handleFormChange('bgColor', e.target.value)}
                    className="absolute w-8 h-8 inset-0 p-0 border-0 cursor-pointer"
                    style={{ padding: 0, appearance: 'none', WebkitAppearance: 'none' }}
                  />
                </div>
                <FormInput
                  placeholder="#FFFFFF"
                  value={formData.bgColor}
                  onChange={(val) => handleFormChange('bgColor', val)}
                  className="flex-1 col-span-12"
                  inputClassName="h-8 font-mono"
                  error={!!errors.bgColor}
                  errormsg={errors.bgColor}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-slate-700 dark:text-zinc-400 block mb-1">
              Expiry Date <span className="text-destructive">*</span>
            </label>
            <DatePicker
              date={formData.expiryDate}
              setDate={(date) => handleFormChange('expiryDate', date)}
              className="w-full h-8"
              disabled={{ before: new Date() }}
            />
            {errors.expiryDate && (
              <div className="text-red-500 text-[11px] w-full mt-0.5">{errors.expiryDate}</div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
            <div className="space-y-0.5">
              <label className="text-[13px] font-semibold text-slate-800 dark:text-zinc-200">
                Active Status
              </label>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 my-0">
                Determine if this announcement is active and visible.
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => handleFormChange('isActive', checked)}
              className="data-[state=checked]:bg-slate-950"
            />
          </div>
        </div>
      </CustomModel>

      <ConformationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Configuration"
        description="Are you sure you want to delete this configuration? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
