import { FileText, Eye, Download, Wallet, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, StatCard } from '@/components/common';
import { useCustomerInvoices, useExportCustomerInvoices } from '../../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

interface InvoiceManagementTabProps {
    customerId: string;
}

export const InvoiceManagementTab = ({ customerId }: InvoiceManagementTabProps) => {
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
                toast.success('Export started successfully');
            },
            onError: () => {
                toast.error('Failed to export invoices');
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
                    iconBg="bg-blue-50 dark:bg-blue-500/10"
                    iconColor="text-blue-500"
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
                        { key: 'invoice_number', header: '#', cell: (val) => <span className="font-bold text-slate-400">#{val}</span> },
                        {
                            key: 'status',
                            header: 'STATUS',
                            cell: (val) => (
                                <Badge variant="secondary" className={cn(
                                    "border-none font-bold uppercase text-[10px] tracking-widest px-3 py-1",
                                    val === 'Paid' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                                )}>
                                    {val}
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
                            cell: () => (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Eye className="h-4 w-4 text-slate-400" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Download className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </div>
                            )
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
                />
            </Card>
        </div>
    );
};

// Helper for conditional classes
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

