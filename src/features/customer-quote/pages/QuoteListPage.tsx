import { useState, useMemo } from 'react';
import { DataTable } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useAdminQuotes, useExportQuotes } from '@/features/quote/hooks/useQuote';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';
import { QuoteDetailsDialog } from '../components/QuoteDetailsDialog';
import { Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function QuoteListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const { data: quoteData, isLoading } = useAdminQuotes({
        search: debouncedSearch,
        page,
        per_page: pageSize
    });

    const { mutate: exportQuotes, isPending: isExporting } = useExportQuotes();

    const handleExport = (format: string) => {
        exportQuotes({ format, search: debouncedSearch }, {
            onSuccess: (blob) => {
                downloadFile(blob, `quotes-${new Date().getTime()}.${format === 'excel' ? 'xlsx' : format}`);
                toast.success('Exported successfully');
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || 'Failed to export quotes');
            }
        });
    };

    const columns = useMemo(() => [
        {
            key: 'quote_reference',
            header: 'REFERENCE',
            sortable: true,
            cell: (val: string) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[13px]">{val}</span>
        },
        {
            key: 'email',
            header: 'CUSTOMER',
            sortable: true,
            cell: (val: string) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
        },
        {
            key: 'carrier',
            header: 'CARRIER',
            sortable: true,
            cell: (val: string) => <span className="text-slate-700 dark:text-zinc-300 font-semibold text-[12px]">{val}</span>
        },
        {
            key: 'amount',
            header: 'AMOUNT',
            sortable: true,
            cell: (val: number) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[13px] tracking-tight">${val.toFixed(2)}</span>
        },
        {
            key: 'created_at',
            header: 'DATE',
            sortable: true,
            cell: (val: string) => <span className="text-slate-500 text-[11px]">{format(new Date(val), 'dd MMM yyyy HH:mm')}</span>
        },
        {
            key: 'actions',
            header: 'ACTIONS',
            className: 'text-right',
            sticky: 'right',
            noPrint: true,
            cell: (_: any, row: any) => (
                <div className="flex items-center justify-end gap-2 pr-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90"
                        onClick={() => {
                            setSelectedQuoteId(row.id);
                            setIsDetailsOpen(true);
                        }}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ], []);

    return (
        <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            <div className='rounded-2xl min-h-[500px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-1 flex flex-col border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
                <DataTable
                    columns={columns as any}
                    data={quoteData?.data || []}
                    searchable
                    searchValue={search}
                    onSearchChange={(val) => { setSearch(val); setPage(1); }}
                    pageSize={pageSize}
                    onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
                    className="pb-3 text-xs"
                    totalItems={quoteData?.meta?.total || 0}
                    currentPage={page}
                    onPageChange={setPage}
                    loading={isLoading}
                    exportable
                    isExporting={isExporting}
                    onExport={handleExport}
                    customHeader={
                        <Button 
                            onClick={() => navigate('/admin/quotes/create')}
                            className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider font-bold">New Quote</span>
                        </Button>
                    }
                />
            </div>

            <QuoteDetailsDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                quoteId={selectedQuoteId}
            />
        </div>
    );
}
