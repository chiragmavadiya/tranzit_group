import { useState } from 'react';
<<<<<<< HEAD
import { MapPin, Calendar, Wallet, UserCheck, UserMinus, ShieldCheck, Lock, LockOpen, ChevronLeft, Loader2, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CustomerDetails } from '../../types';
import { useVerifyCustomer, useToggleCustomerStatus, useSetAccountActivation } from '../../hooks/useCustomers';
=======
import { CheckCircle2, MapPin, Calendar, Wallet, UserMinus, ShieldCheck, ChevronLeft, Loader2, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CustomerDetails } from '../../types';
import { useVerifyCustomer,  useToggleCustomerStatus } from '../../hooks/useCustomers';
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
    // Customer status and account activation are separate controls, one confirm modal at a time.
    const [confirmAction, setConfirmAction] = useState<'status' | 'activation' | null>(null);

    const { mutate: verify, isPending: isVerifying } = useVerifyCustomer();
    const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleCustomerStatus();
    const { mutate: setAccountActivation, isPending: isToggling } = useSetAccountActivation();
=======
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { mutate: verify, isPending: isVerifying } = useVerifyCustomer();
    const { mutate: toggleStatus, isPending: isToggling } = useToggleCustomerStatus();
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

    const handleVerify = () => {
        verify(customer.id, {
            onSuccess: (res) => showToast(res.message || 'Customer verified successfully', 'success'),
            onError: (err: any) => showToast(err?.response?.data?.message || 'Failed to verify customer', "error"),
        });
    };

<<<<<<< HEAD
    const isAccountActivated = !!customer.account_activation;

    const handleConfirmActivation = () => {
        setAccountActivation({ id: customer.id, account_activation: !isAccountActivated }, {
            onSuccess: (res) => {
                showToast(
                    res.message || `Account ${isAccountActivated ? 'deactivated' : 'activated'} successfully`,
                    'success',
                );
                setConfirmAction(null);
            },
            // The modal stays open so the admin can retry without losing their place.
            onError: (err: any) => showToast(err?.response?.data?.message || 'Failed to update account activation', "error"),
=======
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
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
        });
    };

    const isActive = customer.status === 'active';
<<<<<<< HEAD

    const handleConfirmStatus = () => {
        toggleStatus(customer.id, {
            onSuccess: (res) => {
                showToast(res.message || 'Status updated successfully', 'success');
                setConfirmAction(null);
            },
            onError: (err: any) => showToast(err?.response?.data?.message || 'Failed to update status', "error"),
        });
    };
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

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
<<<<<<< HEAD
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "font-semibold border-none px-2.5 py-0.5 rounded-full text-[11px] leading-none shrink-0",
                                    isAccountActivated
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                                )}
                            >
                                {isAccountActivated ? "Portal Access On" : "Portal Access Off"}
                            </Badge>
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
                        className="h-8 rounded-lg gap-1.5 border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300 px-3 shadow-2xs"
                        onClick={onEdit}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button
<<<<<<< HEAD
                        variant="outline"
                        className={cn(
                            "h-8 rounded-lg gap-1.5 text-xs font-semibold px-3 shadow-2xs transition-colors border-slate-200 text-slate-700 dark:border-zinc-800 dark:text-zinc-300",
                            // Neutral at rest so it can't be mistaken for the portal access action,
                            // but the hover state still signals which way the change goes.
                            isActive
                                ? "hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                : "hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                        )}
                        onClick={() => setConfirmAction('status')}
                        disabled={isTogglingStatus}
                    >
                        {isTogglingStatus ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isActive ? (
                            <UserMinus className="h-3.5 w-3.5" />
                        ) : (
                            <UserCheck className="h-3.5 w-3.5" />
                        )}
                        {isActive ? 'Mark Customer Inactive' : 'Mark Customer Active'}
                    </Button>
                    <Button
                        variant="destructive"
                        className={cn(
                            "h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-sm transition-colors border-transparent px-3.5",
                            isAccountActivated
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        )}
                        onClick={() => setConfirmAction('activation')}
=======
                        variant="destructive"
                        className={cn(
                            "h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-sm transition-colors border-transparent px-3.5",
                            isActive
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        )}
                        onClick={handleToggleStatus}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                        disabled={isToggling}
                    >
                        {isToggling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
<<<<<<< HEAD
                        ) : isAccountActivated ? (
                            <Lock className="h-3.5 w-3.5" />
                        ) : (
                            <LockOpen className="h-3.5 w-3.5" />
                        )}
                        {isAccountActivated ? 'Deactivate Portal Access' : 'Activate Portal Access'}
=======
                        ) : isActive ? (
                            <UserMinus className="h-3.5 w-3.5" />
                        ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {isActive ? 'Deactivate' : 'Activate'}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                    </Button>
                </div>
            </div>
            <ConformationModal
<<<<<<< HEAD
                open={confirmAction === 'status'}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title={isActive ? "Mark customer as inactive?" : "Mark customer as active?"}
                description={isActive
                    ? "This customer will not be able to log in to the Customer Portal at all."
                    : "This customer will be able to log in again. What they can use after that depends on their portal access."}
                confirmText={isActive ? "Mark Inactive" : "Mark Active"}
                cancelText="Cancel"
                confirmVariant={isActive ? "destructive" : "default"}
                onConfirm={handleConfirmStatus}
                loading={isTogglingStatus}
            />
            <ConformationModal
                open={confirmAction === 'activation'}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title={isAccountActivated ? "Deactivate customer account?" : "Activate customer account?"}
                description={isAccountActivated
                    ? "This customer can still log in, but will see the account under review screen and will not be able to use any Customer Portal feature."
                    : "This customer will be able to access and use all Customer Portal features."}
                confirmText={isAccountActivated ? "Deactivate Account" : "Activate Account"}
                cancelText="Cancel"
                confirmVariant={isAccountActivated ? "destructive" : "default"}
                onConfirm={handleConfirmActivation}
=======
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Change Status"
                description="Are you sure you want to Change the status for this customer?"
                confirmText="Confirm"
                cancelText="Cancel"
                confirmVariant={isActive ? "destructive" : "default"}
                onConfirm={handleConfirmToggle}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                loading={isToggling}
            />
        </div>
    );
};
