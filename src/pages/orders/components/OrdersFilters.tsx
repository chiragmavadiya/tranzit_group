import { Search, Calendar as CalendarIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ORDER_TYPES, STATUSES } from '../constants';

interface OrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  orderType: string;
  onOrderTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
}

export function OrdersFilters({
  searchQuery,
  onSearchChange,
  orderType,
  onOrderTypeChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: OrdersFiltersProps) {
  const isFilterActive = searchQuery || orderType !== 'All Types' || statusFilter !== 'All Statuses' || dateFrom || dateTo;

  const handleReset = () => {
    onSearchChange('');
    onOrderTypeChange('All Types');
    onStatusFilterChange('All Statuses');
    onDateFromChange('');
    onDateToChange('');
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-white dark:bg-zinc-950 p-2 pl-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 pointer-events-none" />
        <Input
          placeholder="Search ID, customer or products..."
          className="pl-10 h-10 border-none bg-transparent focus-visible:ring-0 text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 placeholder:font-medium text-gray-900 dark:text-zinc-100"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="hidden lg:block w-px h-6 bg-gray-200 dark:bg-zinc-800" />

      {/* Filter Controls Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Group */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 dark:bg-zinc-900/50 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-inner group transition-colors hover:bg-gray-100/80 dark:hover:bg-zinc-800/80">
          <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-zinc-400 group-hover:text-blue-500 transition-colors" />
          <div className="flex items-center gap-1">
            <Input
              type="date"
              className="h-7 w-[125px] border-none bg-transparent p-0 text-xs font-medium focus-visible:ring-0 text-gray-900 dark:text-zinc-100 invert-0 dark:invert-[0.1] brightness-100 dark:brightness-110"
              placeholder="Start"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">to</span>
            <Input
              type="date"
              className="h-7 w-[125px] border-none bg-transparent p-0 text-xs font-medium focus-visible:ring-0 text-gray-900 dark:text-zinc-100 invert-0 dark:invert-[0.1] brightness-100 dark:brightness-110"
              placeholder="End"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
        </div>

        {/* Order Type Select */}
        <Select value={orderType} onValueChange={(val) => onOrderTypeChange(val ?? 'All Types')}>
          <SelectTrigger className="h-10 w-[140px] border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold rounded-lg hover:border-blue-200 dark:hover:border-blue-900 transition-all data-[size=default]:h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_TYPES.map(type => (
              <SelectItem key={type} value={type} className="text-xs h-10">{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Select */}
        <Select value={statusFilter} onValueChange={(val) => onStatusFilterChange(val ?? 'All Statuses')}>
          <SelectTrigger className="h-10 w-[140px] border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold rounded-lg hover:border-blue-200 dark:hover:border-blue-900 transition-all data-[size=default]:h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(status => (
              <SelectItem key={status} value={status} className="text-xs h-10">{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-9 px-3 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
