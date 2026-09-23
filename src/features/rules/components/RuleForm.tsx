import { useEffect, useState } from 'react';
import type {
  RuleCondition,
  RuleConditionField,
  RuleFormType,
  ShippingRule,
} from '../types/rules.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { useRuleOptions } from '../hooks/useRules';
import ConditionBuilder from './ConditionBuilder';
import ActionBuilder, { type ActionPatch } from './ActionBuilder';
import { Loader2 } from 'lucide-react';

interface RuleFormProps {
  prefilledData?: ShippingRule | null;
  onSave: (data: RuleFormType) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const EMPTY_FORM: RuleFormType = {
  name: '',
  condition_type: 'all_orders',
  conditions: [],
  action_type: '',
  action_payload: null,
  global_courier_id: null,
  product_code: null,
  product_name: null,
  is_active: true,
};

/** Maps a rule from the API into editable form state (enum values become arrays). */
const ruleToForm = (rule: ShippingRule, conditionFields: RuleConditionField[]): RuleFormType => ({
  id: rule.id,
  name: rule.name || '',
  condition_type: rule.condition_type === 'criteria' ? 'criteria' : 'all_orders',
  conditions: (rule.conditions || []).map((condition) => {
    const field = conditionFields.find((f) => f.key === condition.field);
    if (field?.type === 'enum') {
      return {
        ...condition,
        value: String(condition.value ?? '').split(',').map((v) => v.trim()).filter(Boolean),
      };
    }
    return { ...condition };
  }),
  action_type: rule.action_type,
  action_payload: rule.action_payload ? { ...rule.action_payload } : null,
  global_courier_id: rule.global_courier_id,
  product_code: rule.product_code,
  product_name: rule.product_name,
  sort_order: rule.sort_order,
  is_active: rule.is_active,
});

export default function RuleForm({
  prefilledData,
  onSave,
  onCancel,
  isSaving = false,
}: RuleFormProps) {
  const { data: ruleOptions, isLoading: isLoadingOptions } = useRuleOptions();
  const options = ruleOptions?.data;

  const [formData, setFormData] = useState<RuleFormType>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Initialize form once options are available (needed to map enum condition values)
  useEffect(() => {
    if (prefilledData && options) {
      setFormData(ruleToForm(prefilledData, options.condition_fields || []));
    } else if (!prefilledData) {
      setFormData(EMPTY_FORM);
    }
    setSubmitted(false);
  }, [prefilledData, options]);

  const handleConditionTypeChange = (value: string) => {
    const conditionType = value === 'criteria' ? 'criteria' : 'all_orders';
    setFormData((prev) => {
      let conditions = prev.conditions;
      if (conditionType === 'criteria' && conditions.length === 0) {
        const firstField = options?.condition_fields?.[0];
        conditions = [{
          field: firstField?.key || '',
          operator: firstField?.operators?.[0]?.key || '',
          value: firstField?.type === 'boolean' ? true : '',
        }];
      }
      if (conditionType === 'all_orders') {
        conditions = [];
      }
      return { ...prev, condition_type: conditionType, conditions };
    });
  };

  const handleActionChange = (patch: ActionPatch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const isConditionValid = (condition: RuleCondition): boolean => {
    if (!condition.field || !condition.operator) return false;
    const field = options?.condition_fields?.find((f) => f.key === condition.field);
    if (field?.type === 'boolean') return true;
    if (Array.isArray(condition.value)) return condition.value.length > 0;
    return condition.value !== '' && condition.value !== null && condition.value !== undefined;
  };

  const isActionValid = (): boolean => {
    const payload = formData.action_payload || {};
    switch (formData.action_type) {
      case '':
        return false;
      case 'set_courier_product_code':
        return !!(formData.global_courier_id && formData.product_code);
      case 'set_package':
        if ((payload.mode || 'my_item') === 'my_item') return !!payload.my_item_id;
        return (['length', 'width', 'height', 'weight'] as const).every(
          (key) => payload[key] !== '' && payload[key] !== undefined && payload[key] !== null && !isNaN(Number(payload[key]))
        );
      case 'set_delivery_instructions':
        return !!(String(payload.delivery_instructions || '').trim() || String(payload.label_notes || '').trim());
      default:
        return true;
    }
  };

  const buildPayload = (): RuleFormType => {
    const conditions = formData.condition_type === 'criteria'
      ? formData.conditions.map((condition) => ({
        field: condition.field,
        operator: condition.operator,
        // Multi-select sources are stored as a comma-separated id list
        value: Array.isArray(condition.value) ? condition.value.join(',') : condition.value,
      }))
      : [];

    let actionPayload = formData.action_payload;
    if (formData.action_type === 'set_package' && actionPayload) {
      actionPayload = (actionPayload.mode || 'my_item') === 'my_item'
        ? { mode: 'my_item', my_item_id: Number(actionPayload.my_item_id) }
        : {
          mode: 'custom',
          length: Number(actionPayload.length),
          width: Number(actionPayload.width),
          height: Number(actionPayload.height),
          weight: Number(actionPayload.weight),
        };
    }

    return {
      ...formData,
      name: String(formData.name || '').trim() || null,
      conditions,
      action_payload: actionPayload,
    };
  };

  const handleSaveClick = () => {
    setSubmitted(true);

    if (!formData.action_type || !isActionValid()) return;
    if (formData.condition_type === 'criteria'
      && (formData.conditions.length === 0 || !formData.conditions.every(isConditionValid))) {
      return;
    }

    onSave(buildPayload());
  };

  if (isLoadingOptions) {
    return (
      <Card className="border border-gray-200 dark:border-zinc-800 shadow-sm rounded-md mt-6 bg-white dark:bg-zinc-950">
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-primary h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border gap-0 border-gray-200 dark:border-zinc-800 shadow-sm rounded-md overflow-hidden mt-6 bg-white dark:bg-zinc-950">
      <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wide">
            {prefilledData ? 'Edit rule' : 'Add new rule'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              {formData.is_active ? 'Active' : 'Inactive'}
            </span>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked: boolean) => setFormData((prev) => ({ ...prev, is_active: checked }))}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4 px-6 space-y-4">

        {/* Rule name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormInput
            label="Rule Name (optional)"
            value={formData.name || ''}
            onChange={(val) => setFormData((prev) => ({ ...prev, name: val }))}
            placeholder="e.g. Express for heavy NSW orders"
            isFullWidth
          />
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 my-4" />

        {/* Conditions */}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 mt-0 uppercase tracking-wide">
            Condition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormSelect
              label="Apply To"
              placeholder="Select condition type"
              value={formData.condition_type}
              onValueChange={handleConditionTypeChange}
              options={options?.condition_types?.map((item) => ({ label: item.label, value: item.key })) || []}
              isFullWidth
              allowClear={false}
              searchdisable
              required
              error={submitted && !formData.condition_type}
              errormsg="Please select a condition type"
            />
          </div>

          {formData.condition_type === 'criteria' && (
            <ConditionBuilder
              conditions={formData.conditions}
              conditionFields={options?.condition_fields || []}
              sources={options?.sources || []}
              onChange={(conditions) => setFormData((prev) => ({ ...prev, conditions }))}
              submitted={submitted}
            />
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 my-4" />

        {/* Action */}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wide">
            Action
          </h3>
          <ActionBuilder
            actionType={formData.action_type}
            actionPayload={formData.action_payload}
            globalCourierId={formData.global_courier_id}
            productCode={formData.product_code}
            actionTypes={options?.action_types || []}
            carriers={options?.carriers || []}
            products={options?.products || []}
            myItems={options?.my_items || []}
            submitted={submitted}
            onChange={handleActionChange}
          />
        </div>

        {/* Save / Cancel */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : ''}
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
