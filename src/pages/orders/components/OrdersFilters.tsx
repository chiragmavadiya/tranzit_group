import { useState } from 'react';
import { Send, ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SelectComponent from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { AdvancedFilterPopover } from './AdvancedFilterPopover';
import type { Order, FilterItem } from '../types';

interface OrdersFiltersProps {
  orders: Order[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilters: FilterItem[];
  onAddFilter: (filter: FilterItem) => void;
  onRemoveFilter: (filterId: string) => void;
  onReplaceFilter: (filterId: string, filter: FilterItem) => void;
  onClearAllFilters: () => void;
  onImportClick?: () => void;
  onCreateOrderClick?: (type: 'receiver' | 'return') => void;
}

export function OrdersFilters({
  orders,
  searchQuery,
  onSearchChange,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onReplaceFilter,
  onClearAllFilters,
  onImportClick,
  onCreateOrderClick,
}: OrdersFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 pt-[3px] bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 transition-colors">
      <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
        <SelectComponent
          className='w-[160px] h-9 text-[13px] data-[size=default]:h-9'
          data={[
            { key: "default", value: "Select view" },
            { key: "recent", value: "Recent Orders" },
            { key: "flagged", value: "Flagged" },
          ]}
          // defaultValue="default"
          placeholder="Select view"
        />

        {/* Search / Filter Input Area */}
        <div className="flex-1 flex items-center gap-2 min-w-0 ml-2">
          <div className="relative flex-1 min-w-0">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger>
                <div className={cn(
                  "min-h-[36px] w-full flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-text hover:border-blue-400 dark:hover:border-blue-500 transition-colors focus-within:ring-1 focus-within:ring-blue-500 relative",
                  isFilterOpen && "ring-1 ring-blue-500 border-blue-500"
                )}>
                  <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 cursor-pointer" />

                  {/* Active Filter Chips */}
                  {activeFilters.slice(0, 3).map(filter => (
                    <Badge
                      key={filter.id}
                      variant="secondary"
                      className={cn(
                        "h-6 gap-1 px-2 py-0 text-[11px] font-medium border animate-in zoom-in-95 duration-150",
                        filter.type === 'include'
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                      )}
                    >
                      {/* <span className="opacity-70">{filter.category}:</span> */}
                      <span>{filter.value}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFilter(filter.id);
                        }}
                        className="ml-1 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3 cursor-pointer" />
                      </button>
                    </Badge>
                  ))}

                  {activeFilters.length > 3 && (
                    <span className="text-[11px] font-medium text-gray-400 ml-1">
                      +{activeFilters.length - 3} more
                    </span>
                  )}

                  {/* Text Search Placeholder / Input */}
                  <input
                    placeholder={activeFilters.length === 0 ? "Filter orders" : ""}
                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-700 dark:text-zinc-300 placeholder:text-gray-400 min-w-[120px]"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-none z-99999" align="start" sideOffset={8}>
                <AdvancedFilterPopover
                  orders={orders}
                  activeFilters={activeFilters}
                  onAddFilter={onAddFilter}
                  onRemoveFilter={onRemoveFilter}
                  onReplaceFilter={onReplaceFilter}
                  onClearAll={onClearAllFilters}
                  onClose={() => setIsFilterOpen(false)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {activeFilters.length > 0 && (
            <button
              onClick={onClearAllFilters}
              className="shrink-0 text-red-500 hover:text-red-600 text-[13px] font-medium flex items-center gap-1 p-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Manifest All */}
        <Button
          variant="ghost"
          className="h-9 gap-2 text-[#0060FE] hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 font-bold text-[11px] uppercase tracking-wider transition-colors"
        >
          <Send className="w-3.5 h-3.5 -rotate-45 mt-[5px]" />
          <span>Manifest All</span>
        </Button>

        {/* Import Orders Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="h-9 gap-2 text-[13px] font-medium border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
              <span>Import orders</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <DropdownMenuItem className="cursor-pointer py-2 px-3 text-[13px]">
              Import from integration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImportClick} className="cursor-pointer py-2 px-3 text-[13px]">
              Import from CSV file
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2 px-3 text-[13px]">
              Load test orders
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2 px-3 text-[13px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 focus:text-red-700">
              Delete all imported unshipped orders
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create Order Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="h-9 gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white text-[13px] font-medium shadow-sm transition-all active:scale-[0.98]">
              <span>Create order</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <DropdownMenuItem
              onClick={() => onCreateOrderClick?.('receiver')}
              className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-[13px]">Standard Order</span>
                <span className="text-[11px] text-gray-500">Create a new customer order</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateOrderClick?.('return')}
              className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 mt-1"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-[13px]">Return Order</span>
                <span className="text-[11px] text-gray-500">Process an order return</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

