import { useState, useCallback, useMemo } from 'react';
import { ClipboardList, DollarSign, Users, TrendingUp, Truck, Upload, Loader2 } from 'lucide-react';
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
  useUploadDirectFreightInvoice,
  useUploadAusPostInvoice
} from '../hooks/useReports';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';
import DatePicker from '@/components/common/DatePicker';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { showToast } from '@/components/ui/custom-toast';

export default function ParcelReportPage() {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  // Admin Specific States
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [invoiceType, setInvoiceType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatDate = (date?: Date) => date ? format(date, 'dd/MM/yyyy') : undefined;

  const filters = useMemo(() => ({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    search: search || undefined,
    per_page: pageSize,
    page: page,
    customer_id: isAdmin && selectedCustomer !== '' ? selectedCustomer : undefined,
    invoice_type: isAdmin ? invoiceType : undefined,
  }), [startDate, endDate, search, pageSize, page, isAdmin, selectedCustomer, invoiceType]);

  const { data, isLoading } = useParcelReport(filters, isAdmin);
  const exportMutation = useExportParcelReport(isAdmin);
  const { data: customersData } = useCustomers({ pageSize: 1000 });

  const { mutate: uploadDirectFreight, isPending: isUploadingDF } = useUploadDirectFreightInvoice();
  const { mutate: uploadAusPost, isPending: isUploadingAP } = useUploadAusPostInvoice();

  const isUploading = isUploadingDF || isUploadingAP;

  const stats = useMemo(() => {
    const baseStats = [
      {
        label: 'Total Order',
        value: data?.summary?.total_orders?.toString() || '0',
        icon: ClipboardList,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      },
      {
        label: 'Total Amount Paid',
        value: '$' + (data?.summary?.total_amount?.toString() || '0'),
        icon: DollarSign,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      },
    ];

    if (isAdmin) {
      return [
        {
          label: 'Total Customer',
          value: data?.summary?.total_customers?.toString() || '0',
          icon: Users,
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-50 dark:bg-blue-500/10',
        },
        ...baseStats,
        {
          label: 'Total Margin',
          value: '$' + (data?.summary?.total_markup?.toString() || '0'),
          icon: TrendingUp,
          iconColor: 'text-orange-500',
          iconBg: 'bg-orange-50 dark:bg-orange-500/10',
        },
        {
          label: 'Total Pickup Charges',
          value: '$' + (data?.summary?.total_pickup?.toString() || '0'),
          icon: Truck,
          iconColor: 'text-amber-500',
          iconBg: 'bg-amber-50 dark:bg-amber-500/10',
        },
      ];
    }
    return baseStats;
  }, [data?.summary, isAdmin]);

  const handleReset = useCallback(() => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch('');
    setPage(1);
    setSelectedCustomer('');
    setInvoiceType('');
    setSelectedFile(null);
  }, []);

  const handleFileUpload = () => {
    if (!selectedFile || !invoiceType) {
      showToast("Please select a file and an invoice type", "error");
      return;
    }

    if (invoiceType === 'direct_freight') {
      uploadDirectFreight(selectedFile, {
        onSuccess: () => setSelectedFile(null)
      });
    } else if (invoiceType === 'auspost') {
      uploadAusPost(selectedFile, {
        onSuccess: () => setSelectedFile(null)
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Summary Section */}
      <div className="space-y-3">
        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-5' : 'md:grid-cols-2'} gap-6`}>
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-4" />
          ))}
        </div>
      </div>


      {/* Filter Section */}
      <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <DatePicker
              label="From Date"
              date={startDate}
              setDate={setStartDate}
              placeholder="Start Date"
            />
          </div>
          <div className="md:col-span-3">
            <DatePicker
              label="To Date"
              date={endDate}
              setDate={setEndDate}
              placeholder="End Date"
            />
          </div>

          {isAdmin && (
            <div className="md:col-span-3">
              {/* <FormSelect
                label="Customer"
                value={selectedCustomer}
                onValueChange={(val) => setSelectedCustomer(val || 'all')}
                options={[
                  { label: 'All Customers', value: 'all' },
                  ...customersData?.data?.map((c: any) => ({
                    value: c.id.toString(),
                    label: `${c.first_name} ${c.last_name}`
                  })) || []
                ]}
                placeholder="All Customers"
                className="w-full space-y-0"
              /> */}
              <FormSelect
                label="Customer"
                placeholder="Select Customer"
                value={selectedCustomer}
                onValueChange={(val) => setSelectedCustomer(val || '')}
                options={customersData?.data?.map((c: any) => ({
                  value: c.id.toString(),
                  label: `${c.first_name} ${c.last_name}`
                })) || []}
              />
            </div>
          )}

          <div className={`flex gap-2 ${isAdmin ? 'md:col-span-3' : 'md:col-span-8'}`}>
            {/* <Button
              onClick={handleApplyFilters}
              // variant="default"
              // size="sm"
              // className="h-8 flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold uppercase tracking-widest text-[10px] shadow-sm"
              className='global-btn flex-1'
            >
              Filter
            </Button> */}
            <Button
              onClick={handleReset}
              variant="outline"
            // size="sm"
            // className="h-8 flex-1 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px] bg-white dark:bg-zinc-950"
            >
              Reset
            </Button>
          </div>
        </div>

        {isAdmin && (
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
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider mb-1 ml-0.5">Upload Invoice (PDF)</label>
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
                    <label htmlFor="invoice-upload" className="bg-slate-50 dark:bg-zinc-900 px-3 h-full flex items-center text-[10px] font-bold text-slate-500 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors uppercase tracking-tight">
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
                  className="h-8 bg-slate-400 hover:bg-slate-500 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-bold uppercase tracking-widest text-[10px] px-4 shadow-sm transition-all min-w-[140px]"
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
        )}
      </div>

      {/* Table Section */}
      <div className='rounded-xl min-h-[300px] shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <DataTable
          columns={(isAdmin ? ADMIN_PARCEL_COLUMNS : PARCEL_COLUMNS) as any}
          data={data?.data || []}
          headerTitle={isAdmin ? "Customer Parcel Report" : "Parcel Report"}
          searchable
          searchValue={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          pageSize={pageSize}
          onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
          className="pb-3 text-xs"
          totalItems={data?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          rowKey="tranzit_group_order_number"
          loading={isLoading}
          onExport={(format) => exportMutation.mutate({ ...filters, format })}
          isExporting={exportMutation.isPending}
        />
      </div>
    </div>
  );
}
