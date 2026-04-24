import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { MOCK_TRANSACTIONS } from './constants';

export const TransactionTab = () => {
    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <DataTable
                columns={[
                    { key: 'transactionId', header: 'Transaction ID', cell: (val) => <span className="font-bold text-slate-600 dark:text-zinc-400">{val}</span> },
                    { key: 'amount', header: 'Amount', cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100">{val}</span> },
                    { key: 'paymentStatus', header: 'Payment Status', cell: (val) => <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-black uppercase text-[10px] tracking-widest px-3 py-1">{val}</Badge> },
                    { key: 'type', header: 'Type', cell: (val) => <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-none font-black uppercase text-[10px] tracking-widest px-3 py-1">{val}</Badge> },
                    { key: 'paymentDate', header: 'Payment Date' },
                ]}
                data={MOCK_TRANSACTIONS}
                totalItems={MOCK_TRANSACTIONS.length}
                headerTitle="Top Up"
                searchable
                pageSize={10}
                customHeader={
                    <Button className="h-8 rounded-xl font-black uppercase tracking-widest text-[11px] bg-slate-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-lg">
                        + Add Top Up
                    </Button>
                }
            />
        </Card>
    );
};
