<<<<<<< HEAD
import type { RuleCondition, RuleConditionField, RuleSourceOption } from '../types/rules.types';
=======
import { useMemo } from 'react';
import type { Condition } from '../types/rules.types';
import { ATTRIBUTES, OPERATORS } from '../constants/rules.constants';
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

<<<<<<< HEAD
const MAX_CONDITIONS = 20;

const BOOLEAN_VALUE_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

interface ConditionBuilderProps {
  conditions: RuleCondition[];
  conditionFields: RuleConditionField[];
  sources: RuleSourceOption[];
  onChange: (conditions: RuleCondition[]) => void;
  submitted?: boolean;
}

export default function ConditionBuilder({
  conditions,
  conditionFields,
  sources,
  onChange,
  submitted = false,
}: ConditionBuilderProps) {
  const fieldOptions = conditionFields.map((field) => ({ label: field.label, value: field.key }));
  const sourceOptions = sources.map((source) => ({ label: source.label, value: String(source.id) }));

  const getField = (key: string) => conditionFields.find((field) => field.key === key);

  const handleAddCondition = () => {
    const firstField = conditionFields[0];
    onChange([
      ...conditions,
      {
        field: firstField?.key || '',
        operator: firstField?.operators?.[0]?.key || '',
        value: firstField?.type === 'boolean' ? true : '',
      },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index: number, key: keyof RuleCondition, value: any) => {
    onChange(conditions.map((condition, i) => {
      if (i !== index) return condition;

      const updated = { ...condition, [key]: value };
      // Reset operator and value when the field changes
      if (key === 'field') {
        const field = getField(value);
        updated.operator = field?.operators?.[0]?.key || '';
        updated.value = field?.type === 'boolean' ? true : '';
      }
      // Postcode value format differs between range and comparison operators
      if (key === 'operator' && getField(updated.field)?.type === 'postcode') {
        updated.value = '';
      }
      return updated;
    }));
  };

  const isValueMissing = (condition: RuleCondition, field?: RuleConditionField) => {
    if (!field || field.type === 'boolean') return false;
    if (Array.isArray(condition.value)) return condition.value.length === 0;
    return condition.value === '' || condition.value === null || condition.value === undefined;
  };

  return (
    <div className="space-y-3">
      {conditions.map((condition, index) => {
        const field = getField(condition.field);
        const operatorOptions = (field?.operators || []).map((op) => ({ label: op.label, value: op.key }));
        const isNumericPostcode = field?.type === 'postcode'
          && (condition.operator === 'greater_than' || condition.operator === 'less_than');

        return (
          <div key={index} className="flex flex-col md:flex-row md:items-start gap-3 w-full">
            {/* Field */}
            <div className="w-full md:w-1/3">
              <FormSelect
                label={index === 0 ? 'Field' : undefined}
                placeholder="Select field"
                value={condition.field}
                onValueChange={(val) => handleConditionChange(index, 'field', val || '')}
                options={fieldOptions}
                isFullWidth
                allowClear={false}
                required
                error={submitted && !condition.field}
                errormsg="Please select a field"
              />
            </div>

            {/* Operator */}
            <div className="w-full md:w-1/4">
              <FormSelect
                label={index === 0 ? 'Operator' : undefined}
                placeholder="Select operator"
                value={condition.operator}
                onValueChange={(val) => handleConditionChange(index, 'operator', val || '')}
                options={operatorOptions}
                isFullWidth
                allowClear={false}
                searchdisable
                required
                error={submitted && !condition.operator}
                errormsg="Please select an operator"
              />
            </div>

            {/* Value */}
            <div className="w-full md:flex-1">
              {field?.type === 'boolean' ? (
                <FormSelect
                  label={index === 0 ? 'Value' : undefined}
                  value={condition.value === true || condition.value === 'yes' ? 'yes' : 'no'}
                  onValueChange={(val) => handleConditionChange(index, 'value', val === 'yes')}
                  options={BOOLEAN_VALUE_OPTIONS}
                  isFullWidth
                  allowClear={false}
                  searchdisable
                />
              ) : field?.type === 'enum' ? (
                <FormSelect
                  label={index === 0 ? 'Value' : undefined}
                  placeholder="Select source(s)"
                  value={Array.isArray(condition.value) ? condition.value : []}
                  onValueChange={(val) => handleConditionChange(index, 'value', val || [])}
                  options={sourceOptions}
                  isFullWidth
                  multiple
                  required
                  error={submitted && isValueMissing(condition, field)}
                  errormsg="Please select at least one source"
                />
              ) : (
                <FormInput
                  label={index === 0 ? 'Value' : undefined}
                  type={field?.type === 'numeric' || isNumericPostcode ? 'number' : 'text'}
                  value={condition.value ?? ''}
                  onChange={(val) => handleConditionChange(index, 'value', val)}
                  placeholder={field?.value_hint || 'Enter value...'}
                  isFullWidth
                  required
                  error={submitted && isValueMissing(condition, field)}
                  errormsg="Please enter a value"
                />
              )}
            </div>

            {/* Remove */}
            <div className={index === 0 ? 'md:pt-5.5' : ''}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={conditions.length === 1}
                onClick={() => handleRemoveCondition(index)}
                title="Remove condition"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCondition}
          disabled={conditions.length >= MAX_CONDITIONS}
          className="h-8 text-[12px] font-bold flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add condition
        </Button>
        <span className="text-xs text-gray-400 dark:text-zinc-500">
          All conditions must match (AND logic)
        </span>
      </div>
=======
interface ConditionBuilderProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
}

export default function ConditionBuilder({ conditions, onChange }: ConditionBuilderProps) {
  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: 'cond-' + Date.now() + Math.random().toString(36).substr(2, 5),
      attribute: 'all_orders',
      operator: '',
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
        <h3 className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wide">
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
                        <span className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-sm border border-gray-150 dark:border-zinc-800 font-semibold w-full">
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
                    disabled={conditions.length === 1}
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
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    </div>
  );
}
