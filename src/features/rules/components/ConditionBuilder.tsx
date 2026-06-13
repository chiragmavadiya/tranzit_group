import { useMemo } from 'react';
import type { Condition } from '../types/rules.types';
import { ATTRIBUTES, OPERATORS } from '../constants/rules.constants';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ConditionBuilderProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
}

export default function ConditionBuilder({ conditions, onChange }: ConditionBuilderProps) {
  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: 'cond-' + Date.now() + Math.random().toString(36).substr(2, 5),
      attribute: 'order_number',
      operator: 'is',
      value: '',
    };
    onChange([...conditions, newCondition]);
  };

  const handleRemoveCondition = (id: string) => {
    onChange(conditions.filter(c => c.id !== id));
  };

  const handleConditionChange = (id: string, field: keyof Condition, value: any) => {
    const updated = conditions.map(c => {
      if (c.id === id) {
        const newC = { ...c, [field]: value };
        // Reset operator and value if attribute changes
        if (field === 'attribute') {
          const attr = ATTRIBUTES.find(a => a.key === value);
          const defaultOps = attr?.type ? OPERATORS[attr.type] : OPERATORS.text;
          newC.operator = defaultOps[0]?.value || '';
          newC.value = attr?.type === 'boolean' ? 'yes' : '';
        }
        return newC;
      }
      return c;
    });
    onChange(updated);
  };

  // Grouped attributes for selection
  const groupedAttributes = useMemo(() => {
    const categories: Record<string, { label: string; value: string }[]> = {};
    ATTRIBUTES.forEach(attr => {
      if (!categories[attr.category]) {
        categories[attr.category] = [];
      }
      categories[attr.category].push({
        label: attr.label,
        value: attr.key,
      });
    });

    // Flatten to a single list with category indicator in label
    return Object.entries(categories).flatMap(([, items]) =>
      items.map(item => ({
        label: `${item.label}`,
        value: item.value
      }))
    );
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wider">
          Conditions (AND logic)
        </h3>
        <Button
          type="button"
          onClick={handleAddCondition}
          className="h-8 text-[12px] font-bold text-white flex items-center gap-1.5"
          size="sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Condition
        </Button>
      </div>

      {conditions.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-md p-8 text-center text-gray-500 bg-gray-50/50 dark:bg-zinc-950/20">
          No conditions added yet. This rule will execute for all orders.
        </div>
      ) : (
        <div className="space-y-2">
          {conditions.map((cond) => {
            const attr = ATTRIBUTES.find(a => a.key === cond.attribute) || ATTRIBUTES[0];
            const ops = attr?.type ? OPERATORS[attr.type] : null;

            return (
              <div
                key={cond.id}
                className="flex items-center gap-3 bg-white dark:bg-zinc-900"
              >
                {/* Attribute Selection */}
                <div className="flex-1 min-w-[200px]">
                  <FormSelect
                    label="Attribute"
                    value={cond.attribute}
                    onValueChange={(val) => handleConditionChange(cond.id, 'attribute', val || '')}
                    options={groupedAttributes}
                    isFullWidth
                    allowClear={false}
                  />
                </div>

                {ops !== null && (<>
                  {/* Operator Selection */}
                  <div className="w-[180px]">
                    <FormSelect
                      label="Operator"
                      value={cond.operator}
                      onValueChange={(val) => handleConditionChange(cond.id, 'operator', val || '')}
                      options={ops}
                      isFullWidth
                      allowClear={false}
                    />
                  </div>

                  {/* Dynamic Value Input */}
                  <div className="flex-2 min-w-[180px]">
                    {attr.type === 'boolean' ? (
                      // Boolean fields don't need a value input if operator is Yes/No
                      <div className="h-8 flex items-center">
                        <span className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-sm border border-gray-150 dark:border-zinc-850 font-semibold w-full">
                          Condition matched if state is {cond.operator === 'yes' ? 'Yes' : 'No'}
                        </span>
                      </div>
                    ) : attr.type === 'select' && attr.options ? (
                      <FormSelect
                        label="Value"
                        value={cond.value}
                        onValueChange={(val) => handleConditionChange(cond.id, 'value', val || '')}
                        options={attr.options}
                        isFullWidth
                        allowClear={false}
                      />
                    ) : attr.type === 'multi-select' && attr.options ? (
                      <FormSelect
                        label="Value"
                        value={cond.value}
                        onValueChange={(val) => handleConditionChange(cond.id, 'value', val || '')}
                        options={attr.options}
                        isFullWidth
                        allowClear={true}
                      />
                    ) : attr.type === 'date' ? (
                      cond.operator === 'between' ? (
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={Array.isArray(cond.value) ? cond.value[0] || '' : ''}
                            onChange={(e) => {
                              const currentVal = Array.isArray(cond.value) ? cond.value : ['', ''];
                              handleConditionChange(cond.id, 'value', [e.target.value, currentVal[1]]);
                            }}
                            className="h-8 w-full rounded-sm border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm focus:outline-none focus:border-primary text-gray-800 dark:text-zinc-200"
                          />
                          <input
                            type="date"
                            value={Array.isArray(cond.value) ? cond.value[1] || '' : ''}
                            onChange={(e) => {
                              const currentVal = Array.isArray(cond.value) ? cond.value : ['', ''];
                              handleConditionChange(cond.id, 'value', [currentVal[0], e.target.value]);
                            }}
                            className="h-8 w-full rounded-sm border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm focus:outline-none focus:border-primary text-gray-800 dark:text-zinc-200"
                          />
                        </div>
                      ) : cond.operator === 'last_x_days' ? (
                        <FormInput
                          label="Number of Days"
                          type="number"
                          value={cond.value}
                          onChange={(val) => handleConditionChange(cond.id, 'value', val)}
                          isFullWidth
                          placeholder="e.g. 7"
                        />
                      ) : (
                        <input
                          type="date"
                          value={cond.value || ''}
                          onChange={(e) => handleConditionChange(cond.id, 'value', e.target.value)}
                          className="h-8 w-full rounded-sm border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm focus:outline-none focus:border-primary text-gray-800 dark:text-zinc-200"
                        />
                      )
                    ) : attr.type === 'number' ? (
                      <FormInput
                        label="Value"
                        type="number"
                        value={cond.value}
                        onChange={(val) => handleConditionChange(cond.id, 'value', val)}
                        isFullWidth
                      />
                    ) : (
                      <FormInput
                        label="Value"
                        value={cond.value}
                        onChange={(val) => handleConditionChange(cond.id, 'value', val)}
                        isFullWidth
                        placeholder="Enter value..."
                      />
                    )}
                  </div>
                </>)}

                {/* Delete Button */}
                <div className="pt-5.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCondition(cond.id)}
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
