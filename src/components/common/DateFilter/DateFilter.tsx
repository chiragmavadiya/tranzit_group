import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parse, format, isValid } from 'date-fns';
import type { DateFilterProps, DateFilterType } from './types';
import { calculateDateRange } from './utils';
import { QuickFilters } from './QuickFilters';
import { DateRangePicker } from './DateRangePicker';
import { FilterFooter } from './FilterFooter';

const parseDateString = (str: string | undefined): Date | undefined => {
  if (!str) return undefined;
  const parsed = parse(str, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : undefined;
};

const formatDateToString = (date: Date | undefined): string => {
  if (!date) return '';
  return format(date, 'dd/MM/yyyy');
};

export const DateFilter: React.FC<DateFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);

  // Local temporary states for popover editing
  const [tempType, setTempType] = useState<DateFilterType>(value?.type || 'thisMonth');
  const [tempFromDate, setTempFromDate] = useState<Date | undefined>(() => parseDateString(value?.from));
  const [tempToDate, setTempToDate] = useState<Date | undefined>(() => parseDateString(value?.to));

  // Sync with value prop when popover opens or value changes
  useEffect(() => {
    if (value) {
      setTempType(value.type);
      setTempFromDate(parseDateString(value.from));
      setTempToDate(parseDateString(value.to));
    }
  }, [value, open]);

  const handleSelectType = (type: DateFilterType) => {
    setTempType(type);
    if (type !== 'custom') {
      const range = calculateDateRange(type);
      setTempFromDate(range.from);
      setTempToDate(range.to);
    }
  };

  const handleApply = () => {
    const range = calculateDateRange(tempType, tempFromDate, tempToDate);
    onChange({
      type: tempType,
      from: formatDateToString(range.from),
      to: formatDateToString(range.to),
      label: range.label,
    });
    setOpen(false);
  };

  const handleCancel = () => {
    // Revert local states to value props
    if (value) {
      setTempType(value.type);
      setTempFromDate(parseDateString(value.from));
      setTempToDate(parseDateString(value.to));
    }
    setOpen(false);
  };

  const handleReset = () => {
    // Reset to default (thisMonth) and apply immediately
    const defaultType = 'thisMonth';
    const range = calculateDateRange(defaultType);
    onChange({
      type: defaultType,
      from: formatDateToString(range.from),
      to: formatDateToString(range.to),
      label: range.label,
    });
    setOpen(false);
  };

  // Determine if apply is disabled
  const isApplyDisabled = (() => {
    if (tempType === 'custom') {
      if (!tempFromDate || !tempToDate) return true;
      if (tempFromDate > tempToDate) return true;
    }
    return false;
  })();

  // Format label for display button
  const displayLabel = value?.label || 'This Month';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={className}>
        <Button
          variant="outline"
          type="button"
          className={cn(
            "h-8 px-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primary gap-2 shadow-sm",
            open && "border-primary ring-1 ring-primary/20"
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
          <span>{displayLabel}</span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 transition-transform duration-200", open && "transform rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[340px] sm:w-[360px] max-w-[calc(100vw-32px)] p-0 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg z-9999"
        align="end"
        sideOffset={6}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleCancel();
          }
        }}
      >
        <div className="flex flex-col">
          {/* Predefined Quick Filters */}
          <QuickFilters selectedType={tempType} onSelect={handleSelectType} />

          {/* Custom Date Range Picker when Custom Range is active */}
          {tempType === 'custom' && (
            <DateRangePicker
              fromDate={tempFromDate}
              toDate={tempToDate}
              onFromDateChange={setTempFromDate}
              onToDateChange={setTempToDate}
            />
          )}

          {/* Action Footer */}
          <FilterFooter
            onReset={handleReset}
            onCancel={handleCancel}
            onApply={handleApply}
            isApplyDisabled={isApplyDisabled}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
