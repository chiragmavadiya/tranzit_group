import { useState } from 'react';
import type { ShippingRule } from '../types/rules.types';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
// import { getOperatorLabel } from '../utils/rulePreview';
import {
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';

interface RuleListProps {
  rules: ShippingRule[];
  onEdit: (rule: ShippingRule) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
  isFormOpen: boolean;
  canReadWrite: boolean;
}

export default function RuleList({
  rules,
  onEdit,
  onDelete,
  onCreateClick,
  isFormOpen,
  canReadWrite
}: RuleListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column<ShippingRule>[] = [
    {
      key: 'condition_label',
      header: 'Attribute',
      width: '220px',
    },
    {
      key: 'action_label',
      header: 'Action',
      width: '260px',

    },
    {
      key: 'actionValue',
      header: 'Value',
      width: '180px',
      cell: (_, row) => row.carrier_name && row.product_name ? `${row.carrier_name} - ${row.product_name}` : '-'
    },
    ...(canReadWrite ? [{
      key: 'id',
      header: 'Actions',
      width: '100px',
      sticky: 'right' as const,
      cell: (_value: any, rule: any) => {
        return (
          <div className="flex items-center justify-end gap-1 opacity-80 group-hover/row:opacity-100 transition-opacity">
            {/* Edit Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(rule)}
              title="Edit Rule"
              className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(rule.id)}
              title="Delete Rule"
              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }] : [])
  ];

  return (
    <div className="space-y-4">
      {/* Rules Table container */}
      <div className="border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900/60 shadow-xs">
        <DataTable
          columns={columns}
          data={rules}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          // header={false}
          pagination={false}
          // searchable={false}
          totalItems={rules.length}
          exportable={false}
          searchable={false}
          header={false}
          emptyMessage="No rules found. Add one below to automate shipping options."
        />
      </div>

      {/* Add New Button matching screenshot inline flow */}
      {!isFormOpen && canReadWrite && (
        <div className="pt-2">
          <Button
            variant="default"
            onClick={onCreateClick}
          // className="h-8 text-[12px] font-bold text-white shadow-sm bg-blue-500 hover:bg-blue-600 rounded-md px-4 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add new
          </Button>
        </div>
      )}
    </div>
  );
}
