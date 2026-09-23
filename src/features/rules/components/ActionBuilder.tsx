<<<<<<< HEAD
import type {
  RuleActionTypeKey,
  RuleActionTypeOption,
  RuleCarrierOption,
  RuleMyItem,
  RuleProductOption,
} from '../types/rules.types';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';

const BOOLEAN_ACTIONS: RuleActionTypeKey[] = [
  'set_signature_required',
  'set_authority_to_leave',
  'set_safe_drop',
  'set_dangerous_goods',
];

const YES_NO_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const PACKAGE_MODE_OPTIONS = [
  { label: 'Use an item from My Items', value: 'my_item' },
  { label: 'Custom dimensions & weight', value: 'custom' },
];

export interface ActionPatch {
  action_type?: RuleActionTypeKey | '';
  action_payload?: Record<string, any> | null;
  global_courier_id?: number | null;
  product_code?: string | null;
  product_name?: string | null;
}

interface ActionBuilderProps {
  actionType: RuleActionTypeKey | '';
  actionPayload: Record<string, any> | null;
  globalCourierId: number | null;
  productCode: string | null;
  actionTypes: RuleActionTypeOption[];
  carriers: RuleCarrierOption[];
  products: RuleProductOption[];
  myItems: RuleMyItem[];
  submitted?: boolean;
  onChange: (patch: ActionPatch) => void;
}

export default function ActionBuilder({
  actionType,
  actionPayload,
  globalCourierId,
  productCode,
  actionTypes,
  carriers,
  products,
  myItems,
  submitted = false,
  onChange,
}: ActionBuilderProps) {
  const payload = actionPayload || {};

  const actionTypeOptions = actionTypes.map((action) => ({ label: action.label, value: action.key }));

  const carrierOptions = carriers.map((carrier) => ({
    label: carrier.name || carrier.account_label,
    value: String(carrier.id),
  }));

  const productOptions = products
    .filter((product) => product.carrier_id === Number(globalCourierId))
    .map((product) => ({
      label: `${product.product_name} - ${product.product_code}`,
      value: product.product_code,
    }));

  const myItemOptions = myItems.map((item) => ({
    label: `${item.item_name} (${item.item_length}x${item.item_width}x${item.item_height} cm, ${item.item_weight} kg)`,
    value: String(item.id),
  }));

  const handleActionTypeChange = (value: string) => {
    const nextType = (value || '') as RuleActionTypeKey | '';
    // Reset payload/courier fields to sensible defaults for the new type
    let nextPayload: Record<string, any> | null = null;
    if (BOOLEAN_ACTIONS.includes(nextType as RuleActionTypeKey)) {
      nextPayload = { value: true };
    } else if (nextType === 'set_package') {
      nextPayload = { mode: 'my_item' };
    } else if (nextType === 'set_delivery_instructions') {
      nextPayload = { delivery_instructions: '', label_notes: '' };
    }

    onChange({
      action_type: nextType,
      action_payload: nextPayload,
      global_courier_id: null,
      product_code: null,
      product_name: null,
    });
  };

  const updatePayload = (patch: Record<string, any>) => {
    onChange({ action_payload: { ...payload, ...patch } });
  };

  const instructionsLength = String(payload.delivery_instructions || '').length;
  const labelNotesLength = String(payload.label_notes || '').length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full items-start">
        {/* Action Type */}
        <div className="w-full">
          <FormSelect
            label="Action Type"
            placeholder="Select action"
            value={actionType}
            onValueChange={handleActionTypeChange}
            options={actionTypeOptions}
            isFullWidth
            allowClear={false}
            required
            error={submitted && !actionType}
            errormsg="Please select an action type"
          />
        </div>

        {/* Set Courier & Product Code */}
        {actionType === 'set_courier_product_code' && (
          <>
            <div className="w-full">
              <FormSelect
                label="Courier"
                placeholder="Select courier"
                value={globalCourierId ? String(globalCourierId) : ''}
                onValueChange={(val) => onChange({
                  global_courier_id: val ? Number(val) : null,
                  product_code: null,
                  product_name: null,
                })}
                options={carrierOptions}
                isFullWidth
                allowClear={false}
                required
                error={submitted && !globalCourierId}
                errormsg="Please select a courier"
              />
            </div>
            <div className="w-full">
              <FormSelect
                label="Product Code"
                placeholder="Select product code"
                value={productCode || ''}
                onValueChange={(val) => {
                  const product = products.find(
                    (p) => p.carrier_id === Number(globalCourierId) && p.product_code === val
                  );
                  onChange({
                    product_code: val || null,
                    product_name: product?.product_name || null,
                  });
                }}
                options={productOptions}
                isFullWidth
                allowClear={false}
                required
                error={submitted && !productCode}
                errormsg="Please select a product code"
              />
            </div>
          </>
        )}

        {/* Cheapest carrier — no parameters */}
        {actionType === 'set_cheapest_carrier_service' && (
          <div className="w-full md:col-span-2 md:pt-5.5">
            <span className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-sm border border-gray-150 dark:border-zinc-800 font-semibold inline-block">
              No parameters required — the cheapest available carrier/service is selected per order
            </span>
          </div>
        )}

        {/* Boolean actions */}
        {BOOLEAN_ACTIONS.includes(actionType as RuleActionTypeKey) && (
          <div className="w-full">
            <FormSelect
              label="Set To"
              value={payload.value === false ? 'no' : 'yes'}
              onValueChange={(val) => updatePayload({ value: val === 'yes' })}
              options={YES_NO_OPTIONS}
              isFullWidth
              allowClear={false}
              searchdisable
            />
          </div>
        )}

        {/* Set Package */}
        {actionType === 'set_package' && (
          <div className="w-full">
            <FormSelect
              label="Package Source"
              value={payload.mode || 'my_item'}
              onValueChange={(val) => onChange({ action_payload: { mode: val || 'my_item' } })}
              options={PACKAGE_MODE_OPTIONS}
              isFullWidth
              allowClear={false}
              searchdisable
            />
          </div>
        )}
      </div>

      {/* Set Package — My Item selector */}
      {actionType === 'set_package' && (payload.mode || 'my_item') === 'my_item' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          <div className="w-full md:col-span-2">
            <FormSelect
              label="My Item"
              placeholder={myItemOptions.length ? 'Select item' : 'No items found in My Items'}
              value={payload.my_item_id ? String(payload.my_item_id) : ''}
              onValueChange={(val) => updatePayload({ my_item_id: val ? Number(val) : null })}
              options={myItemOptions}
              isFullWidth
              allowClear={false}
              required
              error={submitted && !payload.my_item_id}
              errormsg="Please select an item"
            />
          </div>
        </div>
      )}

      {/* Set Package — custom dimensions */}
      {actionType === 'set_package' && payload.mode === 'custom' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {(['length', 'width', 'height'] as const).map((dimension) => (
            <FormInput
              key={dimension}
              label={`${dimension.charAt(0).toUpperCase() + dimension.slice(1)} (cm)`}
              type="number"
              value={payload[dimension] ?? ''}
              onChange={(val) => updatePayload({ [dimension]: val })}
              placeholder="1 - 200"
              isFullWidth
              required
              error={submitted && (payload[dimension] === '' || payload[dimension] === undefined || payload[dimension] === null)}
              errormsg="Required"
            />
          ))}
          <FormInput
            label="Weight (kg)"
            type="number"
            value={payload.weight ?? ''}
            onChange={(val) => updatePayload({ weight: val })}
            placeholder="0.01 - 1000"
            isFullWidth
            required
            error={submitted && (payload.weight === '' || payload.weight === undefined || payload.weight === null)}
            errormsg="Required"
          />
        </div>
      )}

      {/* Delivery instructions / label notes */}
      {actionType === 'set_delivery_instructions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          <div className="w-full space-y-1">
            <FormTextarea
              label="Delivery Instructions"
              value={payload.delivery_instructions || ''}
              onChange={(val) => updatePayload({ delivery_instructions: String(val).slice(0, 500) })}
              placeholder="e.g. Leave at front door"
              rows={3}
              isFullWidth
              error={submitted && !String(payload.delivery_instructions || '').trim() && !String(payload.label_notes || '').trim()}
              errormsg="Enter delivery instructions or label notes"
            />
            <div className="text-[11px] text-gray-400 dark:text-zinc-500 text-right">{instructionsLength}/500</div>
          </div>
          <div className="w-full space-y-1">
            <FormTextarea
              label="Label Notes"
              value={payload.label_notes || ''}
              onChange={(val) => updatePayload({ label_notes: String(val).slice(0, 500) })}
              placeholder="e.g. Fragile - handle with care"
              rows={3}
              isFullWidth
            />
            <div className="text-[11px] text-gray-400 dark:text-zinc-500 text-right">{labelNotesLength}/500</div>
          </div>
=======
import { useMemo } from 'react';
import type { RuleAction } from '../types/rules.types';
import { ACTION_TYPES } from '../constants/rules.constants';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { useIntegrationsList, useIntegrationStatus } from '@/features/integrations/hooks/useIntegrations';

interface ActionBuilderProps {
  actions: RuleAction[];
  onChange: (actions: RuleAction[]) => void;
}

export default function ActionBuilder({ actions, onChange }: ActionBuilderProps) {

  const { data: listIntegration } = useIntegrationsList();

  // Get selected courier slug from the config
  const selectedCourier = actions[0]?.config?.courier;

  // Fetch integration status/details for the selected courier
  const { data: integrationDetails } = useIntegrationStatus(
    selectedCourier,
    !!selectedCourier && actions[0]?.type === 'set_courier_product'
  );

  const handleActionChange = (id: string, field: keyof RuleAction, value: any) => {
    const updated = actions.map(a => {
      if (a.id === id) {
        const newA = { ...a, [field]: value };
        // Reset config if type changes
        if (field === 'type') {
          const actType = ACTION_TYPES.find(at => at.key === value);
          const newConfig: Record<string, any> = {};
          if (actType && actType.fields.length > 0) {
            actType.fields.forEach(f => {
              newConfig[f.name] = f.options ? f.options[0]?.value : '';
            });
          }
          newA.config = newConfig;
        }
        return newA;
      }
      return a;
    });
    onChange(updated);
  };

  const handleActionConfigChange = (id: string, fieldName: string, value: any) => {
    const updated = actions.map(a => {
      if (a.id === id) {
        const newConfig = {
          ...a.config,
          [fieldName]: value
        };
        // Reset product_code if courier changes
        if (fieldName === 'courier') {
          newConfig.product_code = '';
        }
        return {
          ...a,
          config: newConfig
        };
      }
      return a;
    });
    onChange(updated);
  };

  // Group action types by category for the select dropdown
  const groupedActionTypes = useMemo(() => {
    const categories: Record<string, { label: string; value: string }[]> = {};
    ACTION_TYPES.forEach(act => {
      if (!categories[act.category]) {
        categories[act.category] = [];
      }
      categories[act.category].push({
        label: act.label,
        value: act.key
      });
    });

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
          Actions (executed in order)
        </h3>
      </div>

      {actions.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-8 text-center text-gray-500 bg-gray-50/50 dark:bg-zinc-950/20">
          No actions configured.
        </div>
      ) : (
        <div className="space-y-2">
          {actions.map((action) => {
            const actType = ACTION_TYPES.find(a => a.key === action.type) || ACTION_TYPES[0];

            return (
              <div
                key={action.id}
                className="flex flex-col md:flex-row items-end gap-3 w-full"
              >
                {/* Action Type Select */}
                <div className="w-full md:w-1/3">
                  <FormSelect
                    label="Action Type"
                    value={action.type}
                    onValueChange={(val) => handleActionChange(action.id, 'type', val || '')}
                    options={groupedActionTypes}
                    isFullWidth
                    allowClear={false}
                  />
                </div>

                {/* Dynamic Configuration Form */}
                <div className="flex-1 w-full flex flex-col md:flex-row items-end gap-3">
                  {actType.fields.length === 0 ? (
                    <div className="w-full md:w-2/3 h-8 flex items-center">
                      <span className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-sm border border-gray-150 dark:border-zinc-800 font-semibold">
                        No parameters required for this action
                      </span>
                    </div>
                  ) : (
                    actType.fields.map(field => {
                      const val = action.config?.[field.name] ?? '';

                      // Determine the options to use
                      let fieldOptions = field.options || [];
                      if (field.name === 'courier') {
                        const connectedCouriers = listIntegration?.data?.courier_integrations
                          ?.filter((c: any) => c.connected)
                          ?.map((c: any) => ({
                            label: c.name,
                            value: c.slug
                          })) || [];
                        if (connectedCouriers.length > 0) {
                          fieldOptions = connectedCouriers;
                        }
                      } else if (field.name === 'product_code') {
                        const products = (integrationDetails as any)?.data?.products || (integrationDetails as any)?.products || [];
                        const enabledProducts = products
                          ?.filter((p: any) => p.enabled)
                          ?.map((p: any) => ({
                            label: `${p.product_name} (${p.product_code})`,
                            value: p.product_code
                          })) || [];
                        if (enabledProducts.length > 0) {
                          fieldOptions = enabledProducts;
                        }
                      }

                      return (
                        <div key={field.name} className="w-full md:w-1/2">
                          {field.type === 'select' && fieldOptions ? (
                            <FormSelect
                              label={field.label}
                              value={val}
                              onValueChange={(newVal) => handleActionConfigChange(action.id, field.name, newVal || '')}
                              options={fieldOptions}
                              allowClear={false}
                            />
                          ) : field.type === 'number' ? (
                            <FormInput
                              label={field.label}
                              type="number"
                              value={val}
                              onChange={(newVal) => handleActionConfigChange(action.id, field.name, newVal)}
                              placeholder={field.placeholder}
                            />
                          ) : (
                            <FormInput
                              label={field.label}
                              value={val}
                              onChange={(newVal) => handleActionConfigChange(action.id, field.name, newVal)}
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
        </div>
      )}
    </div>
  );
}
