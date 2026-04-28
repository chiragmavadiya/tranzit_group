import { Users, CheckCircle2, MapPin, Calendar, Wallet, Edit3, UserMinus, RefreshCw, ShieldCheck, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CustomerDetails } from '../../types';
import { useVerifyCustomer, useZohoSyncCustomer, useToggleCustomerStatus } from '../../hooks/useCustomers';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CustomerHeaderProps {
    customer: CustomerDetails;
    onEdit: () => void;
}

export const CustomerHeader = ({ customer, onEdit }: CustomerHeaderProps) => {
    const navigate = useNavigate();
    const fullName = `${customer.first_name} ${customer.last_name}`;

    const { mutate: verify, isPending: isVerifying } = useVerifyCustomer();
    const { mutate: zohoSync, isPending: isSyncing } = useZohoSyncCustomer();
    const { mutate: toggleStatus, isPending: isToggling } = useToggleCustomerStatus();

    const handleVerify = () => {
        verify(customer.id, {
            onSuccess: (res) => toast.success(res.message || 'Customer verified successfully'),
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to verify customer'),
        });
    };

    const handleZohoSync = () => {
        zohoSync({ id: customer.id }, {
            onSuccess: (res) => toast.success(res.message || 'Synced with Zoho successfully'),
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to sync with Zoho'),
        });
    };

    const handleToggleStatus = () => {
        toggleStatus(customer.id, {
            onSuccess: (res) => toast.success(res.message || 'Status updated successfully'),
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update status'),
        });
    };

    return (
        <div className="flex flex-col gap-4">

            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-md border border-white/20 dark:border-zinc-800/50">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Users className="h-36 w-36 text-slate-900" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8 p-4 relative z-10">
                    <div className="relative">
                        <div className="flex h-18 w-18 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-black text-white shadow-2xl shadow-blue-500/20">
                            {fullName.slice(0, 2).toUpperCase()}
                        </div>
                        {customer.is_verified && (
                            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 p-1 shadow-lg">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-500 text-white">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col items-center md:items-start gap-4">
                        <div className="flex flex-col items-center md:items-start">
                            <div className='flex gap-2'>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{fullName}</h1>
                                {customer.is_verified && (
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-black px-3 py-1 uppercase text-[10px] tracking-widest">
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm font-bold uppercase tracking-widest">{customer.address || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Joined {customer.join_date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Wallet className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Balance: ${customer.wallet_balance}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-center md:justify-end gap-3 max-w-md">
                        <div>
                            <Button variant={"outline"} onClick={() => navigate('/admin/customers')}>
                                <ChevronLeft className='h-4 w-4 ' />
                                Back
                            </Button>
                        </div>
                        <div className='flex flex-wrap gap-3'>
                            {!customer.is_verified && (
                                <Button
                                    variant="outline"
                                    className="h-9 rounded-xl gap-2 border-emerald-100 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10"
                                    onClick={handleVerify}
                                    disabled={isVerifying}
                                >
                                    {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                    Verify
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="h-9 rounded-xl gap-2"
                                onClick={handleZohoSync}
                                disabled={isSyncing}
                            >
                                {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Zoho Sync
                            </Button>
                            <Button variant="outline" className="h-9 rounded-xl gap-2" onClick={onEdit}>
                                <Edit3 className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                className="h-9 rounded-xl gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border-none shadow-lg"
                                onClick={handleToggleStatus}
                                disabled={isToggling}
                            >
                                {isToggling ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
                                {customer.wallet_balance > 0 ? 'Deactivate' : 'Activate'}
                            </Button>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

