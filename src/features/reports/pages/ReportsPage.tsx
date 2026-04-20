import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReportsHeader } from '../components/ReportsHeader';
import {
  MOCK_SHIPMENTS,
  MOCK_TRANSACTIONS,
  MOCK_INVOICES,
  SHIPMENT_COLUMNS,
  TRANSACTION_COLUMNS,
  INVOICE_COLUMNS,
  PARCEL_COLUMNS,
  MOCK_PARCEL_REPORTS
} from '../constants';
import { DataTable } from '@/components/common';
import type { ReportType } from '../types';

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as ReportType) || 'shipment';

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const handleApplyFilters = useCallback((start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
  }, []);

  const data = useMemo(() => {
    let rawData: any[] = [];
    switch (activeTab) {
      case 'shipment':
        rawData = MOCK_SHIPMENTS;
        break;
      case 'transaction':
        rawData = MOCK_TRANSACTIONS;
        break;
      case 'invoice':
        rawData = MOCK_INVOICES;
        break;
      case 'parcel':
        rawData = MOCK_PARCEL_REPORTS;
        break;
      default:
        rawData = [];
    }

    if (!search) return rawData;

    return rawData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [activeTab, search]);

  const columns = useMemo(() => {
    switch (activeTab) {
      case 'shipment':
        return SHIPMENT_COLUMNS;
      case 'transaction':
        return TRANSACTION_COLUMNS;
      case 'invoice':
        return INVOICE_COLUMNS;
      case 'parcel':
        return PARCEL_COLUMNS;
      default:
        return [];
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">
      <div className='rounded-xl  shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
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
          />
        </div>
      </div>
    </div>
  );
}
