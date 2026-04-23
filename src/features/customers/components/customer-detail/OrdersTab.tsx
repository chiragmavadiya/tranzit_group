import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common';
import { MOCK_ORDERS } from './constants';

export const OrdersTab = () => {
    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <DataTable
                columns={[
                    { key: 'orderNumber', header: 'Order Number', cell: (val) => <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest italic underline cursor-pointer">{val}</span> },
                    { key: 'date', header: 'Date' },
                    { key: 'suburb', header: 'Suburb' },
                    { key: 'amount', header: 'Amount', cell: (val) => <span className="font-bold">{val}</span> },
                    { key: 'status', header: 'Status', cell: (val) => <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-none font-bold uppercase text-[10px] tracking-widest">{val}</Badge> },
                    { key: 'paymentStatus', header: 'Payment Status', cell: (val) => <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{val}</span></div> },
                    { key: 'courier', header: 'Courier' },
                    { key: 'orderType', header: 'Order Type' },
                    { key: 'consignmentDate', header: 'Consignment Date' },
                ]}
                data={MOCK_ORDERS}
                totalItems={MOCK_ORDERS.length}
                headerTitle="Orders"
                searchable
                pageSize={10}
            />
        </Card>
    );
};
