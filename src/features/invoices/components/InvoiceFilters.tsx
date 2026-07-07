import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import DatePicker from '@/components/common/DatePicker';
import { Button } from '@/components/ui/button';

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageSize: string;
  onPageSizeChange: (value: string | null) => void;
  isAdmin?: boolean;
  selectedCustomer?: string;
  onCustomerChange?: (value: string | null) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApply: () => void;
  onClear: () => void;
}

export function InvoiceFilters({
  isAdmin,
  selectedCustomer,
  onCustomerChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
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

      <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:items-end md:gap-4">
        <DatePicker
          label="Start Date"
          date={startDate}
          setDate={onStartDateChange}
          className="w-full md:w-[180px]"
        />

        <DatePicker
          label="End Date"
          date={endDate}
          setDate={onEndDateChange}
          className="w-full md:w-[180px]"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <Button
          onClick={onApply}
          variant="default"
          size="sm"
          className="h-8 px-4 flex-1 md:flex-none"
        >
          Apply
        </Button>

        {(startDate || endDate) && (
          <Button
            onClick={onClear}
            variant="destructive"
            size="sm"
            className="h-8 px-4 flex-1 md:flex-none"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
