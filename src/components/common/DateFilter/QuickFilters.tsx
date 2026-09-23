import React from 'react';
import type { DateFilterType } from './types';
import { QUICK_FILTER_OPTIONS } from './utils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickFiltersProps {
  selectedType: DateFilterType;
  onSelect: (type: DateFilterType) => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-1.5 p-3">
      {QUICK_FILTER_OPTIONS.map((option) => {
        const isActive = selectedType === option.type;
        return (
          <Button
            key={option.type}
            variant="ghost"
            type="button"
            className={cn(
              "justify-between h-8.5 px-3 text-[12px] font-medium rounded-lg transition-all duration-200 border border-slate-100/50 dark:border-zinc-800/50",
              isActive
                ? "bg-primary text-white hover:bg-primary/95 hover:text-white shadow-sm"
                : "bg-slate-200/50 hover:bg-slate-100/70 text-slate-700 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 dark:text-zinc-300"
            )}
            onClick={() => onSelect(option.type)}
          >
            <span>{option.label}</span>
            {isActive && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
          </Button>
        );
      })}
    </div>
  );
};
