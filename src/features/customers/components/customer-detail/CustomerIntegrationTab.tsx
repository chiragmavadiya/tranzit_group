import { useCustomerIntegrations } from '../../hooks/useCustomers';
import { Truck, ShoppingCart, Check } from "lucide-react";
import { useMemo } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CustomerIntegrationTabProps {
    customerId: string;
}

export const CustomerIntegrationTab = ({ customerId }: CustomerIntegrationTabProps) => {
    const { data: response, isLoading } = useCustomerIntegrations(customerId);

    const data = response?.data;

    const courierData = useMemo(() => {
        return data?.courier_integrations.filter((item: any) => item.connected) || [];
    }, [data]);

    const ecommerceData = useMemo(() => {
        return data?.ecommerce_connections.filter((item: any) => item.connected) || [];
    }, [data]);

    const courierColumns = useMemo(() => [
        {
            header: 'Carrier',
            key: 'name',
            cell: (_: any, row: any) => {
                const isTranzit = row.slug.includes('tranzit') || false;
                return (
                    <div className="flex items-center gap-3 select-none">
                        <div className="w-16 h-12 rounded-xl bg-white p-1.5 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-center shrink-0 shadow-sm">
                            <img src={row.logo_url} alt={row.name} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">
                                {row.name}
                            </span>
                            {isTranzit && (
                                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                    Platform Integration
                                </span>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Default Courier',
            key: 'is_default',
            cell: (isDefault: boolean) => {
                return isDefault ? (
                    <Badge variant="default" className="font-semibold text-[11px] px-2.5 py-1 flex items-center w-fit gap-1 bg-blue-600 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-500 border-none shadow-sm rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        Default
                    </Badge>
                ) : (
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Standard</span>
                );
            }
        },
        {
            header: 'Status',
            key: 'connected',
            cell: (isConnected: boolean) => (
                <Badge
                    variant={isConnected ? "default" : "secondary"}
                    className={cn(
                        "font-semibold text-[11px] py-1 px-2.5 flex items-center justify-center w-fit gap-1",
                        isConnected
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800"
                    )}
                >
                    {isConnected && <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse bg-green-400" />}
                    <span>{isConnected ? "Connected" : "Not Connected"}</span>
                </Badge>
            )
        }
    ], []);

    const ecommerceColumns = useMemo(() => [
        {
            header: 'Platform',
            key: 'name',
            cell: (_: any, row: any) => {
                return (
                    <div className="flex items-center gap-3 select-none">
                        <div className="w-14 h-12 rounded-xl bg-white p-1.5 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-center shrink-0 shadow-sm">
                            <img src={row.logo_url} alt={row.name} className="h-full w-full object-contain" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{row.name}</span>
                    </div>
                );
            }
        },
        {
            header: 'Status',
            key: 'connected',
            cell: (isConnected: boolean) => (
                <Badge
                    variant={isConnected ? "default" : "secondary"}
                    className={cn(
                        "font-semibold text-[11px] py-1 px-2.5 flex items-center justify-center w-fit gap-1",
                        isConnected
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800"
                    )}
                >
                    {isConnected && <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse bg-green-400" />}
                    <span>{isConnected ? "Connected" : "Not Connected"}</span>
                </Badge>
            )
        }
    ], []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 bg-white dark:bg-zinc-950 p-4 rounded-md">
            {/* Courier Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Truck className="w-5 h-5 text-primary" />
                    <h2 className="my-0 text-lg font-bold text-slate-800 dark:text-zinc-100">Courier Integrations</h2>
                </div>
                {isLoading || courierData.length > 0 ? (
                    <div className="overflow-hidden bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 rounded-xl shadow-sm">
                        <DataTable
                            data={courierData}
                            columns={courierColumns}
                            loading={isLoading}
                            header={false}
                            pagination={false}
                            searchable={false}
                            exportable={false}
                            totalItems={courierData.length}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/30 dark:bg-zinc-900/10">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                            <Truck className="w-5 h-5 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-1">No carriers connected</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                            This customer has no connected carrier integrations.
                        </p>
                    </div>
                )}
            </div>

            {/* Ecommerce Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    <h2 className="my-0 text-lg font-bold text-slate-800 dark:text-zinc-100">E-commerce Integrations</h2>
                </div>
                {isLoading || ecommerceData.length > 0 ? (
                    <div className="overflow-hidden bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 rounded-xl shadow-sm">
                        <DataTable
                            data={ecommerceData}
                            columns={ecommerceColumns}
                            loading={isLoading}
                            header={false}
                            pagination={false}
                            searchable={false}
                            exportable={false}
                            totalItems={ecommerceData.length}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/30 dark:bg-zinc-900/10">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                            <ShoppingCart className="w-5 h-5 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-1">No stores connected</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                            This customer has no connected e-commerce integrations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
