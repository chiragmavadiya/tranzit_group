import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common';
import { useCustomerOrders, useExportCustomerOrders } from '../../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

interface OrdersTabProps {
    customerId: string;
}

export const OrdersTab = ({ customerId }: OrdersTabProps) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const { data: response, isLoading } = useCustomerOrders(customerId, { page, per_page: pageSize });
    const orders = response?.data || [];
    const meta = response?.meta;

    const { mutate: exportOrders, isPending: isExporting } = useExportCustomerOrders();

    const handleExport = (type: "pdf" | "excel" | "print" | "csv") => {
        const format = type === 'excel' ? 'xlsx' : type;
        if (format === 'print') {
            window.print();
            return;
        }

        exportOrders({ id: customerId, format, params: { page, per_page: pageSize } }, {
            onSuccess: ({ blob, filename }) => {
                downloadFile(blob, filename);
            },
            onError: () => {
                toast.error('Failed to export orders');
            }
        });
    };

    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <DataTable
                columns={[
                    { key: 'order_number', header: 'Order Number', cell: (val) => <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest italic underline cursor-pointer">{val}</span> },
                    { key: 'date', header: 'Date' },
                    { key: 'suburb', header: 'Suburb' },
                    { key: 'amount', header: 'Amount', cell: (val) => <span className="font-bold">${val}</span> },
                    { key: 'status', header: 'Status', cell: (val) => <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-none font-bold uppercase text-[10px] tracking-widest">{val}</Badge> },
                    { key: 'payment_status', header: 'Payment Status', cell: (val) => <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{val}</span></div> },
                    { key: 'courier', header: 'Courier' },
                    { key: 'order_type', header: 'Order Type' },
                    { key: 'consignment_date', header: 'Consignment Date' },
                ]}
                data={orders}
                totalItems={meta?.total || 0}
                headerTitle="Orders"
                searchable
                pageSize={pageSize}
                currentPage={page}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                loading={isLoading}
                exportable
                isExporting={isExporting}
                onExport={handleExport}
            />
        </Card>
    );
};

