import { useState, useMemo } from 'react';
import { DataTable } from '@/components/common';
import { UNDELIVERED_COLUMNS } from '../columns';
import { MOCK_UNDELIVERED_PARCELS } from '../constants';
import type { UndeliveredParcel } from '../types';

export default function UndeliveredParcelPage() {
  const [data] = useState<UndeliveredParcel[]>(MOCK_UNDELIVERED_PARCELS);
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.suburb.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <DataTable
          headerTitle="Un-Delivered Parcel"
          columns={UNDELIVERED_COLUMNS}
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
