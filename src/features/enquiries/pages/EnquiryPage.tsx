import { useState, useMemo, useEffect } from 'react';
import { DataTable } from '@/components/common';
import { ENQUIRY_COLUMNS } from '../columns';
import { EnquiryDetailsDialog } from '../components/EnquiryDetailsDialog';
import type { Enquiry } from '../types';
import { useAdminInquiries } from '@/features/enquiries/hooks/useEnquiries';
import { useDebounce } from '@/hooks/useDebounce';

export default function EnquiryPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: inquiriesResponse, isLoading } = useAdminInquiries({
    search: debouncedSearch,
    page,
    per_page: pageSize
  });

  const inquiries = inquiriesResponse?.data.map((e, i) => ({ ...e, id: i })) || [];
  const totalItems = inquiriesResponse?.meta?.total || 0;

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const columns = useMemo(() => ENQUIRY_COLUMNS(
    (row) => setSelectedEnquiry(row)
  ), []);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <DataTable
          headerTitle="Enquiries"
          columns={columns}
          data={inquiries}
          totalItems={totalItems}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          loading={isLoading}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          className="text-xs pb-3"
          exportable={false}
          rowKey="id"
        />
      </div>

      <EnquiryDetailsDialog
        enquiryId={selectedEnquiry?.id}
        onClose={() => setSelectedEnquiry(null)}
      />
    </div>
  );
}
