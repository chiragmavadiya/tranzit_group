import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parse, isValid } from 'date-fns';
import { ReportsHeader } from '../components/ReportsHeader';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { hydrateDateFilter } from '@/components/common/DateFilter/utils';
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
import useLocalStorage from '@/hooks/useLocalStorage';
import { useAppSelector } from '@/hooks/store.hooks';

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as ReportType) || 'shipment';

  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.report === 'full', [is_sub_user, team_access]);

  const [dateRange, setDateRange] = useLocalStorage<DateFilterValue>('reports_date_range', {
    type: 'custom',
    from: undefined,
    to: undefined,
    label: 'All Time',
  }, hydrateDateFilter);

  const [pageSize, setPageSize] = useLocalStorage<number>('reports_page_size', 100);
  const [page, setPage] = useLocalStorage<number>('reports_page', 1);
  const [search, setSearch] = useLocalStorage<string>('reports_search', '');

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
      let newStartDate: string | undefined;
      if (dateRange.from) {
        const parsedFrom = parse(dateRange.from, 'dd/MM/yyyy', new Date());
        if (isValid(parsedFrom)) {
          newStartDate = format(parsedFrom, 'dd-MM-yyyy');
        }
      }
      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      let newEndDate: string | undefined;
      if (dateRange.to) {
        const parsedTo = parse(dateRange.to, 'dd/MM/yyyy', new Date());
        if (isValid(parsedTo)) {
          newEndDate = format(parsedTo, 'dd-MM-yyyy');
        }
      }
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
  }, [search, dateRange, setSearchParams]);

  const filters: ReportFilters = useMemo(() => ({
    start_date: dateRange.from || undefined,
    end_date: dateRange.to || undefined,
    search: search || undefined,
    per_page: pageSize,
    page: page,
  }), [dateRange.from, dateRange.to, search, pageSize, page]);

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

  const handleDateRangeChange = useCallback((value: DateFilterValue) => {
    setDateRange(value);
    setPage(1);
  }, [setDateRange, setPage]);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, [setSearch, setPage]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, [setPageSize, setPage]);

  const handleExport = useCallback((format: string) => {
    const exportFilters = {
      start_date: dateRange.from || undefined,
      end_date: dateRange.to || undefined,
      search,
      format
    };
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
  }, [dateRange.from, dateRange.to, search, activeTab, exportShipment, exportTransaction, exportParcel]);

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
    <div className="flex flex-col flex-1 gap-2 p-page-padding overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">
      <div className='rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto'>
        <ReportsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          activeTab={activeTab}
        />

        <div className="flex-none h-auto">
          <DataTable
            key={activeTab}
            headerTitle={`${activeTab} Reports`}
            headerClass='capitalize'
            moduleName='allReport'
            headerDescription={() => <>Reports generated for <span className="font-semibold text-gray-900 dark:text-zinc-200">{dateRange.label || 'All Time'}</span></>}
            columns={columns as any}
            data={data as any}
            searchPlaceholder={`Search ${activeTab} reports...`}
            onSearchChange={handleSearch}
            searchValue={search}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            // pageSizeInFooter
            className="pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto"
            totalItems={total}
            currentPage={page}
            onPageChange={setPage}
            loading={isLoading}
            onExport={(format) => handleExport(format)}
            isExporting={isExporting}
            // header={false}
            // customHeader={customHeader}
            headerPosition='left'
            exportable={canReadWrite}
          />
        </div>
      </div>
    </div>
  );
}
