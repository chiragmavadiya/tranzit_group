import { useState, useMemo } from 'react';
import { Filter, Eraser, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Order, FilterType, FilterItem } from '../types';

interface AdvancedFilterPopoverProps {
  orders: Order[];
  onAddFilter: (filter: FilterItem) => void;
  onRemoveFilter: (filterId: string) => void;
  onReplaceFilter: (filterId: string, filter: FilterItem) => void;
  onClearAll: () => void;
  activeFilters: FilterItem[];
  onClose?: () => void;
}

export function AdvancedFilterPopover({
  orders,
  onAddFilter,
  onRemoveFilter,
  onReplaceFilter,
  onClearAll,
  activeFilters,
  onClose,
}: AdvancedFilterPopoverProps) {
  const [filterType, setFilterType] = useState<FilterType>('include');

  // Extract unique values from data
  const filterOptions = useMemo(() => {
    const categories: Record<string, string[]> = {
      'Name': [],
      'Address': ['Valid', 'Invalid'],
      'Date': [],
      'Source': [],
      'State': [],
      'Country': [],
      'Carrier': [],
      'Service': [],
      'Status': [],
      'Weight': ['<= 2', '>= 2'],
      'Tags': [],
    };

    orders.forEach(order => {
      // Name
      const name = order.receiver_payload?.name;
      if (name && !categories['Name'].includes(name)) categories['Name'].push(name);

      // Date (Month Year)
      if (order.created_at) {
        const dateParts = order.created_at.split(' ')[0].split('/');
        if (dateParts.length === 3) {
          const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`));
          if (!categories['Date'].includes(monthYear)) categories['Date'].push(monthYear);
        }
      }

      // Source
      if (order.source) {
        const sourceMatch = order.source.match(/<span>([^<]+)<\/span>/);
        const source = sourceMatch ? sourceMatch[1] : order.source;
        if (!categories['Source'].includes(source)) categories['Source'].push(source);
      }

      // State
      if (order.receiver_payload?.state && !categories['State'].includes(order.receiver_payload.state)) {
        categories['State'].push(order.receiver_payload.state);
      }

      // Country
      const country = order.receiver_payload?.country === 'AU' ? 'Australia' : order.receiver_payload?.country;
      if (country && !categories['Country'].includes(country)) categories['Country'].push(country);

      // Carrier
      if (order.courier_name && !categories['Carrier'].includes(order.courier_name)) {
        categories['Carrier'].push(order.courier_name);
      }

      // Service
      if (order.aust_post_product_type && !categories['Service'].includes(order.aust_post_product_type)) {
        categories['Service'].push(order.aust_post_product_type);
      }

      // Status
      const statusLabel = order.status === 1 ? 'Pending' : order.status === 2 ? 'Printed' : order.status === 3 ? 'Shipped' : 'Archived';
      if (!categories['Status'].includes(statusLabel)) categories['Status'].push(statusLabel);

      // Tags
      if (order.tags) {
        order.tags.forEach(tag => {
          if (!categories['Tags'].includes(tag)) categories['Tags'].push(tag);
        });
      }
    });

    return categories;
  }, [orders]);

  const handleOptionClick = (category: string, value: string) => {
    // Look for ANY filter with this category and value (ignoring current filterType)
    const existingFilter = activeFilters.find(f =>
      f.category === category &&
      f.value === value
    );

    console.log(existingFilter, "existingFilter");

    if (existingFilter) {
      if (existingFilter.type === filterType) {
        // Same type: toggle off
        onRemoveFilter(existingFilter.id);
      } else {
        // Different type: switch to current type
        onReplaceFilter(existingFilter.id, {
          id: `${category}-${value}-${filterType}`,
          category,
          value,
          type: filterType,
        });
      }
    } else {
      // Not present: add it
      onAddFilter({
        id: `${category}-${value}-${filterType}`,
        category,
        value,
        type: filterType,
      });
    }
  };

  const getActiveFilterType = (category: string, value: string): FilterType | null => {
    const found = activeFilters.find(f => f.category === category && f.value === value);
    return found ? found.type : null;
  };

  return (
    <div className="w-[480px] bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
          <Filter className="w-4 h-4" />
          <span className="text-[12px] font-bold uppercase tracking-wider">Advanced Filters</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 text-[11px] font-bold uppercase tracking-wider text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 gap-1.5"
          >
            <Eraser className="w-3.5 h-3.5" />
            Clear
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="h-8 bg-[#0060FE] hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
        {/* Filter Criteria */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">Filter Criteria</h3>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  className="peer appearance-none w-4 h-4 rounded-full border-2 border-gray-300 dark:border-zinc-700 checked:border-[#0060FE] transition-all"
                  checked={filterType === 'include'}
                  onChange={() => setFilterType('include')}
                />
                <div className="absolute w-2 h-2 rounded-full bg-[#0060FE] opacity-0 peer-checked:opacity-100 transition-all scale-0 peer-checked:scale-100" />
              </div>
              <span className="text-[13px] font-medium text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">Include</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  className="peer appearance-none w-4 h-4 rounded-full border-2 border-gray-300 dark:border-zinc-700 checked:border-red-500 transition-all"
                  checked={filterType === 'exclude'}
                  onChange={() => setFilterType('exclude')}
                />
                <div className="absolute w-2 h-2 rounded-full bg-red-500 opacity-0 peer-checked:opacity-100 transition-all scale-0 peer-checked:scale-100" />
              </div>
              <span className="text-[13px] font-medium text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">Exclude</span>
            </label>
          </div>
        </section>

        {/* Filter Options */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">Filter Options</h3>

          <div className="space-y-5">
            {Object.entries(filterOptions).map(([category, options]) => (
              options.length > 0 && (
                <div key={category} className="grid grid-cols-[100px_1fr] gap-4 items-start">
                  <span className="text-[13px] font-medium text-gray-500 dark:text-zinc-400 pt-1.5">{category}</span>
                  <div className="flex flex-wrap gap-2">
                    {options.slice(0, 4).map(option => {
                      const activeType = getActiveFilterType(category, option);
                      return (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(category, option)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border",
                            activeType
                              ? activeType === 'include'
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                              : "bg-gray-100/80 text-gray-600 border-transparent hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
