import { useState, useCallback, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/common/DatePicker';
import {
  useShipmentReport,
  useTransactionReport,
  useInvoiceReport,
  // useParcelReport,
  useExportShipmentReport,
  useExportTransactionReport,
  useExportParcelReport
} from '../hooks/useReports';
import useLocalStorage from '@/hooks/useSessionStorage';

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as ReportType) || 'shipment';

  const [startDateVal, setStartDate] = useLocalStorage<Date | undefined>('report_start_date', subDays(new Date(), 7));
  const [endDateVal, setEndDate] = useLocalStorage<Date | undefined>('report_end_date', new Date());

  const startDate = useMemo(() => {
    if (!startDateVal) return undefined;
    const d = new Date(startDateVal);
    return isNaN(d.getTime()) ? undefined : d;
  }, [startDateVal]);

  const endDate = useMemo(() => {
    if (!endDateVal) return undefined;
    const d = new Date(endDateVal);
    return isNaN(d.getTime()) ? undefined : d;
  }, [endDateVal]);

  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Format dates for API
  const formatDate = (date?: Date) => date ? format(date, 'dd/MM/yyyy') : undefined;

  const filters: ReportFilters = useMemo(() => ({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    search: search || undefined,
    per_page: pageSize,
    page: page,
  }), [startDate, endDate, search, pageSize, page]);

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

  // const handleApplyFilters = useCallback(() => {
  //   setStartDate(startDate);
  //   setEndDate(endDate);
  //   setPage(1);
  // }, [startDate, endDate]);

  const handleClearFilters = useCallback(() => {
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
  }, [setStartDate, setEndDate, setPage]);

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

  const customHeader = useMemo(() => {
    return (
      <div className='flex gap-2 items-center mr-2'>
        <span className='text-sm font-medium'>From:</span>

        <DatePicker
          // label="Start Date"
          date={startDate}
          setDate={setStartDate}
          className="w-[180px]"
        />

        <span className='text-sm font-medium'>To:</span>

        <DatePicker
          // label="End Date"
          date={endDate}
          setDate={setEndDate}
          className="w-[180px]"
        />
        {/* 
        <Button
          onClick={handleApplyFilters}
          variant="default"
          size="sm"
          className="h-8 p-3"
        >
          Apply
        </Button> */}

        {(startDate || endDate) && (<Button
          onClick={handleClearFilters}
          variant="destructive"
          size="sm"
          className="h-8 p-3 "
        >
          Clear
        </Button>)}
        <div className='border-l border-gray-300 h-6 ml-2' />
      </div>
    )
  }, [startDate, setStartDate, endDate, setEndDate, handleClearFilters])

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">
      <div className='rounded-xl shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <ReportsHeader
          startDate={startDate}
          endDate={endDate}
          // setStartDate={setStartDate}
          // setEndDate={setEndDate}
          // onApply={handleApplyFilters}
          activeTab={activeTab}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <DataTable
            key={activeTab}
            // headerTitle={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} reports`}
            columns={columns as any}
            data={data as any}
            searchPlaceholder={`Search ${activeTab} reports...`}
            onSearchChange={handleSearch}
            searchValue={search}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            pageSizeInFooter
            className="pb-3"
            totalItems={total}
            currentPage={page}
            onPageChange={setPage}
            loading={isLoading}
            onExport={(format) => handleExport(format)}
            isExporting={isExporting}
            // header={false}
            customHeader={customHeader}
            headerPosition='left'
          />
        </div>
      </div>
    </div>
  );
}
