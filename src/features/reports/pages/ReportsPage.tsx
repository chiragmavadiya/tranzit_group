import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { ReportsHeader } from '../components/ReportsHeader';
import {
  SHIPMENT_COLUMNS,
  TRANSACTION_COLUMNS,
  INVOICE_COLUMNS,
  // PARCEL_COLUMNS,
} from '../constants';
import { DataTable } from '@/components/common/DataTable';
import type { ReportType, ReportFilters } from '../types';
import {
  useShipmentReport,
  useTransactionReport,
  useInvoiceReport,
  // useParcelReport,
  useExportShipmentReport,
  useExportTransactionReport,
  useExportParcelReport
} from '../hooks/useReports';

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as ReportType) || 'shipment';

  const parseLocalDate = useCallback((dateStr?: string | null) => {
    if (!dateStr) return undefined;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return undefined;
  }, []);

  const formatUrlDate = useCallback((date?: Date) => {
    return date ? format(date, 'dd-MM-yyyy') : undefined;
  }, []);

  const formatDate = useCallback((date?: Date) => {
    return date ? format(date, 'dd/MM/yyyy') : undefined;
  }, []);

  const initialStartDate = useMemo(() => {
    const s = searchParams.get('start_date');
    return s ? parseLocalDate(s) : subDays(new Date(), 7);
  }, [searchParams, parseLocalDate]);

  const initialEndDate = useMemo(() => {
    const e = searchParams.get('end_date');
    return e ? parseLocalDate(e) : new Date();
  }, [searchParams, parseLocalDate]);

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);
  const [appliedDateRange, setAppliedDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);

  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');

  // Synchronize search and date range filters with URL searchParams
  useEffect(() => {
    setSearchParams((prev) => {
      let hasChanged = false;

      const currentSearch = prev.get('search') || '';
      if (currentSearch !== search) {
        if (search) {
          prev.set('search', search);
        } else {
          prev.delete('search');
        }
        hasChanged = true;
      }

      const currentStartDate = prev.get('start_date') || undefined;
      const newStartDate = formatUrlDate(appliedDateRange[0]);
      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      const newEndDate = formatUrlDate(appliedDateRange[1]);
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
  }, [search, appliedDateRange, setSearchParams, formatUrlDate]);

  const filters: ReportFilters = useMemo(() => ({
    start_date: formatDate(appliedDateRange[0]),
    end_date: formatDate(appliedDateRange[1]),
    search: search || undefined,
    per_page: pageSize,
    page: page,
  }), [appliedDateRange, search, pageSize, page, formatDate]);

  // Mutations
  const exportShipment = useExportShipmentReport();
  const exportTransaction = useExportTransactionReport();
  const exportParcel = useExportParcelReport();

  // Queries
  const { data: shipmentData, isLoading: shipmentLoading } = useShipmentReport(filters, activeTab === 'shipment');
  const { data: transactionData, isLoading: transactionLoading } = useTransactionReport(filters, activeTab === 'transaction');
  const { data: invoiceData, isLoading: invoiceLoading } = useInvoiceReport(filters, activeTab === 'invoice');
  // const { data: parcelData, isLoading: parcelLoading } = useParcelReport(filters, false, activeTab === 'parcel');

  const [currentTab, setCurrentTab] = useState(activeTab);

  if (activeTab !== currentTab) {
    setCurrentTab(activeTab);
    setPage(1);
  }

  const handleApplyFilters = useCallback(() => {
    setAppliedDateRange(dateRange);
    setPage(1);
  }, [dateRange]);

  const handleClearFilters = useCallback(() => {
    setDateRange([undefined, undefined]);
    setAppliedDateRange([undefined, undefined]);
    setPage(1);
  }, []);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const handleExport = useCallback((format: string) => {
    const exportFilters = { ...filters, format };
    switch (activeTab) {
      case 'shipment':
        exportShipment.mutate(exportFilters);
        break;
      case 'transaction':
        exportTransaction.mutate(exportFilters);
        break;
      case 'parcel':
        exportParcel.mutate(exportFilters);
        break;
    }
  }, [activeTab, filters, exportShipment, exportTransaction, exportParcel]);

  const { data, columns, isLoading, total, isExporting } = useMemo(() => {
    switch (activeTab) {
      case 'shipment':
        return {
          data: shipmentData?.data || [],
          columns: SHIPMENT_COLUMNS,
          isLoading: shipmentLoading,
          total: shipmentData?.meta?.total || 0,
          isExporting: exportShipment.isPending
        };
      case 'transaction':
        return {
          data: transactionData?.data || [],
          columns: TRANSACTION_COLUMNS,
          isLoading: transactionLoading,
          total: transactionData?.meta?.total || 0,
          isExporting: exportTransaction.isPending
        };
      case 'invoice':
        return {
          data: invoiceData?.data || [],
          columns: INVOICE_COLUMNS,
          isLoading: invoiceLoading,
          total: invoiceData?.meta?.total || 0,
          isExporting: false
        };
      // case 'parcel':
      //   return {
      //     data: parcelData?.data || [],
      //     columns: PARCEL_COLUMNS,
      //     isLoading: parcelLoading,
      //     total: parcelData?.meta?.total || 0,
      //     isExporting: exportParcel.isPending
      //   };
      default:
        return { data: [], columns: [], isLoading: false, total: 0, isExporting: false };
    }
  }, [
    activeTab,
    shipmentData, shipmentLoading, exportShipment.isPending,
    transactionData, transactionLoading, exportTransaction.isPending,
    invoiceData, invoiceLoading,
    // exportParcel.isPending
  ]);

  // const customHeader = useMemo(() => {
  //   return (
  //     <div className='flex gap-2 items-center mr-2'>
  //       <span className='text-sm font-medium'>From:</span>

  //       <DatePicker
  //         // label="Start Date"
  //         date={startDate}
  //         setDate={setStartDate}
  //         className="w-[180px]"
  //       />

  //       <span className='text-sm font-medium'>To:</span>

  //       <DatePicker
  //         // label="End Date"
  //         date={endDate}
  //         setDate={setEndDate}
  //         className="w-[180px]"
  //       />
  //       {/* 
  //       <Button
  //         onClick={handleApplyFilters}
  //         variant="default"
  //         size="sm"
  //         className="h-8 p-3"
  //       >
  //         Apply
  //       </Button> */}

  //       {(startDate || endDate) && (<Button
  //         onClick={handleClearFilters}
  //         variant="destructive"
  //         size="sm"
  //         className="h-8 p-3 "
  //       >
  //         Clear
  //       </Button>)}
  //       <div className='border-l border-gray-300 h-6 ml-2' />
  //     </div>
  //   )
  // }, [startDate, setStartDate, endDate, setEndDate, handleClearFilters])

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">
      <div className='rounded-xl shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <ReportsHeader
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          setStartDate={(d) => setDateRange(prev => [d, prev[1]])}
          setEndDate={(d) => setDateRange(prev => [prev[0], d])}
          onApply={handleApplyFilters}
          activeTab={activeTab}
          handleClearFilters={handleClearFilters}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <DataTable
            key={activeTab}
            headerTitle={`${activeTab} Reports`}
            headerClass='capitalize'
            headerDescription={() => <>Reports generated from <span className="font-semibold text-gray-900 dark:text-zinc-200">{dateRange[0] ? dateRange[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Start Date'}</span> to <span className="font-semibold text-gray-900 dark:text-zinc-200">{dateRange[1] ? dateRange[1].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'End Date'}</span></>}
            columns={columns as any}
            data={data as any}
            searchPlaceholder={`Search ${activeTab} reports...`}
            onSearchChange={handleSearch}
            searchValue={search}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            // pageSizeInFooter
            className="pb-3"
            totalItems={total}
            currentPage={page}
            onPageChange={setPage}
            loading={isLoading}
            onExport={(format) => handleExport(format)}
            isExporting={isExporting}
            // header={false}
            // customHeader={customHeader}
            headerPosition='left'
          />
        </div>
      </div>
    </div>
  );
}
