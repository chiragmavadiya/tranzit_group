import { useState, useMemo } from 'react';
import { DataTable } from '@/components/common';
import { AUSPOST_COLUMNS } from '../columns';
import { MOCK_AUSPOST_ORDERS } from '../constants';
import type { AuspostOrder } from '../types';

export default function AuspostOrderSummaryPage() {
  const [data] = useState<AuspostOrder[]>(MOCK_AUSPOST_ORDERS);
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.suburb.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <DataTable
          headerTitle="Auspost Order Summary"
          columns={AUSPOST_COLUMNS}
          data={filteredData}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          totalItems={filteredData.length}
          className="text-xs pb-3"
          onExport={(type) => console.log(`Exporting as ${type}`)}
        />
      </div>
    </div>
  );
}
