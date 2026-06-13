import { useState, useMemo } from 'react';
import type { ShippingRule } from '../types/rules.types';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
import { ATTRIBUTES, ACTION_TYPES } from '../constants/rules.constants';
import { getOperatorLabel } from '../utils/rulePreview';
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
}

export default function RuleList({
  rules,
  onEdit,
  onDelete,
  onCreateClick,
  isFormOpen
}: RuleListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter rules based on search
  const filteredRules = useMemo(() => {
    return rules
      .filter(rule => {
        return rule.conditions.some(c => c.attribute.toLowerCase().includes(searchTerm.toLowerCase())) ||
          rule.actions.some(a => a.type.toLowerCase().includes(searchTerm.toLowerCase()));
      })
      .sort((a, b) => a.priority - b.priority);
  }, [rules, searchTerm]);

  const columns: Column<ShippingRule>[] = [
    {
      key: 'attribute',
      header: 'Attribute',
      width: '220px',
      cell: (_value, rule) => {
        return (
          <div className="flex flex-col gap-1">
            {rule.conditions.map((cond) => {
              const attr = ATTRIBUTES.find(a => a.key === cond.attribute);
              return (
                <div key={cond.id} className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                  {attr ? attr.label : cond.attribute}
                </div>
              );
            })}
            {rule.conditions.length === 0 && (
              <div className="text-sm font-semibold text-gray-800 dark:text-zinc-200">All Orders</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'operator',
      header: 'Condition',
      width: '140px',
      cell: (_value, rule) => {
        return (
          <div className="flex flex-col gap-1">
            {rule.conditions.map((cond) => {
              const opLabel = cond.operator ? getOperatorLabel(cond.operator) : '—';
              return (
                <div key={cond.id} className="text-sm text-gray-600 dark:text-zinc-400">
                  {opLabel}
                </div>
              );
            })}
            {rule.conditions.length === 0 && (
              <div className="text-sm text-gray-400 font-semibold">—</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'value',
      header: 'Value',
      width: '150px',
      cell: (_value, rule) => {
        return (
          <div className="flex flex-col gap-1">
            {rule.conditions.map((cond) => {
              let valText = '';
              if (cond.operator === 'yes' || cond.operator === 'no') {
                valText = cond.operator === 'yes' ? 'Yes' : 'No';
              } else if (cond.operator === 'between' && Array.isArray(cond.value)) {
                valText = `${cond.value[0]} and ${cond.value[1]}`;
              } else if (cond.operator === 'last_x_days') {
                valText = `${cond.value} days`;
              } else {
                valText = cond.value !== undefined && cond.value !== null ? String(cond.value) : '—';
              }
              return (
                <div key={cond.id} className="text-sm text-gray-700 dark:text-zinc-300">
                  {valText || '—'}
                </div>
              );
            })}
            {rule.conditions.length === 0 && (
              <div className="text-sm text-gray-400 font-semibold">—</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'action',
      header: 'Action',
      width: '260px',
      cell: (_value, rule) => {
        return (
          <div className="flex flex-col gap-1">
            {rule.actions.map((act) => {
              const actType = ACTION_TYPES.find(a => a.key === act.type);
              return (
                <div key={act.id} className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                  {actType ? actType.label : act.type}
                </div>
              );
            })}
            {rule.actions.length === 0 && (
              <div className="text-sm text-gray-400 italic">No action</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'actionValue',
      header: 'Value',
      width: '180px',
      cell: (_value, rule) => {
        return (
          <div className="flex flex-col gap-1">
            {rule.actions.map((act) => {
              const config = act.config || {};
              let displayVal = '';
              switch (act.type) {
                case 'set_courier_product':
                  displayVal = config.courier && config.product_code
                    ? `${config.courier} (${config.product_code})`
                    : (config.courier || config.product_code || '-');
                  break;
                case 'select_cheapest_carrier_service':
                  displayVal = 'Cheapest Carrier/Service';
                  break;
                default:
                  displayVal = config.value ? String(config.value) : '-';
              }
              return (
                <div key={act.id} className="text-sm text-gray-700 dark:text-zinc-300">
                  {displayVal || '-'}
                </div>
              );
            })}
            {rule.actions.length === 0 && (
              <div className="text-sm text-gray-400 font-semibold">—</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'id',
      header: 'Actions',
      width: '100px',
      sticky: 'right',
      cell: (_value, rule) => {
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
    }
  ];

  return (
    <div className="space-y-4">
      {/* Rules Table container */}
      <div className="border border-gray-200 dark:border-zinc-850 rounded-md overflow-hidden bg-white dark:bg-zinc-900/60 shadow-xs">
        <DataTable
          columns={columns}
          data={filteredRules}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          // header={false}
          pagination={false}
          // searchable={false}
          totalItems={filteredRules.length}
          exportable={false}
          emptyMessage="No rules found. Add one below to automate shipping options."
        />
      </div>

      {/* Add New Button matching screenshot inline flow */}
      {!isFormOpen && (
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
