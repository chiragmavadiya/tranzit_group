import SelectComponent from '@/components/ui/select';

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

  return (
    <div className="flex flex-wrap items-center justify-end p-4">
      <SelectComponent
        data={[
          {
            key: 'Chirag Test (chirag@gmail.com)',
            value: 'chiragTest'
          },
          {
            key: 'Ahish Test (ahish@gmail.com)',
            value: 'ahishTest'
          },
          {
            key: 'Sagar Test (sagar@gmail.com)',
            value: 'sagarTest'
          },
        ]}
        allowClear={true}
        value={selectedCustomer}
        placeholder="Select Customer"
        className="w-64 h-8 text-xs font-bold"
        onValueChange={(value: string | null) => onCustomerChange?.(value)}
      />
    </div>
  );
}
