import { useState, useMemo } from 'react';
import { DataTable } from '@/components/common';
import { ENQUIRY_COLUMNS } from '../columns';
import { MOCK_ENQUIRIES } from '../constants';
import { EnquiryDetailsDialog } from '../components/EnquiryDetailsDialog';
import type { Enquiry } from '../types';

export default function EnquiryPage() {
  const [data] = useState<Enquiry[]>(MOCK_ENQUIRIES);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const columns = useMemo(() => ENQUIRY_COLUMNS(
    (row) => setSelectedEnquiry(row)
  ), []);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.issueType.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <DataTable
          headerTitle="Enquiries"
          columns={columns}
          data={filteredData}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          totalItems={filteredData.length}
          className="text-xs pb-3"
          exportable={false}
        />
      </div>

      <EnquiryDetailsDialog
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
      />
    </div>
  );
}
