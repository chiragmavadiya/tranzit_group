import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ReportsHeader } from '../components/ReportsHeader';
import {
  SHIPMENT_COLUMNS,
  TRANSACTION_COLUMNS,
  INVOICE_COLUMNS,
  PARCEL_COLUMNS,
} from '../constants';
import { DataTable } from '@/components/common';
import type { ReportType, ReportFilters } from '../types';
import {
  useShipmentReport,
  useTransactionReport,
  useInvoiceReport,
  useParcelReport,
  useExportShipmentReport,
  useExportTransactionReport,
  useExportParcelReport
} from '../hooks/useReports';

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as ReportType) || 'shipment';

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
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
  const { data: shipmentData, isLoading: shipmentLoading } = useShipmentReport(filters);
  const { data: transactionData, isLoading: transactionLoading } = useTransactionReport(filters);
  const { data: invoiceData, isLoading: invoiceLoading } = useInvoiceReport(filters);
  const { data: parcelData, isLoading: parcelLoading } = useParcelReport(filters);

  const [currentTab, setCurrentTab] = useState(activeTab);

  if (activeTab !== currentTab) {
    setCurrentTab(activeTab);
    setPage(1);
  }

  const handleApplyFilters = useCallback((start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
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
      case 'parcel':
        return {
          data: parcelData?.data || [],
          columns: PARCEL_COLUMNS,
          isLoading: parcelLoading,
          total: parcelData?.meta?.total || 0,
          isExporting: exportParcel.isPending
        };
      default:
        return { data: [], columns: [], isLoading: false, total: 0, isExporting: false };
    }
  }, [
    activeTab,
    shipmentData, shipmentLoading, exportShipment.isPending,
    transactionData, transactionLoading, exportTransaction.isPending,
    invoiceData, invoiceLoading,
    parcelData, parcelLoading, exportParcel.isPending
  ]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">
      <div className='rounded-xl shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <ReportsHeader
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onApply={handleApplyFilters}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <DataTable
            key={activeTab}
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
          />
        </div>
      </div>
    </div>
  );
}
