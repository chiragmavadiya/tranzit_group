import { CheckCircle2, MapPin, Calendar, Wallet, UserMinus, RefreshCw, ShieldCheck, ChevronLeft, Loader2, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CustomerDetails } from '../../types';
import { useVerifyCustomer, useZohoSyncCustomer, useToggleCustomerStatus } from '../../hooks/useCustomers';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/ui/custom-toast';
import { cn, formateCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface CustomerHeaderProps {
    customer: CustomerDetails;
    onEdit: () => void;
}

const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        return format(parseISO(dateStr), 'MMMM yyyy');
    } catch {
        return dateStr;
    }
};

export const CustomerHeader = ({ customer, onEdit }: CustomerHeaderProps) => {
    const navigate = useNavigate();
    const fullName = `${customer.first_name} ${customer.last_name}`;

    const { mutate: verify, isPending: isVerifying } = useVerifyCustomer();
    const { mutate: zohoSync, isPending: isSyncing } = useZohoSyncCustomer();
    const { mutate: toggleStatus, isPending: isToggling } = useToggleCustomerStatus();

    const handleVerify = () => {
        verify(customer.id, {
            onSuccess: (res) => showToast(res.message || 'Customer verified successfully', 'success'),
            onError: (err: any) => showToast(err?.response?.data?.message || 'Failed to verify customer', "error"),
        });
    };

    const handleZohoSync = () => {
        zohoSync({ id: customer.id }, {
            onSuccess: (res) => showToast(res.message || 'Synced with Zoho successfully', 'success'),
            onError: (err: any) => showToast(err?.response?.data?.message || 'Failed to sync with Zoho', "error"),
        });
    };

    const handleToggleStatus = () => {
        toggleStatus(customer.id, {
            onSuccess: (res) => showToast(res.message || 'Status updated successfully', 'success'),
            onError: (err: any) => showToast(err?.response?.data?.message || 'Failed to update status', "error"),
        });
    };

    const isActive = customer.status === 'active';

    return (
        <div className="flex flex-col gap-3">
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 p-0 hover:bg-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white text-xs font-semibold"
                    onClick={() => navigate('/admin/customers')}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Customers
                </Button>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar Container */}
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-center">
                            <img
                                className="w-full h-full object-cover"
                                src={`https://ui-avatars.com/api/?format=svg&name=${encodeURIComponent(fullName)}&background=0F172A&color=ffffff&bold=true&size=128`}
                                alt={fullName}
                            />
                        </div>
                        {customer.is_verified && (
                            <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 dark:bg-zinc-100 text-white dark:text-slate-900 border-2 border-white dark:border-zinc-950 shadow-md">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1 flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <h1 className="text-2xl mt-1 mb-0 font-bold text-slate-900 dark:text-white leading-none">
                                {fullName}
                            </h1>
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "font-medium border-none px-2.5 py-0.5 rounded-full text-xs leading-none capitalize",
                                    isActive
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                                        : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                                )}
                            >
                                {isActive ? "Active Customer" : "Inactive Customer"}
                            </Badge>
                        </div>

                        {/* Metadata Rows */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 dark:text-zinc-400 text-sm">
                            <div className="flex items-center gap-1 font-medium">
                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                <span>{(customer.address_info || customer.address) || "No Address"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                <span>Joined {getFormattedDate(customer.join_date)}</span>
                            </div>
                        </div>

                        {/* Wallet Balance Row */}
                        <div className="flex items-center gap-1.5 mt-1">
                            {/* <Wallet className="h-4 w-4 text-slate-700 dark:text-zinc-300" />
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                ${Number(customer.wallet_balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span> */}
                            <div className="flex items-center gap-2 px-3 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm transition-all duration-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50 cursor-default select-none">
                                <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Balance: {formateCurrency(Number(customer.wallet_balance))}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Button Grid */}
                <div className="flex flex-col gap-2 w-full md:w-auto sm:min-w-[240px]">
                    <div className="flex items-center gap-2 w-full">
                        {!customer.is_verified && (
                            <Button
                                variant="outline"
                                className="flex-1 h-8 rounded-lg gap-1.5 border-emerald-100 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10 text-xs font-semibold px-2"
                                onClick={handleVerify}
                                disabled={isVerifying}
                            >
                                {isVerifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                                Verify
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="flex-1 h-8 rounded-lg gap-1.5 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30 text-xs font-semibold px-2"
                            onClick={handleZohoSync}
                            disabled={isSyncing}
                        >
                            {isSyncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                            Zoho Sync
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 h-8 rounded-lg gap-1.5 border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300 px-2"
                            onClick={onEdit}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Button>
                    </div>
                    <Button
                        variant="destructive"
                        className={cn(
                            "w-full h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-sm transition-colors border-transparent",
                            isActive
                                ? "bg-red-700 hover:bg-red-800 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        )}
                        onClick={handleToggleStatus}
                        disabled={isToggling}
                    >
                        {isToggling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isActive ? (
                            <UserMinus className="h-3.5 w-3.5" />
                        ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
