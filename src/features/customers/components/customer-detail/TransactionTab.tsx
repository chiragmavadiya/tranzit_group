import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/common/DataTable';
import { useCustomerTransactions, useExportCustomerTransactions } from '../../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { showToast } from '@/components/ui/custom-toast';
import { TRANSACTION_STATUS_CONFIG } from '@/features/wallet/constants';
import { StatusCell } from '@/components/common';
import { Button } from '@/components/ui/button';
import { CreditDebitWalletDialog } from './CreditDebitWalletDialog';

interface TransactionTabProps {
    customerId: string;
}

export const TransactionTab = ({ customerId }: TransactionTabProps) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [search, setSearch] = useState('');
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

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
                    // { key: 'payment_status', header: 'Payment Status', cell: (val) => <StatusCell value={val?.toLowerCase()} statusConfig={TRANSACTION_STATUS_CONFIG} /> },
                    { key: 'description', header: 'Description' },
                    { key: 'type', header: 'Type', cell: (val) => <StatusCell value={val?.toLowerCase()} statusConfig={TRANSACTION_STATUS_CONFIG} /> },
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
                className='pb-3'
                print={false}
                customHeader={(
                    <Button onClick={() => setIsTopUpOpen(true)}>
                        + Top up
                    </Button>
                )}
            />

            {isTopUpOpen && (
                <CreditDebitWalletDialog
                    isOpen={isTopUpOpen}
                    onOpenChange={setIsTopUpOpen}
                    customerId={customerId}
                />
            )}
        </Card>
    );
};


