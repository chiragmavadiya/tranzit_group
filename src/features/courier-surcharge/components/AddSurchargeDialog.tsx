import { useState, useMemo, useRef, forwardRef, useCallback } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
import { GlobalCourierSelect } from './GlobalCourierSelect';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CHARGE_BASIS_OPTIONS, APPLIES_ON_OPTIONS } from '../constants';
import { useCourierSurchargeMutations, useCourierSurchargeDetails } from '../hooks/useCourierSurcharge';
import type { CourierSurcharge, CourierSurchargeFormData } from '../types';
import { Loader2 } from 'lucide-react';

interface AddSurchargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CourierSurcharge | null;
}

export function AddSurchargeDialog({
  open,
  onOpenChange,
  initialData
}: AddSurchargeDialogProps) {
  const { createSurcharge, isCreating, updateSurcharge, isUpdating } = useCourierSurchargeMutations();

  const { data: detailsResponse, isLoading: isFetching } = useCourierSurchargeDetails(
    open && initialData ? initialData.id : null
  );

  const isLoading = isCreating || isUpdating;
  const surchargeDetails = detailsResponse?.data;

  const initialValues = useMemo(() => ({
    global_courier_id: '',
    code: '',
    name: '',
    description: '',
    charge_basis: 'per_consignment',
    applies_on: 'pickup',
    amount_ex_gst: '',
    default_selected: false,
    is_auto_apply: false,
    is_customer_selectable: false
  }), []);

  const formDataToLoad = useMemo(() => {
    const data = surchargeDetails || initialData;
    if (data) {
      return {
        global_courier_id: (data as any).global_courier_id?.toString() || '',
        code: data.code,
        name: data.name,
        description: data.description,
        charge_basis: data.charge_basis,
        applies_on: data.applies_on,
        amount_ex_gst: data.amount_ex_gst?.toString(),
        default_selected: !!data.default_selected,
        is_auto_apply: !!data.is_auto_apply,
        is_customer_selectable: !!data.is_customer_selectable
      };
    }
    return initialValues;
  }, [surchargeDetails, initialData, initialValues]);

  const handleSubmit = (data: CourierSurchargeFormData) => {
    if (initialData) {
      updateSurcharge({ id: initialData.id, data }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createSurcharge(data, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const formKey = initialData ? `edit-${initialData.id}-${!!surchargeDetails}` : 'new';
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
      {isFetching && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading surcharge details...</p>
          </div>
        </div>
      )}
      <SurchargeForm
        key={formKey}
        ref={formRef}
        initialValues={formDataToLoad}
        onSubmit={handleSubmit}
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

      if (!formData.global_courier_id && !initialValues.global_courier_id) {
        // In edit mode we might not have global_courier_id in the form but it's required by API?
        // Actually the Postman says global_courier_id is required in both POST and PUT.
      }

      if (!formData.code || !formData.name || !formData.amount_ex_gst) {
        return;
      }

      onSubmit({
        ...formData,
        global_courier_id: Number(formData.global_courier_id),
        amount_ex_gst: Number(formData.amount_ex_gst)
      });
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-4 p-2">
        <GlobalCourierSelect
          value={formData.global_courier_id}
          onValueChange={(val) => handleChange('global_courier_id', val || '')}
          required
          className="col-span-1"
          error={submited && !formData.global_courier_id}
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
          name="charge_basis"
          value={formData.charge_basis}
          onValueChange={(val) => handleChange('charge_basis', val || '')}
          options={CHARGE_BASIS_OPTIONS}
          placeholder="Select Basis"
          className="col-span-1"
        />

        <FormInput
          label="Amount (Ex. GST)"
          value={formData.amount_ex_gst}
          onChange={(val) => handleChange('amount_ex_gst', val)}
          placeholder="Enter Amount"
          required
          className="col-span-1"
          error={submited && !formData.amount_ex_gst}
          errormsg="Amount is required"
        />

        <div className="col-span-12 grid grid-cols-12 gap-4 items-center mt-2 bg-slate-50/50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="col-span-6 h-full">
            <FormSelect
              label="Applies On"
              value={formData.applies_on}
              onValueChange={(val) => handleChange('applies_on', val || '')}
              options={APPLIES_ON_OPTIONS}
              placeholder="Select Phase"
              className="w-full h-full justify-start"
            />
          </div>

          <div className="col-span-6 space-y-4 pl-4 border-l border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="default_selected" className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer">Default Selected</Label>
              <Switch
                id="default_selected"
                checked={formData.default_selected}
                onCheckedChange={(checked) => handleChange('default_selected', checked)}
                className="data-[state=checked]:bg-blue-600 scale-90"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="is_auto_apply" className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer">Auto Apply</Label>
              <Switch
                id="is_auto_apply"
                checked={formData.is_auto_apply}
                onCheckedChange={(checked) => handleChange('is_auto_apply', checked)}
                className="data-[state=checked]:bg-blue-600 scale-90"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="is_customer_selectable" className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer">Customer Selectable</Label>
              <Switch
                id="is_customer_selectable"
                checked={formData.is_customer_selectable}
                onCheckedChange={(checked) => handleChange('is_customer_selectable', checked)}
                className="data-[state=checked]:bg-blue-600 scale-90"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
);
