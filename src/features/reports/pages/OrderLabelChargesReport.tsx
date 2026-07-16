import { useState, useCallback, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { ORDER_LABEL_CHARGES_COLUMNS } from '../constants';
import { useOrderLabelChargesReport, useExportOrderLabelChargesReport } from '../hooks/useReports';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useAppSelector } from '@/hooks/store.hooks';
import { Button } from '@/components/ui/button';

export default function OrderLabelChargesReport() {
  const { role, is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const isAdmin = role === "admin";
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.report === 'full', [is_sub_user, team_access]);

  const [searchParams, setSearchParams] = useSearchParams();

  const parseLocalDate = useCallback((dateStr?: string | null) => {
    if (!dateStr) return undefined;
    const parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return undefined;
  }, []);

  const [dateRange, setDateRange] = useState<DateFilterValue>(() => {
    const sDate = parseLocalDate(searchParams.get('start_date'));
    const eDate = parseLocalDate(searchParams.get('end_date'));
    if (sDate && eDate) {
      return {
        type: 'custom',
        from: format(sDate, 'dd/MM/yyyy'),
        to: format(eDate, 'dd/MM/yyyy'),
        label: `${format(sDate, 'dd MMM yyyy')} - ${format(eDate, 'dd MMM yyyy')}`,
      };
    }
    return {
      type: 'custom',
      from: undefined,
      to: undefined,
      label: 'All Time',
    };
  });

  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  // Filter States
  const [selectedCustomer, setSelectedCustomer] = useState<string>(() => searchParams.get('user_id') || '');

  // Synchronize searchParams back to states
  useEffect(() => {
    const sDate = parseLocalDate(searchParams.get('start_date'));
    const eDate = parseLocalDate(searchParams.get('end_date'));
    if (sDate && eDate) {
      const fromStr = format(sDate, 'dd/MM/yyyy');
      const toStr = format(eDate, 'dd/MM/yyyy');

      if (dateRange.from !== fromStr || dateRange.to !== toStr) {
        setDateRange({
          type: 'custom',
          from: fromStr,
          to: toStr,
          label: `${format(sDate, 'dd MMM yyyy')} - ${format(eDate, 'dd MMM yyyy')}`,
        });
      }
    } else {
      if (dateRange.from !== undefined || dateRange.to !== undefined) {
        setDateRange({
          type: 'custom',
          from: undefined,
          to: undefined,
          label: 'All Time',
        });
      }
    }

    const userIdParam = searchParams.get('user_id') || '';
    if (userIdParam !== selectedCustomer) {
      setSelectedCustomer(userIdParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, parseLocalDate]);

  // Synchronize state to URL searchParams
  useEffect(() => {
    setSearchParams((prev) => {
      let hasChanged = false;

      const currentStartDate = prev.get('start_date') || undefined;
      const newStartDate = dateRange.from;

      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      const newEndDate = dateRange.to;

      if (currentEndDate !== newEndDate) {
        if (newEndDate) {
          prev.set('end_date', newEndDate);
        } else {
          prev.delete('end_date');
        }
        hasChanged = true;
      }

      const currentUserId = prev.get('user_id') || undefined;
      const newUserId = selectedCustomer || undefined;

      if (currentUserId !== newUserId) {
        if (newUserId) {
          prev.set('user_id', newUserId);
        } else {
          prev.delete('user_id');
        }
        hasChanged = true;
      }

      return hasChanged ? prev : prev;
    }, { replace: true });
  }, [dateRange, selectedCustomer, setSearchParams]);

  const filters = useMemo(() => ({
    start_date: dateRange.from,
    end_date: dateRange.to,
    q: search || undefined,
    per_page: pageSize,
    page: page,
    user_id: selectedCustomer || undefined,
  }), [dateRange, search, pageSize, page, selectedCustomer]);

  const { data, isLoading } = useOrderLabelChargesReport(filters, isAdmin);
  const exportMutation = useExportOrderLabelChargesReport();
  const { data: customersData } = useCustomers({ per_page: 1000 }, isAdmin);

  const handleReset = useCallback(() => {
    setDateRange({
      type: 'custom',
      from: undefined,
      to: undefined,
      label: 'All Time',
    });
    setSearch('');
    setPage(1);
    setSelectedCustomer('');
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      {/* Filter Section */}
      <div className="bg-white dark:bg-zinc-950 px-4 py-3 rounded-sm border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>

          <div className="md:col-span-3">
            <FormSelect
              placeholder="Select Customer"
              value={selectedCustomer}
              onValueChange={(val) => setSelectedCustomer(val || '')}
              options={customersData?.data?.map((c: any) => ({
                value: c.id.toString(),
                label: `${c.first_name} ${c.last_name} (${c.email})`
              })) || []}
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full h-8 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wide text-[10px] bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg min-h-[300px] shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
        <DataTable
          columns={ORDER_LABEL_CHARGES_COLUMNS as any}
          data={data?.data || []}
          headerTitle="Order Label Charges Report"
          searchable
          searchValue={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          pageSize={pageSize}
          onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
          className="pb-3 text-xs flex-none h-auto"
          totalItems={data?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          rowKey="tranzit_group_order_number"
          loading={isLoading}
          onExport={(format) => exportMutation.mutate({ ...filters, format })}
          isExporting={exportMutation.isPending}
          exportable={canReadWrite}
        />
      </div>
    </div>
  );
}
