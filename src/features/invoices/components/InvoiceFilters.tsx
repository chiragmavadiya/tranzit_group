import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageSize: string;
  onPageSizeChange: (value: string | null) => void;
  isAdmin?: boolean;
  selectedCustomer?: string;
  onCustomerChange?: (value: string | null) => void;
  dateRange: DateFilterValue;
  onDateRangeChange: (val: DateFilterValue) => void;
}

export function InvoiceFilters({
  isAdmin,
  selectedCustomer,
  onCustomerChange,
  dateRange,
  onDateRangeChange,
}: InvoiceFiltersProps) {
  const { data: customersData } = useCustomers({ per_page: 1000 }, !!isAdmin);
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-4 p-4 w-full">
      {isAdmin && (
        <div className="w-full md:w-64">
          <FormSelect
            placeholder="Select Customer"
            value={selectedCustomer!}
            onValueChange={(val) => onCustomerChange?.(val)}
            options={customersData?.data?.map((c: any) => ({
              value: c.id.toString(),
              label: `${c.first_name} ${c.last_name} (${c.email})`
            })) || []}
            className="w-full"
          />
        </div>
      )}

      <div className="w-full md:w-64 space-y-1">
        <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Date Range</span>
        <DateFilter
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
