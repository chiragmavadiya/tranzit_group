import { FileText, Eye, Download, Wallet, DollarSign, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { useCustomerInvoices, useExportCustomerInvoices } from '../../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { showToast } from '@/components/ui/custom-toast';
import { NavLink } from 'react-router-dom';
import { INVOICE_STATUS_COLORS } from '@/features/invoices/constants';
import { useAppSelector } from '@/hooks/store.hooks';
import { useDownloadAdminInvoice, useDownloadCustomerInvoice } from '@/features/invoices/hooks/useInvoices';
import { CustomTooltip } from '@/components/common/CustomTooltip';

interface InvoiceManagementTabProps {
    customerId: string;
}

export const InvoiceManagementTab = ({ customerId }: InvoiceManagementTabProps) => {
    const { role } = useAppSelector((state) => state.auth);
    const isAdmin = role === 'admin';

    const downloadAdminInvoice = useDownloadAdminInvoice();
    const downloadCustomerInvoice = useDownloadCustomerInvoice();
    const downloadMutation = isAdmin ? downloadAdminInvoice : downloadCustomerInvoice;

    const { data: response, isLoading } = useCustomerInvoices(customerId);

    const invoices = response?.data || [];
    const summary = response?.summary || { total_invoices: 0, total_paid: 0, total_unpaid: 0 };
    const meta = response?.meta;

    const { mutate: exportInvoices, isPending: isExporting } = useExportCustomerInvoices();

    const handleExport = (type: "pdf" | "excel" | "print" | "csv") => {
        const format = type === 'excel' ? 'xlsx' : type;
        if (format === 'print') {
            window.print();
            return;
        }

        exportInvoices({ id: customerId, format }, {
            onSuccess: ({ blob, filename }) => {
                downloadFile(blob, filename);
            },
            onError: () => {
                showToast('Failed to export invoices', 'error');
            }
        });
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Invoice"
                    value={summary.total_invoices.toString()}
                    icon={FileText}
                    iconBg="bg-primary/10 dark:bg-primary/20"
                    iconColor="text-primary"
                    className="border-none shadow-md"
                />
                <StatCard
                    label="Paid"
                    value={`$${summary.total_paid}`}
                    icon={DollarSign}
                    iconBg="bg-cyan-50 dark:bg-cyan-500/10"
                    iconColor="text-cyan-500"
                    className="border-none shadow-md"
                />
                <StatCard
                    label="Unpaid"
                    value={`$${summary.total_unpaid}`}
                    icon={Wallet}
                    iconBg="bg-amber-50 dark:bg-amber-500/10"
                    iconColor="text-amber-600"
                    className="border-none shadow-md"
                />
            </div>

            {/* Invoices Table */}
            <Card className="bg-white dark:bg-zinc-900 border-none shadow-md overflow-hidden">
                <DataTable
                    columns={[
                        { key: 'invoice_number', header: 'Invoice No.', cell: (val) => <NavLink to={`/admin/invoices/${val}`} className="font-bold hover:underline">#{val}</NavLink> },
                        {
                            key: 'status',
                            header: 'STATUS',
                            cell: (status) => (
                                <Badge className={cn("px-3 py-0.5 rounded-md font-medium border-none shadow-none", INVOICE_STATUS_COLORS[status as keyof typeof INVOICE_STATUS_COLORS])}>
                                    {status}
                                </Badge>
                            )
                        },
                        { key: 'amount', header: 'TOTAL', cell: (val) => <span className="font-bold">${val}</span> },
                        { key: 'amount_paid', header: 'PAID', cell: (val) => <span className="font-bold text-emerald-600">${val}</span> },
                        { key: 'invoice_date', header: 'ISSUED DATE' },
                        { key: 'balance', header: 'BALANCE', cell: (val) => <span className="font-bold text-rose-600">${val}</span> },
                        {
                            key: 'actions',
                            header: 'ACTION',
                            cell: (_, row) => {
                                const isDownloading = downloadMutation.isPending && Number(downloadMutation.variables) === row.id;
                                return (
                                    <div className="flex items-center gap-2">
                                        <CustomTooltip title="View Invoice">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Eye className="h-4! w-4! " />
                                            </Button>
                                        </CustomTooltip>
                                        <CustomTooltip title="Download Invoice">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => downloadMutation.mutate(row.id)}
                                                disabled={downloadMutation.isPending}
                                            >
                                                {isDownloading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                ) : (
                                                    <Download className="h-4! w-4! " />
                                                )}
                                            </Button>
                                        </CustomTooltip>
                                    </div>
                                );
                            }
                        },
                    ]}
                    data={invoices}
                    totalItems={meta?.total || invoices.length}
                    searchable
                    pageSize={meta?.per_page || 10}
                    loading={isLoading}
                    exportable
                    isExporting={isExporting}
                    onExport={handleExport}
                    className='pb-3'
                />
            </Card>
        </div>
    );
};

// Helper for conditional classes
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

