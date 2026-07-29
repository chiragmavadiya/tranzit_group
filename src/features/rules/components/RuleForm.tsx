import { useState, useEffect } from 'react';
import type { RuleFormType, ShippingRule } from '../types/rules.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { useRuleOptions } from '../hooks/useRules';
import { Loader2 } from 'lucide-react';

interface RuleFormProps {
  prefilledData?: ShippingRule | null;
  onSave: (data: RuleFormType) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function RuleForm({
  prefilledData,
  onSave,
  onCancel,
  isSaving = false,
}: RuleFormProps) {
  const { data: ruleOptions } = useRuleOptions()
  const [formData, setFormData] = useState<RuleFormType>({
    condition_type: "",
    action_type: '',
    global_courier_id: null,
    product_code: '',
  })
  const [submitted, setSubmitted] = useState<boolean>(false)
  console.log(formData, 'formData')
  // Initialize form
  useEffect(() => {
   if (prefilledData) {
      setFormData(prefilledData)
    }
  }, [prefilledData]);

  const handleCancelClick = () => {
    onCancel();
  };

  const handleSaveClick = () => {
    setSubmitted(true)
    if (!formData.condition_type || !formData.action_type) {
      return;
    }

    if (formData.action_type === 'set_courier_product_code' && !(formData.global_courier_id && formData.product_code)) {
      return
    }
    onSave(formData);
  };

  return (
    <Card className="border gap-0 border-gray-200 dark:border-zinc-800 shadow-sm rounded-md overflow-hidden mt-6 bg-white dark:bg-zinc-950">
      <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40">
        <CardTitle className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wide">
          {prefilledData? 'Edit rule' : 'Add new rule'}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-6 space-y-4">

        {/* Condition Builder */}
        <div className='space-y-4'>
          <h3 className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 mt-0 uppercase tracking-wide">
            Condition
          </h3>
          <FormSelect
            label="Attribute"
            placeholder='Select Attribute'
            value={formData.condition_type}
            onValueChange={(val) => setFormData((prev)=>({ ...prev, condition_type: val || '' }))}
            options={ruleOptions?.data?.condition_types?.map((item: any) => ({ label: item.label, value: item.key })) || []}
            isFullWidth
            allowClear={false}
            required
            error={submitted && !formData.condition_type}
            errormsg="Please select condition"
          />
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 my-4" />

        {/* Action Builder */}
        <div className='space-y-4'>
          <h3 className="text-[14px] font-bold text-gray-800 dark:text-zinc-200 my-0 uppercase tracking-wide">
            Actions (executed in order)
          </h3>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mt-4 items-end"
          >
            {/* Action Type Select */}
            <div className="w-full">
              <FormSelect
                label="Action Type"
                placeholder='Select Action'
                value={formData.action_type}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, action_type: val || '' }))}
                options={ruleOptions?.data?.action_types?.map((item: any) => ({ label: item.label, value: item.key })) || []}
                isFullWidth
                allowClear={false}
                searchdisable
                required
                error={submitted && !formData.action_type}
                errormsg="Please select action type"
              />
            </div>
            {formData.action_type === 'set_cheapest_carrier_service' && (
              <div className="w-full md:col-span-2 h-8 flex items-center">
                <span className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-sm border border-gray-150 dark:border-zinc-800 font-semibold">
                  No parameters required for this action
                </span>
              </div>
            )}
            {formData.action_type === 'set_courier_product_code' && (
              <>
                <div className="w-full">
                  <FormSelect
                    label="Courier"
                    value={String(formData.global_courier_id)}
                    onValueChange={(newVal) => setFormData((prev) => ({ ...prev, global_courier_id: newVal || '' }))}
                    options={ruleOptions?.data?.carriers?.map((item: any) => ({ label: item.account_label, value: item.id })) || []}
                    allowClear={false}
                    placeholder='Select courier'
                    required
                    error={submitted && !formData.global_courier_id}
                    errormsg="Please select courier"
                  />
                </div>
                <div className="w-full">
                  <FormSelect
                    label="Product Code"
                    value={formData.product_code || ''}
                    onValueChange={(newVal) => setFormData((prev) => ({ ...prev, product_code: newVal || '' }))}
                    options={ruleOptions?.data?.products?.filter((item: any) => item.carrier_id === Number(formData.global_courier_id)).map((item: any) => ({ label: item.product_name + " - " + item.product_code, value: item.product_code })) || []}
                    allowClear={false}
                    placeholder='Select Product Code'
                    required
                    error={submitted && !formData.product_code}
                    errormsg="Please select product code"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Inline Save / Cancel buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : ""}
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
    </Card>
  );
}
