import { useState } from 'react';
import type { ShippingRule } from '../types/rules.types';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
=======
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
// import { getOperatorLabel } from '../utils/rulePreview';
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import {
  Edit2,
  Trash2,
  Plus,
<<<<<<< HEAD
  ChevronUp,
  ChevronDown,
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
} from 'lucide-react';

interface RuleListProps {
  rules: ShippingRule[];
  onEdit: (rule: ShippingRule) => void;
<<<<<<< HEAD
  onDelete: (id: number) => void;
  onCreateClick: () => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onToggleActive: (rule: ShippingRule) => void;
  isFormOpen: boolean;
  canReadWrite: boolean;
  isReordering?: boolean;
}

/** Human summary of what the rule applies, per action type */
const actionValueSummary = (rule: ShippingRule): string => {
  const payload = rule.action_payload || {};

  switch (rule.action_type) {
    case 'set_courier_product_code':
      return rule.carrier_name && rule.product_name
        ? `${rule.carrier_name} - ${rule.product_name}`
        : '-';
    case 'set_cheapest_carrier_service':
      return 'Cheapest available service';
    case 'set_package':
      if (payload.mode === 'custom') {
        return `${payload.length}x${payload.width}x${payload.height} cm, ${payload.weight} kg`;
      }
      if (rule.my_item?.missing) return 'Item no longer exists';
      return rule.my_item?.item_name || '-';
    case 'set_signature_required':
    case 'set_authority_to_leave':
    case 'set_safe_drop':
    case 'set_dangerous_goods':
      return payload.value ? 'Yes' : 'No';
    case 'set_delivery_instructions': {
      const text = [payload.delivery_instructions, payload.label_notes].filter(Boolean).join(' / ');
      return text.length > 60 ? `${text.slice(0, 60)}…` : text || '-';
    }
    default:
      return '-';
  }
};

=======
  onDelete: (id: string) => void;
  onCreateClick: () => void;
  isFormOpen: boolean;
  canReadWrite: boolean;
}

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
export default function RuleList({
  rules,
  onEdit,
  onDelete,
  onCreateClick,
<<<<<<< HEAD
  onMove,
  onToggleActive,
  isFormOpen,
  canReadWrite,
  isReordering = false,
=======
  isFormOpen,
  canReadWrite
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
}: RuleListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column<ShippingRule>[] = [
<<<<<<< HEAD
    ...(canReadWrite ? [{
      key: 'sort_order',
      header: 'Order',
      width: '70px',
      cell: (_value: any, rule: ShippingRule) => {
        const index = rules.findIndex((r) => r.id === rule.id);
        return (
          <div className="flex flex-col items-center gap-0">
            <Button
              variant="ghost"
              size="icon"
              disabled={index <= 0 || isReordering}
              onClick={() => onMove(index, 'up')}
              title="Move up"
              className="h-5 w-6 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300 cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={index === rules.length - 1 || isReordering}
              onClick={() => onMove(index, 'down')}
              title="Move down"
              className="h-5 w-6 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }] : []),
    {
      key: 'name',
      header: 'Rule',
      cell: (_, rule) => (
        <span className="font-medium text-gray-800 dark:text-zinc-200">
          {rule.name || `Rule #${rule.id}`}
        </span>
      )
    },
    {
      key: 'condition_label',
      header: 'When',
      cell: (_, rule) => (
        <span className="text-gray-600 dark:text-zinc-300" title={rule.condition_label}>
          {rule.condition_label?.length > 80 ? `${rule.condition_label.slice(0, 80)}…` : rule.condition_label}
        </span>
      )
=======
    {
      key: 'condition_label',
      header: 'Attribute',
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    },
    {
      key: 'action_label',
      header: 'Action',
<<<<<<< HEAD
=======

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    },
    {
      key: 'actionValue',
      header: 'Value',
<<<<<<< HEAD
      cell: (_, rule) => actionValueSummary(rule)
    },
    {
      key: 'is_active',
      header: 'Status',
      width: '110px',
      cell: (_, rule) => canReadWrite ? (
        <div className="flex items-center gap-2">
          <Switch
            checked={rule.is_active}
            onCheckedChange={() => onToggleActive(rule)}
          />
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            {rule.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      ) : (
        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
          {rule.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
=======
      cell: (_, row) => row.carrier_name && row.product_name ? `${row.carrier_name} - ${row.product_name}` : '-'
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    },
    ...(canReadWrite ? [{
      key: 'id',
      header: 'Actions',
      width: '100px',
      sticky: 'right' as const,
<<<<<<< HEAD
      cell: (_value: any, rule: ShippingRule) => {
        return (
          <div className="flex items-center justify-end gap-1 opacity-80 group-hover/row:opacity-100 transition-opacity">
=======
      cell: (_value: any, rule: any) => {
        return (
          <div className="flex items-center justify-end gap-1 opacity-80 group-hover/row:opacity-100 transition-opacity">
            {/* Edit Button */}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(rule)}
              title="Edit Rule"
              className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </Button>

<<<<<<< HEAD
=======
            {/* Delete Button */}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
          pagination={false}
=======
          // header={false}
          pagination={false}
          // searchable={false}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
          totalItems={rules.length}
          exportable={false}
          searchable={false}
          header={false}
          emptyMessage="No rules found. Add one below to automate shipping options."
        />
      </div>

<<<<<<< HEAD
      {/* Add New button */}
=======
      {/* Add New Button matching screenshot inline flow */}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
      {!isFormOpen && canReadWrite && (
        <div className="pt-2">
          <Button
            variant="default"
            onClick={onCreateClick}
<<<<<<< HEAD
=======
          // className="h-8 text-[12px] font-bold text-white shadow-sm bg-blue-500 hover:bg-blue-600 rounded-md px-4 flex items-center gap-1.5 cursor-pointer"
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
          >
            <Plus className="w-3.5 h-3.5" />
            Add new
          </Button>
        </div>
      )}
    </div>
  );
}
