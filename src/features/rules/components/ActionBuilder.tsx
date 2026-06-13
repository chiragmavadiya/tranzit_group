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
        <h3 className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wider">
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
                      <span className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-sm border border-gray-150 dark:border-zinc-850 font-semibold">
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
        </div>
      )}
    </div>
  );
}
