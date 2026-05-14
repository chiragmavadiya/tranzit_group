import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { FormSelect } from '@/features/orders/components/OrderFormUI';

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageSize: string;
  onPageSizeChange: (value: string | null) => void;
  isAdmin?: boolean;
  selectedCustomer?: string;
  onCustomerChange?: (value: string | null) => void;
}

export function InvoiceFilters({
  selectedCustomer,
  onCustomerChange,
}: InvoiceFiltersProps) {
  const { data: customersData } = useCustomers({ pageSize: 1000 });
  return (
    <div className="flex flex-wrap items-center justify-end p-4">
      <FormSelect
        placeholder='Select Customers'
        value={selectedCustomer!}
        onValueChange={(val) => onCustomerChange?.(val)}
        options={customersData?.data?.map((c: any) => ({
          value: c.id.toString(),
          label: `${c.first_name} ${c.last_name}`
        })) || []}
        className='w-64'
      />
    </div>
  );
}
