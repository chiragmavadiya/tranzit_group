import { useState, useEffect } from 'react';
import type { ShippingRule, Condition, RuleAction } from '../types/rules.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomModel } from '@/components/ui/dialog';
import ConditionBuilder from './ConditionBuilder';
import ActionBuilder from './ActionBuilder';
import { generateRuleSentence } from '../utils/rulePreview';

interface RuleFormProps {
  initialData?: ShippingRule | null;
  prefilledData?: { conditions: Condition[]; actions: RuleAction[] } | null;
  onSave: (data: Omit<ShippingRule, 'id' | 'createdAt' | 'updatedAt' | 'versionHistory'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function RuleForm({
  initialData,
  prefilledData,
  onSave,
  onCancel,
  isSaving = false
}: RuleFormProps) {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actions, setActions] = useState<RuleAction[]>([]);

  // Unsaved changes detection state
  const [hasChanges, setHasChanges] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  // Validation errors
  const [actionError, setActionError] = useState('');

  // Initialize form
  useEffect(() => {
    if (initialData) {
      setConditions(initialData.conditions || []);
      setActions(initialData.actions || []);
    } else if (prefilledData) {
      setConditions(prefilledData.conditions || []);
      setActions(prefilledData.actions || []);
    } else {
      // Show exactly one condition and action by default
      setConditions([
        {
          id: 'cond-' + Date.now(),
          attribute: 'all_orders',
          operator: '',
          value: '',
        }
      ]);
      setActions([
        {
          id: 'act-' + Date.now(),
          type: 'select_cheapest_carrier_service',
          config: {},
        }
      ]);
    }
    setHasChanges(false);
  }, [initialData, prefilledData]);

  // Detect changes
  useEffect(() => {
    if (!initialData && !prefilledData) {
      // Compare with the default single values to see if user changed anything
      const hasDiff = conditions.length > 1 ||
        actions.length > 1 ||
        (conditions[0] && conditions[0].attribute !== 'all_orders') ||
        (actions[0] && (actions[0].type !== 'set_courier_product' || JSON.stringify(actions[0].config) !== JSON.stringify({ courier: 'auspost', product_code: '' })));
      setHasChanges(hasDiff);
    } else {
      const compareSource = initialData || prefilledData;
      if (compareSource) {
        const isDifferent =
          JSON.stringify(conditions) !== JSON.stringify(compareSource.conditions) ||
          JSON.stringify(actions) !== JSON.stringify(compareSource.actions);
        setHasChanges(isDifferent);
      }
    }
  }, [conditions, actions, initialData, prefilledData]);

  const handleCancelClick = () => {
    if (hasChanges) {
      setIsDiscardModalOpen(true);
    } else {
      onCancel();
    }
  };

  const handleSaveClick = () => {
    setActionError('');

    if (actions.length === 0) {
      setActionError('At least one Action is required');
      return;
    }

    const dynamicName = generateRuleSentence(conditions, actions) || 'Rule';

    onSave({
      name: dynamicName,
      description: '',
      status: 'active',
      priority: 1,
      stopProcessing: false,
      conditions,
      actions,
    });
  };

  return (
    <Card className="border gap-0 border-gray-200 dark:border-zinc-800 shadow-sm rounded-md overflow-hidden mt-6 bg-white dark:bg-zinc-950">
      <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40">
        <CardTitle className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wider">
          {initialData ? 'Edit rule' : 'Add new rule'}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-6 space-y-4">

        {/* Condition Builder */}
        <div>
          <ConditionBuilder
            conditions={conditions}
            onChange={setConditions}
          />
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 my-4" />

        {/* Action Builder */}
        <div>
          <ActionBuilder
            actions={actions}
            onChange={setActions}
          />
          {actionError && (
            <div className="text-red-500 text-xs mt-3 font-semibold">
              {actionError}
            </div>
          )}
        </div>

        {/* Inline Save / Cancel buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
          // className="h-8 text-[12px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 cursor-pointer"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelClick}
          // className="h-8 text-[12px] font-bold text-gray-700 hover:bg-gray-50 border-gray-200 rounded-md px-4 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </CardContent>

      {/* Confirmation Modals */}
      {/* 1. Unsaved changes modal */}
      <CustomModel
        open={isDiscardModalOpen}
        onOpenChange={setIsDiscardModalOpen}
        title="Discard Unsaved Changes?"
        description="You have made modifications to this shipping rule. Are you sure you want to discard them? This action cannot be undone."
        onSubmit={() => {
          setIsDiscardModalOpen(false);
          onCancel();
        }}
        submitText="Discard Changes"
        contentClass="sm:max-w-md"
      >
        <div className="py-2 text-sm text-gray-500 dark:text-zinc-400">
          Any updates to the conditions or actions will be permanently lost.
        </div>
      </CustomModel>
    </Card>
  );
}
