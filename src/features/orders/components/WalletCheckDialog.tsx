import React from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { Wallet, Info, ArrowRight } from 'lucide-react';
import type { WalletCheckDialogProps } from '@/features/orders/types';
import { cn } from '@/lib/utils';

const WalletCheckDialog: React.FC<WalletCheckDialogProps> = ({
    open,
    onOpenChange,
    walletBalance,
    orderTotal,
    onConfirm,
    isPending
}) => {
    const isInsufficient = walletBalance < orderTotal;

    return (
        <CustomModel
            open={open}
            onOpenChange={onOpenChange}
            title="Wallet Balance Check"
            description="Please review your wallet balance before proceeding with the order."
            contentClass="sm:max-w-xl"
            submitText={isPending ? "Processing..." : isInsufficient ? "Continue to Payment" : "Consign Order"}
            cancelText="Cancel"
            onSubmit={onConfirm}

            isLoading={isPending}
        >
            <div className="p-2 pb-0 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0060FE]/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-[#0060FE]" />
                        </div>
                        <div>
                            <p className="my-0 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Available Balance</p>
                            <p className="my-0 text-xl font-bold text-slate-900 dark:text-zinc-100">${Number(walletBalance).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">Order Total</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">${Number(orderTotal).toFixed(2)}</span>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-zinc-800 w-full" />

                    <div className="flex justify-between items-center px-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">Remaining Balance</span>
                        <span className={cn(
                            "text-sm font-bold",
                            isInsufficient ? "text-red-500" : "text-emerald-500"
                        )}>
                            ${(walletBalance - orderTotal).toFixed(2)}
                        </span>
                    </div>
                </div>

                {isInsufficient && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg flex gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            Your wallet balance is insufficient for this order. You can still proceed if you have an alternative payment method enabled.
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Check Details</span>
                        <ArrowRight className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">
                        By confirming, you agree to deduct the order amount from your wallet balance. If the balance is insufficient, the remaining amount will be handled based on your account settings.
                    </p>
                </div>
            </div>
        </CustomModel>
    );
};

export default WalletCheckDialog;
