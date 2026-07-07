import { useState } from 'react';
import { CheckCircle2, MapPin, Calendar, Wallet, UserMinus, RefreshCw, ShieldCheck, ChevronLeft, Loader2, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CustomerDetails } from '../../types';
import { useVerifyCustomer, useZohoSyncCustomer, useToggleCustomerStatus } from '../../hooks/useCustomers';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/ui/custom-toast';
import { cn, formateCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ConformationModal } from '@/components/common/ConformationModal';

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
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
        setIsConfirmOpen(true);
    };

    const handleConfirmToggle = () => {
        toggleStatus(customer.id, {
            onSuccess: (res) => {
                showToast(res.message || 'Status updated successfully', 'success');
                setIsConfirmOpen(false);
            },
            onError: (err: any) => {
                showToast(err?.response?.data?.message || 'Failed to update status', "error");
                setIsConfirmOpen(false);
            },
        });
    };

    const isActive = customer.status === 'active';

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 gap-1 px-2 -ml-2 group/back-btn hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 text-xs font-semibold rounded-lg w-fit transition-colors"
                    onClick={() => navigate('/admin/customers')}
                >
                    <ChevronLeft className="h-4 w-4 group-hover/back-btn:-translate-x-1 transition-transform" />
                    Back to Customers
                </Button>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Avatar Container */}
                    <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
                            <img
                                className="w-full h-full object-cover"
                                src={`https://ui-avatars.com/api/?format=svg&name=${encodeURIComponent(fullName)}&background=0F172A&color=ffffff&bold=true&size=128`}
                                alt={fullName}
                            />
                        </div>
                        {customer.is_verified && (
                            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 dark:bg-zinc-100 text-white dark:text-slate-900 border-2 border-white dark:border-zinc-950 shadow-sm" title="Verified Customer">
                                <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-col min-w-0 gap-1.5">
                        <div className="flex items-center flex-wrap gap-2">
                            <h1 className="my-0 text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight truncate">
                                {fullName}
                            </h1>
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "font-semibold border-none px-2.5 py-0.5 rounded-full text-[11px] leading-none capitalize shrink-0",
                                    isActive
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                                        : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400"
                                )}
                            >
                                {isActive ? "Active Customer" : "Inactive Customer"}
                            </Badge>
                            <div className="flex items-center gap-1.5 px-2.5 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-2xs shrink-0 select-none">
                                <Wallet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>Balance: {formateCurrency(Number(customer.wallet_balance))}</span>
                            </div>
                        </div>

                        {/* Metadata Rows */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 dark:text-zinc-400 text-xs">
                            <div className="flex items-center gap-1 font-medium truncate max-w-[320px] sm:max-w-md">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{(customer.address_info || customer.address) || "No Address"}</span>
                            </div>
                            <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">•</span>
                            <div className="flex items-center gap-1 shrink-0">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                <span>Joined {getFormattedDate(customer.join_date)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Button Grid */}
                <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end shrink-0">
                    {!customer.is_verified && (
                        <Button
                            variant="outline"
                            className="h-8 rounded-lg gap-1.5 border-emerald-200 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10 text-xs font-semibold px-3 shadow-2xs"
                            onClick={handleVerify}
                            disabled={isVerifying}
                        >
                            {isVerifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                            Verify
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="h-8 rounded-lg gap-1.5 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 border-indigo-200/80 hover:border-indigo-300 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50 text-xs font-semibold px-3 shadow-2xs"
                        onClick={handleZohoSync}
                        disabled={isSyncing}
                    >
                        {isSyncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                        Zoho Sync
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 rounded-lg gap-1.5 border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300 px-3 shadow-2xs"
                        onClick={onEdit}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        className={cn(
                            "h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-sm transition-colors border-transparent px-3.5",
                            isActive
                                ? "bg-red-600 hover:bg-red-700 text-white"
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
            <ConformationModal
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Change Status"
                description="Are you sure you want to Change the status for this customer?"
                confirmText="Confirm"
                cancelText="Cancel"
                confirmVariant={isActive ? "destructive" : "default"}
                onConfirm={handleConfirmToggle}
                loading={isToggling}
            />
        </div>
    );
};
