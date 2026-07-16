import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ClipboardList, DollarSign, Users, TrendingUp, Truck,
  // Upload, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { PARCEL_COLUMNS, ADMIN_PARCEL_COLUMNS } from '../constants';
import {
  useParcelReport,
  useExportParcelReport,
  // useUploadDirectFreightInvoice,
  // useUploadAusPostInvoice
} from '../hooks/useReports';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
// import { Input } from '@/components/ui/input';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { useSearchParams } from 'react-router-dom';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
// import { showToast } from '@/components/ui/custom-toast';
import { useAppSelector } from '@/hooks/store.hooks';
import { formateCurrency } from '@/lib/utils';

export default function ParcelReportPage() {
  // const location = useLocation();
  // const isAdmin = location.pathname.includes('/admin');

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

  // Admin Specific States
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [invoiceType, setInvoiceType] = useState<string>('');
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Synchronize searchParams back to dateRange state
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, parseLocalDate]);

  // Synchronize dateRange state to URL searchParams
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

      return hasChanged ? prev : prev;
    }, { replace: true });
  }, [dateRange, setSearchParams]);

  const filters = useMemo(() => ({
    start_date: dateRange.from,
    end_date: dateRange.to,
    search: search || undefined,
    per_page: pageSize,
    page: page,
    customer: isAdmin && selectedCustomer !== '' ? selectedCustomer : undefined,
    invoice_type: isAdmin ? invoiceType : undefined,
  }), [dateRange, search, pageSize, page, isAdmin, selectedCustomer, invoiceType]);

  const { data, isLoading } = useParcelReport(filters, isAdmin);
  const exportMutation = useExportParcelReport(isAdmin);
  const { data: customersData } = useCustomers({ per_page: 1000 }, isAdmin);

  // const { mutate: uploadDirectFreight, isPending: isUploadingDF } = useUploadDirectFreightInvoice();
  // const { mutate: uploadAusPost, isPending: isUploadingAP } = useUploadAusPostInvoice();

  // const isUploading = isUploadingDF || isUploadingAP;

  const stats = useMemo(() => {
    const baseStats = [
      {
        label: 'Total Order',
        value: data?.summary?.total_orders || 0,
        icon: ClipboardList,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50 dark:bg-rose-500/10 h-10 w-10',
      },
      {
        label: 'Total Amount Paid',
        value: formateCurrency(data?.summary?.total_amount || data?.summary?.total_amount_paid || 0),
        icon: DollarSign,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 h-10 w-10',
      },
    ];

    if (isAdmin) {
      return [
        {
          label: 'Total Customer',
          value: data?.summary?.total_customers?.toString() || '0',
          icon: Users,
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10 h-10 w-10',
        },
        ...baseStats,
        {
          label: 'Total Margin',
          value: formateCurrency(data?.summary?.total_markup || 0),
          icon: TrendingUp,
          iconColor: 'text-orange-500',
          iconBg: 'bg-orange-50 dark:bg-orange-500/10 h-10 w-10',
        },
        {
          label: 'Total Pickup Charges',
          value: formateCurrency(data?.summary?.total_pickup || 0),
          icon: Truck,
          iconColor: 'text-amber-500',
          iconBg: 'bg-amber-50 dark:bg-amber-500/10',
        },
      ];
    }
    return baseStats;
  }, [data?.summary, isAdmin]);

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
    setInvoiceType('');
    // setSelectedFile(null);
  }, []);

  // const handleFileUpload = () => {
  //   if (!selectedFile || !invoiceType) {
  //     showToast("Please select a file and an invoice type", "error");
  //     return;
  //   }

  //   if (invoiceType === 'direct_freight') {
  //     uploadDirectFreight(selectedFile, {
  //       onSuccess: () => setSelectedFile(null)
  //     });
  //   } else if (invoiceType === 'auspost') {
  //     uploadAusPost(selectedFile, {
  //       onSuccess: () => setSelectedFile(null)
  //     });
  //   }
  // };

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">

      {/* Summary & Filter Section */}
      {!isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden items-stretch">
          {/* Left 50% - Both Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                {...stat}
                className="shadow-sm border-gray-100 dark:border-zinc-800 h-full"
                contentClassName="py-4"
              />
            ))}
          </div>

          {/* Right 50% - Date Filter */}
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-sm border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-10">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wide mb-1 ml-0.5 block">Date Range</label>
                <DateFilter
                  value={dateRange}
                  onChange={setDateRange}
                  className="w-full"
                />
              </div>
              <div className="sm:col-span-2">
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
        </div>
      ) : (
        <>
          {/* Summary Section */}
          <div className="space-y-3 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-2" />
              ))}
            </div>
          </div>

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
                  // label="Customer"
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

            {/* {isAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-4 border-t border-gray-50 dark:border-zinc-900/50">
                <div className="md:col-span-3">
                  <FormSelect
                    label="Invoice Type"
                    value={invoiceType}
                    onValueChange={(val) => setInvoiceType(val || '')}
                    options={[
                      { label: 'Direct Freight', value: 'direct_freight' },
                      { label: 'Auspost', value: 'auspost' },
                    ]}
                    placeholder="Select type"
                    className="w-full space-y-0"
                  />
                </div>

                <div className="md:col-span-9 flex flex-col">
                  <label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wide mb-1 ml-0.5">Upload Invoice (PDF)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="file"
                        className="hidden"
                        id="invoice-upload"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        accept=".pdf"
                      />
                      <div className="flex h-8 items-center border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950">
                        <label htmlFor="invoice-upload" className="bg-slate-50 dark:bg-zinc-900 px-3 h-full flex items-center text-[10px] font-bold text-slate-500 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors uppercase tracking-tight">
                          Choose file
                        </label>
                        <span className="px-3 text-[12px] text-slate-700 truncate flex-1 font-medium">
                          {selectedFile ? selectedFile.name : 'No file chosen'}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleFileUpload}
                      disabled={!selectedFile || !invoiceType || isUploading}
                      className="h-8 bg-slate-400 hover:bg-slate-500 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-bold uppercase tracking-wide text-[10px] px-4 shadow-sm transition-all min-w-[140px]"
                    >
                      {isUploading ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3 mr-2" />
                      )}
                      Upload Invoice
                    </Button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </>
      )}

      {/* Table Section */}
      <div className='rounded-lg min-h-[300px] shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto'>
        <DataTable
          columns={(isAdmin ? ADMIN_PARCEL_COLUMNS : PARCEL_COLUMNS) as any}
          data={data?.data || []}
          headerTitle={isAdmin ? "All Tranzit Group Courier Parcel Report" : "Parcel Report"}
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
