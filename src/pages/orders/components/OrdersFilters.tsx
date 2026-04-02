import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { ORDER_TYPES, STATUSES } from '../constants';

interface OrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  orderType: string;
  onOrderTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function OrdersFilters({
  searchQuery,
  onSearchChange,
  orderType,
  onOrderTypeChange,
  statusFilter,
  onStatusFilterChange,
}: OrdersFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="md:col-span-2 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Search orders, customers..." 
          className="pl-10 h-10 border-gray-200 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="relative">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
        <Input type="date" className="pl-10 h-10 border-gray-200 text-sm" />
      </div>

      <div className="relative">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
        <Input type="date" className="pl-10 h-10 border-gray-200 text-sm" />
      </div>

      <div>
        <Select value={orderType} onValueChange={(val) => onOrderTypeChange(val ?? 'All Types')}>
          <SelectTrigger className="h-10 border-gray-200 text-sm">
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select value={statusFilter} onValueChange={(val) => onStatusFilterChange(val ?? 'All Statuses')}>
          <SelectTrigger className="h-10 border-gray-200 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
