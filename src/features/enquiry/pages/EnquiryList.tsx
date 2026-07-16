import { useState, useMemo, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { useCustomerEnquiries } from '../hooks/useEnquiries';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { EnquiryStatus } from '@/features/enquiries/types';
import { ENQUIRY_STATUS_CONFIG } from '@/features/enquiries/constant';
import { EnquiryDetailsDialog } from '../components/EnquiryDetailsDialog';

export default function EnquiryListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const { data: enquiriesResponse, isLoading } = useCustomerEnquiries({
        search: debouncedSearch,
        page,
        per_page: pageSize
    });

    // Reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const columns = useMemo(() => [
        {
            key: 'id',
            header: '#',
            cell: (_: any, __: any, index: number) => <span className="">{index + 1}</span>
        },
        {
            key: 'issue_type',
            header: 'ISSUE TYPE',
            cell: (val: any) => <span className="text-slate-500 font-semibold capitalize">{val}</span>
        },
        {
            key: 'email',
            header: 'EMAIL',
            cell: (val: any, row: any) => <span className="text-slate-500 font-medium">{val || row.reply_email || ''}</span>
        },
        {
            key: 'status',
            header: 'STATUS',
            cell: (val: EnquiryStatus) => (
                <div className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium tracking-wide border transition-all",
                    ENQUIRY_STATUS_CONFIG[val?.toLowerCase() as EnquiryStatus]?.className || 'bg-gray-50 text-gray-600'
                )}>
                    {val || 'Pending'}
                </div>
            )
        },
        {
            key: 'date',
            header: 'DATE',
            sortable: true,
            cell: (val: any, row: any) => <span className="text-slate-600 font-medium">{val || row.created_at || ''}</span>
        },
        {
            key: 'actions',
            header: 'ACTION',
            className: 'text-center',
            cell: (_: any, row: any) => (
                <div className="flex items-center justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all active:scale-90"
                        onClick={() => setSelectedEnquiry(row)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ], []);

    return (
        <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            <div className='rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto'>
                <DataTable
                    columns={columns as any}
                    data={enquiriesResponse?.data || []}
                    searchable
                    searchValue={search}
                    onSearchChange={(val) => { setSearch(val); setPage(1); }}
                    pageSize={pageSize}
                    onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
                    className="pb-3 text-xs flex-none h-auto"
                    totalItems={enquiriesResponse?.meta?.total || 0}
                    currentPage={page}
                    onPageChange={setPage}
                    loading={isLoading}
                    exportable={false}
                    customHeader={
                        <Button
                            onClick={() => navigate('/enquiry')}
                            className="gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wide font-bold">New Enquiry</span>
                        </Button>
                    }
                />
            </div>

            <EnquiryDetailsDialog
                enquiry={selectedEnquiry}
                onClose={() => setSelectedEnquiry(null)}
            />
        </div>
    );
}
