import { useState, useMemo, useRef, forwardRef, useCallback } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { COURIER_OPTIONS, CHARGE_BASIS_OPTIONS, APPLIES_ON_OPTIONS } from '../constants';
import type { CourierSurcharge } from '../types';

interface AddSurchargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<CourierSurcharge>) => void;
  initialData?: CourierSurcharge | null;
  isLoading?: boolean;
}

export function AddSurchargeDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading
}: AddSurchargeDialogProps) {
  const initialValues = useMemo(() => ({
    courierName: '',
    code: '',
    name: '',
    description: '',
    chargeBasis: 'per_consignment',
    appliesOn: 'pickup',
    amount: '',
    defaultSelected: false,
    autoApply: false,
    customerSelectable: false
  }), []);

  const formDataToLoad = useMemo(() => {
    if (initialData) {
      return {
        courierName: initialData.courierName,
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        chargeBasis: initialData.chargeBasis,
        appliesOn: initialData.appliesOn,
        amount: initialData.amount,
        defaultSelected: !!initialData.defaultSelected,
        autoApply: !!initialData.autoApply,
        customerSelectable: !!initialData.customerSelectable
      };
    }
    return initialValues;
  }, [initialData, initialValues]);

  const formKey = initialData ? `edit-${initialData.id}` : 'new';
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <CustomModel
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Surcharge" : "Add Surcharge"}
      onSubmit={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      submitText={initialData ? "Update" : "Add Surcharge"}
      isLoading={isLoading}
      contentClass="sm:max-w-[580px]"
    >
      <SurchargeForm
        key={formKey}
        ref={formRef}
        initialValues={formDataToLoad}
        onSubmit={onSubmit}
      />
    </CustomModel>
  );
}

interface SurchargeFormProps {
  initialValues: any;
  onSubmit: (data: any) => void;
}

const SurchargeForm = forwardRef<HTMLFormElement, SurchargeFormProps>(
  ({ initialValues, onSubmit }, ref) => {
    const [formData, setFormData] = useState(initialValues);
    const [submited, setSubmited] = useState(false);

    const handleChange = useCallback((field: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmited(true);

      if (!formData.courierName || !formData.code || !formData.name || !formData.amount) {
        return;
      }

      onSubmit(formData);
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4 p-2">
        <FormSelect
          label="Courier Name"
          value={formData.courierName}
          onValueChange={(val) => handleChange('courierName', val || '')}
          options={COURIER_OPTIONS}
          placeholder="Select Courier"
          required
          className="col-span-1"
          error={submited && !formData.courierName}
          errormsg="Courier Name is required"
        />

        <FormInput
          label="Code"
          value={formData.code}
          onChange={(val) => handleChange('code', val)}
          placeholder="Enter Code"
          required
          className="col-span-1"
          error={submited && !formData.code}
          errormsg="Code is required"
        />

        <FormInput
          label="Name"
          value={formData.name}
          onChange={(val) => handleChange('name', val)}
          placeholder="Enter Name"
          required
          className="col-span-2"
          error={submited && !formData.name}
          errormsg="Name is required"
        />

        <FormTextarea
          label="Description"
          value={formData.description}
          onChange={(val) => handleChange('description', val)}
          placeholder="Enter Description"
          isFullWidth
          rows={3}
          required
          error={submited && !formData.description}
          errormsg="Description is required"
        />

        <FormSelect
          label="Charge Basis"
          value={formData.chargeBasis}
          onValueChange={(val) => handleChange('chargeBasis', val || '')}
          options={CHARGE_BASIS_OPTIONS}
          placeholder="Select Basis"
          className="col-span-1"
        />

        <FormInput
          label="Amount (Ex. GST)"
          value={formData.amount}
          onChange={(val) => handleChange('amount', val)}
          placeholder="Enter Amount"
          required
          className="col-span-1"
          error={submited && !formData.amount}
          errormsg="Amount is required"
        />

        <div className="col-span-12 grid grid-cols-12 gap-4 items-center mt-2 bg-slate-50/50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="col-span-6 h-full">
            <FormSelect
              label="Applies On"
              value={formData.appliesOn}
              onValueChange={(val) => handleChange('appliesOn', val || '')}
              options={APPLIES_ON_OPTIONS}
              placeholder="Select Phase"
              className="w-full h-full justify-start"
            />
          </div>

          <div className="col-span-6 space-y-4 pl-4 border-l border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="defaultSelected" className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer">Default Selected</Label>
              <Switch
                id="defaultSelected"
                checked={formData.defaultSelected}
                onCheckedChange={(checked) => handleChange('defaultSelected', checked)}
                className="data-[state=checked]:bg-blue-600 scale-90"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="autoApply" className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer">Auto Apply</Label>
              <Switch
                id="autoApply"
                checked={formData.autoApply}
                onCheckedChange={(checked) => handleChange('autoApply', checked)}
                className="data-[state=checked]:bg-blue-600 scale-90"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="customerSelectable" className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer">Customer Selectable</Label>
              <Switch
                id="customerSelectable"
                checked={formData.customerSelectable}
                onCheckedChange={(checked) => handleChange('customerSelectable', checked)}
                className="data-[state=checked]:bg-blue-600 scale-90"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
);
