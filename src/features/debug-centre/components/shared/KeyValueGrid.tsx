import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface KeyValueItem {
  label: string;
  value: ReactNode;
  className?: string
}

interface KeyValueGridProps {
  items: KeyValueItem[];
  className?: string;
}

export const KeyValueGrid = ({ items, className }: KeyValueGridProps) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-4', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
            {item.label}
          </span>
          <span className={cn("text-sm font-medium text-slate-900 dark:text-white break-all", item.className)}>
            {item.value || '-'}
          </span>
        </div>
      ))}
    </div>
  );
};
