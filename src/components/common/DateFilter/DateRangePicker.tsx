import React from 'react';
import DatePicker from '../DatePicker';

interface DateRangePickerProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  onFromDateChange: (date: Date | undefined) => void;
  onToDateChange: (date: Date | undefined) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const now = new Date();

  return (
    <div className="flex flex-col gap-2 px-3 pb-3 pt-2 border-t border-slate-100 dark:border-zinc-900 bg-slate-50/20 dark:bg-zinc-950/5">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <span className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
            From Date
          </span>
          <DatePicker
            date={fromDate}
            setDate={onFromDateChange}
            placeholder="Select date"
            disabled={{ after: toDate || now }}
            className="w-full h-8 text-[12px]"
          />
        </div>
        <div className="space-y-1">
          <span className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
            To Date
          </span>
          <DatePicker
            date={toDate}
            setDate={onToDateChange}
            placeholder="Select date"
            disabled={{ after: now }}
            className="w-full h-8 text-[12px]"
          />
        </div>
      </div>
      {fromDate && toDate && fromDate > toDate && (
        <span className="text-[10px] text-red-500 font-medium">
          * To Date cannot be before From Date.
        </span>
      )}
    </div>
  );
};
