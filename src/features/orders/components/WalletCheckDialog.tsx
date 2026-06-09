import React from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { Wallet, Info } from 'lucide-react';
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
            title={isInsufficient ? "Insufficient Wallet Balance" : "Wallet Balance Check"}
            description={isInsufficient ? "Your wallet does not have enough funds to create this consignment." : "Please review your wallet balance before proceeding with the order."}
            contentClass="sm:max-w-xl"
            submitText={isPending ? "Processing..." : isInsufficient ? "Continue" : "Consign Order"}
            cancelText="Cancel"
            onSubmit={onConfirm}
            isLoading={isPending}
            showFooter={!isInsufficient}
        >
            <div className="p-2 pb-0 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary" />
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
                        <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                            {isInsufficient ? 'Amount Required' : 'Remaining Balance'}
                        </span>
                        <span className={cn(
                            "text-sm font-bold",
                            isInsufficient ? "text-red-500" : "text-emerald-500"
                        )}>
                            {isInsufficient ? `${(orderTotal - walletBalance).toFixed(2)}` : `${(walletBalance - orderTotal).toFixed(2)}`}
                        </span>
                    </div>
                </div>

                {isInsufficient ? (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg flex gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-[13px] font-medium text-amber-700 dark:text-amber-400">
                            Your wallet balance is insufficient for this order. Please contact Tranzit Group support team at <a href="mailto:support@tranzitgroup.com.au" className='text-primary font-bold hover:underline'>support@tranzitgroup.com.au</a>
                        </p>
                    </div>
                ) : (
                    <p className='text-sm text-slate-500 dark:text-zinc-400'>
                        This will create the consignment and immediately debit your wallet. A label will be queued automatically.
                    </p>
                )}
            </div>
        </CustomModel>
    );
};

export default WalletCheckDialog;
