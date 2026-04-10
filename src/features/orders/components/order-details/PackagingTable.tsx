import React, { useState, useCallback, useMemo } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { TableCard } from './TableCard';
import { PACKAGING_COLUMNS } from '@/features/orders/constants';
import type { PackagingData, PackingColumn } from '@/features/orders/types';

interface PackagingTableProps {
  data: PackagingData;
  onUpdate: (field: keyof PackagingData, value: string) => void;
}

export const PackagingTable: React.FC<PackagingTableProps> = ({ data, onUpdate }) => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = useCallback(() => {
    setIsEditable((prev) => !prev);
  }, []);

  const headers = useMemo(() => PACKAGING_COLUMNS.map((col) => col.label), []);

  const footerCells = useMemo(() => [
    '',
    '1',
    '',
    '',
    '',
    '2',
    '0.0001',
    ''
  ], []);

  const renderCell = useCallback((col: PackingColumn) => {
    const isEditing = isEditable && col.editable && col.type !== 'select';

    if (!isEditing) {
      return (
        <TableCell key={col.key} className="px-5 py-4 text-xs font-medium text-gray-700 dark:text-zinc-300">
          {data[col.key]}
        </TableCell>
      );
    }

    if (col.type === 'number') {
      return (
        <TableCell key={col.key} className="px-5 py-2">
          <Input
            value={data[col.key]}
            onChange={(e) => onUpdate(col.key as keyof PackagingData, e.target.value)}
            className="h-7 w-16 text-xs border-transparent bg-transparent dark:bg-transparent shadow-none group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium"
            type="number"
          />
        </TableCell>
      );
    }

    return (
      <TableCell key={col.key} className="px-5 py-2">
        <Input
          placeholder="Scan or enter tracking"
          value={data.tracking || ''}
          onChange={(e) => onUpdate('tracking', e.target.value)}
          className="h-7 w-full text-xs border-transparent bg-transparent dark:bg-transparent shadow-none group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all"
        />
      </TableCell>
    );
  }, [data, isEditable, onUpdate]);

  return (
    <TableCard
      title="PACKAGING"
      headers={headers}
      footerCells={footerCells}
      onClick={toggleEdit}
      editable={isEditable}
    >
      <TableRow className="group/row bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors">
        {PACKAGING_COLUMNS.map(renderCell)}
      </TableRow>
    </TableCard>
  );
};
