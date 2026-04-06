import { useState, useMemo } from 'react';
import { Search, CheckCircle2, Circle } from 'lucide-react';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { COLUMN_CONFIG } from '../constants';
import { FormInput } from './OrderFormUI';

interface ColumnSettingsProps {
  visibleColumns: string[];
  onToggleColumn: (key: string) => void;
  onSetVisibleColumns: (keys: string[]) => void;
}

export function ColumnSettings({
  visibleColumns,
  onToggleColumn,
  onSetVisibleColumns
}: ColumnSettingsProps) {
  console.log('render...');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColumns = useMemo(() => {
    return COLUMN_CONFIG.filter(col =>
      col.header.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectAll = () => {
    onSetVisibleColumns(COLUMN_CONFIG.map(col => col.key));
  };

  const handleClearAll = () => {
    // Keep at least ID visible to avoid empty table
    onSetVisibleColumns(['id_display']);
  };
  console.log(searchQuery, 'searchQuery')
  return (
    <div className="flex flex-col max-h-[calc(100vh-350px)] overflow-hidden">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="px-3 pt-3 pb-2 flex items-center justify-between font-normal">
          <span className="font-semibold text-gray-900">Columns</span>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
            {visibleColumns.length} Selected
          </span>
        </DropdownMenuLabel>
      </DropdownMenuGroup>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search columns..."
            className="pl-8 h-8 text-xs border-gray-200 focus-visible:ring-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        </div>
      </div>

      <div
        className="px-3 pb-3 flex items-center gap-2"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5"
          onClick={handleSelectAll}
        >
          <CheckCircle2 className="h-3 w-3" />
          Select All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[10px] font-bold text-gray-500 hover:text-gray-600 hover:bg-gray-50 gap-1.5"
          onClick={handleClearAll}
        >
          <Circle className="h-3 w-3" />
          Clear
        </Button>
      </div>

      <DropdownMenuSeparator className="-mx-1" />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        <DropdownMenuGroup>
          {filteredColumns.length > 0 ? (
            filteredColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.key}
                className="capitalize cursor-pointer py-1.5"
                checked={visibleColumns.includes(col.key)}
                onCheckedChange={() => onToggleColumn(col.key)}
              >
                {col.header}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="py-8 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-100 m-1">
              <p className="text-[10px] text-gray-400 font-medium">No columns match "{searchQuery}"</p>
            </div>
          )}
        </DropdownMenuGroup>
      </div>
    </div>
  );
}
