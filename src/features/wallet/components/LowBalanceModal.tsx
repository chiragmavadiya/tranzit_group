import { useNavigate } from 'react-router-dom';
import { CustomModel } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wallet, FileText, Mail } from 'lucide-react';
import { formateCurrency } from '@/lib/utils';
import { useAppSelector } from '@/hooks/store.hooks';
import { LOW_BALANCE_THRESHOLD } from '@/constants';

interface LowBalanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
}

export default function LowBalanceModal({ open, onOpenChange, balance }: LowBalanceModalProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const customerName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Customer';

  const handleViewInvoices = () => {
    onOpenChange(false);
    navigate('/invoices');
  };

  return (
    <CustomModel
      open={open}
      onOpenChange={onOpenChange}
      title="Service Reminder: Low Available Credit Balance"
      contentClass="min-w-0 sm:min-w-[500px] sm:max-w-[650px]"
      showFooter={false}
<<<<<<< HEAD
      disablePointerDismissal={true}
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    >
      <div className="flex flex-col gap-4 text-left p-1">
        {/* Greeting */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
            Hi {customerName},
          </h3>
          <p className="text-[13px] text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
            We’d like to let you know that, following your recent order, your allocated credit has fallen below{' '}
            <span className="font-semibold text-slate-900 dark:text-zinc-100">
              {formateCurrency(LOW_BALANCE_THRESHOLD)}
            </span>.
          </p>
        </div>

        {/* Balance Status Card */}
        <div className="rounded-lg border border-red-100 dark:border-red-950/40 bg-gradient-to-br from-red-50/50 to-amber-50/30 dark:from-red-950/10 dark:to-amber-950/5 p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-medium tracking-wide text-slate-700 dark:text-zinc-400">
              Current Wallet Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {formateCurrency(balance)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal">AUD</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        {/* Warning Callout Box */}
        <div className="flex gap-3 rounded-lg border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/10 p-3.5">
          <div className="flex-none mt-0.5">
            <AlertCircle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-500" />
          </div>
          <p className="text-[13px] text-amber-800 dark:text-amber-400 leading-relaxed font-medium m-0">
            To ensure there is no interruption to your shipping services, please pay any outstanding invoices as soon as possible.
          </p>
        </div>

        {/* Assistance / Support info */}
        <div className="text-[13px] text-slate-600 dark:text-zinc-400 flex flex-col gap-2 border-t border-slate-100 dark:border-zinc-800/80 pt-4 leading-relaxed">
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Mail className="h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span>
              If you have no outstanding invoices or those have been paid recently, please contact us at{' '}
              <a
                href="mailto:info@tranzitgroup.com.au"
                className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                info@tranzitgroup.com.au
              </a>.
            </span>
          </div>
          <p className="text-slate-500 dark:text-zinc-500 italic mt-1 text-[12px]">
            We appreciate your prompt attention to this matter and thank you for your continued support and cooperation.<br />
            We will also send a reminder email to your nominated email address.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-8 px-4 text-[13px] font-medium border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Dismiss
          </Button>
          <Button
            onClick={handleViewInvoices}
            className="w-full sm:w-auto h-8 px-4 text-[13px] font-semibold bg-primary hover:bg-primary/95 text-white shadow-xs flex items-center justify-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            View Invoices
          </Button>
        </div>
      </div>
    </CustomModel>
  );
}


