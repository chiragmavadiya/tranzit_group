import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { useCustomerTransactions, useExportCustomerTransactions } from '../../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { showToast } from '@/components/ui/custom-toast';

interface TransactionTabProps {
    customerId: string;
}

export const TransactionTab = ({ customerId }: TransactionTabProps) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [search, setSearch] = useState('');

    const { data: response, isLoading } = useCustomerTransactions(customerId, { page, per_page: pageSize, search });
    const transactions = response?.data || [];
    const meta = response?.meta;

    const { mutate: exportTransactions, isPending: isExporting } = useExportCustomerTransactions();

    const handleExport = (type: "pdf" | "excel" | "print" | "csv") => {
        const format = type === 'excel' ? 'xlsx' : type;
        if (format === 'print') {
            window.print();
            return;
        }

        exportTransactions({ id: customerId, format, params: { page, per_page: pageSize, search } }, {
            onSuccess: ({ blob, filename }) => {
                downloadFile(blob, filename);
            },
            onError: () => {
                showToast('Failed to export transactions', "error");
            }
        });
    };

    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <DataTable
                columns={[
                    { key: 'transaction_id', header: 'Transaction ID', cell: (val) => <span className="font-bold text-slate-600 dark:text-zinc-400">{val}</span> },
                    { key: 'amount', header: 'Amount', cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100">${val}</span> },
                    { key: 'payment_status', header: 'Payment Status', cell: (val) => <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-black uppercase text-[10px] tracking-widest px-3 py-1">{val}</Badge> },
                    { key: 'type', header: 'Type', cell: (val) => <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-none font-black uppercase text-[10px] tracking-widest px-3 py-1">{val}</Badge> },
                    { key: 'payment_date', header: 'Payment Date' },
                ]}
                data={transactions}
                totalItems={meta?.total || 0}
                headerTitle="Top Up"
                searchable
                searchValue={search}
                onSearchChange={(val) => { setSearch(val); setPage(1); }}
                pageSize={pageSize}
                currentPage={page}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                loading={isLoading}
                exportable
                isExporting={isExporting}
                onExport={handleExport}
                customHeader={
                    <Button
                        // onClick={onAddAddress}
                        className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider font-bold">Add Top Up</span>
                    </Button>
                }
            />
        </Card>
    );
};

