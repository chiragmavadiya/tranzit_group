import type { RuleCondition, RuleConditionField, RuleSourceOption } from '../types/rules.types';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

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
    </div>
  );
}
