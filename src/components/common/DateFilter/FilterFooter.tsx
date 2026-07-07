import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterFooterProps {
  onReset: () => void;
  onCancel: () => void;
  onApply: () => void;
  isApplyDisabled: boolean;
}

export const FilterFooter: React.FC<FilterFooterProps> = ({
  onReset,
  onCancel,
  onApply,
  isApplyDisabled,
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-t border-slate-100 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/10">
      <Button
        variant="ghost"
        type="button"
        size="sm"
        className="h-8 text-[12px] text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900 px-2.5 font-medium"
        onClick={onReset}
      >
        Reset
      </Button>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          type="button"
          size="sm"
          className="h-8 text-[12px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 px-2.5 font-medium"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          type="button"
          size="sm"
          className="h-8 text-[12px] font-semibold px-3"
          onClick={onApply}
          disabled={isApplyDisabled}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
};
