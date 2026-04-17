import { useMemo } from 'react';
import { FileText, Clock, AlertCircle, CheckCircle2, Wallet, DollarSign } from 'lucide-react';
import type { InvoiceStats as InvoiceStatsType } from '../types';
import { StatCard } from '@/components/common/StatCard';

interface InvoiceStatsProps {
  stats: InvoiceStatsType;
}

export function InvoiceStats({ stats }: InvoiceStatsProps) {
  const statsItems = useMemo(() => [
    {
      label: 'Total Invoice',
      value: stats.total_invoices,
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Invoice Pending',
      value: stats.invoice_pending,
      icon: Clock,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Invoice Partial',
      value: stats.invoice_partial,
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      label: 'Invoice Paid',
      value: stats.invoice_paid,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Amount Pending',
      value: `$${stats.amount_pending.toFixed(2)}`,
      icon: Wallet,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      label: 'Amount Paid',
      value: `$${stats.amount_paid.toFixed(2)}`,
      icon: DollarSign,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50 dark:bg-cyan-500/10',
    },
  ], [stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

      {statsItems.map((item) => (
        <StatCard className='p-0'  {...item} />
      ))}
    </div>
  );
}
