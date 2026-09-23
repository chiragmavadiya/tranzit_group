import React, { memo } from 'react';
import { ShoppingBag, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PlatformShippingCardProps {
  method?: string | null;
  price?: number | null;
  currency?: string | null;
}

export const PlatformShippingCard: React.FC<PlatformShippingCardProps> = memo(({
  method,
  price,
  currency = 'AUD',
}) => {
  if (!method && price == null) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs px-4 py-2.5 transition-colors duration-300">
      <div className="flex items-center gap-2 min-w-0">
        <ShoppingBag className="w-4 h-4 shrink-0 text-primary" />
        <span className="text-sm font-bold text-slate-800 dark:text-zinc-400">
          Platform Shipping Method
        </span>
        <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 font-bold uppercase text-[10px] tracking-wider px-2 py-0">
          Buyer Selected
        </Badge>
      </div>

      <div className="flex items-center gap-2 ml-auto min-w-0">
        <Tag className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-zinc-500" />
        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
          {method || 'Standard Delivery'}
        </span>
        {price != null && (
          <>
            <span className="w-px h-3.5 shrink-0 bg-slate-200 dark:bg-zinc-700" />
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
              ${Number(price).toFixed(2)}{currency ? ` ${currency}` : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
});
