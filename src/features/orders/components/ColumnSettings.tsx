import { useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
// import { COLUMN_CONFIG } from '@/features/orders/constants';
import type { ColumnConfig } from '@/features/orders/types';

interface ColumnSettingsProps {
  columns: ColumnConfig[];
  visibleColumns: string[];
  onToggleColumn: (key: string) => void;
  onSetVisibleColumns: (keys: string[]) => void;
}

export function ColumnSettings({
  columns,
  visibleColumns,
  onToggleColumn,
  onSetVisibleColumns
}: ColumnSettingsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColumns = useMemo(() => {
    return columns.filter(col =>
      col.header.toLowerCase().includes(searchQuery.toLowerCase()) && !col.default
    );
  }, [searchQuery, columns]);

  const allSelected = useMemo(() => visibleColumns.length === columns.length, [visibleColumns, columns]);

  const handleToggleAll = useCallback(() => {
    if (allSelected) {
      onSetVisibleColumns(columns.filter(c => c.default).map(col => col.key));
    } else {
      onSetVisibleColumns(columns.map(col => col.key));
    }
  }, [allSelected, columns, onSetVisibleColumns]);

  return (
    <div className="flex flex-col max-h-[50vh] min-h-[300px] overflow-hidden">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="px-3 pt-3 pb-2 flex items-center justify-between font-normal">
          <span className="font-bold text-[11px] text-gray-500 uppercase tracking-widest">Column Selection</span>
          <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
            {visibleColumns.length} Selected
          </span>
        </DropdownMenuLabel>
      </DropdownMenuGroup>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search columns..."
            className="pl-8 h-8 text-xs border-gray-100 dark:border-zinc-800 focus-visible:ring-blue-500/20 bg-gray-50/50 dark:bg-zinc-900/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      <DropdownMenuSeparator className="-mx-1 border-gray-100 dark:border-zinc-800" />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        <DropdownMenuGroup>
          {/* "All" Toggle */}
          <DropdownMenuCheckboxItem
            className="font-semibold text-gray-900 dark:text-zinc-100 cursor-pointer py-2 focus:bg-blue-50 dark:focus:bg-blue-900/20"
            checked={allSelected}
            onCheckedChange={handleToggleAll}
          >
            All
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator className="-mx-1 border-gray-100 dark:border-zinc-800 border-dashed" />

          {filteredColumns.length > 0 ? (
            filteredColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.key}
                className="cursor-pointer py-1.5 text-gray-600 dark:text-zinc-300 focus:bg-gray-50 dark:focus:bg-zinc-800 transition-colors"
                checked={visibleColumns.includes(col.key)}
                onCheckedChange={() => onToggleColumn(col.key)}
              >
                {col.header}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="py-8 text-center bg-gray-50/50 dark:bg-zinc-900/50 rounded-md border border-dashed border-gray-200 dark:border-zinc-800 m-1">
              <p className="text-[10px] text-gray-400 font-medium">No match found</p>
            </div>
          )}
        </DropdownMenuGroup>
      </div>
    </div>
  );
}
