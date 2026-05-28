import { useState } from 'react';
import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common/DataTable';
import { useCustomerOrders, useExportCustomerOrders } from '../../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { showToast } from '@/components/ui/custom-toast';
// import OrdersPage from '@/features/orders/pages/OrdersPage';
import { StatusBadge } from '@/features/orders/components/StatusBadge';
import { NavLink } from 'react-router-dom';

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
                showToast('Failed to export orders', 'error');
            }
        });
    };

    // if (true) {
    //     return (
    //         <OrdersPage fromCustomer={true} customerId={customerId} />
    //     )
    // }

    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <DataTable
                columns={[
                    {
                        key: 'order_number', header: 'Order Number',
                        cell: (value: string) => (
                            <NavLink to={`/admin/orders/view/${value}`} className="font-bold text-primary underline">
                                {value}
                            </NavLink>
                        )
                    },
                    { key: 'date', header: 'Date' },
                    { key: 'suburb', header: 'Suburb' },
                    { key: 'amount', header: 'Amount', cell: (val) => <span className="font-bold">${val}</span> },
                    { key: 'status', header: 'Status', cell: (val) => <StatusBadge status={val === "Payment_pending" ? "Courier not assign" : val} /> },
                    { key: 'payment_status', header: 'Payment Status', cell: (val) => <StatusBadge status={val === "payment_Pending" ? "Courier not assign" : val} /> },
                    // { key: 'payment_status', header: 'Payment Status', cell: (val) => <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{val}</span></div> },
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
                className='pb-3'
                headerClass='bg-white'
            />
        </Card>
    );
};

