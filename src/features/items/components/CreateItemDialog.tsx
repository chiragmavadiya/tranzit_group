import { useState, useCallback, useMemo, useRef, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomModel, } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ItemFormData } from '../types';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { useItemDetails } from '../hooks/useItems';

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ItemFormData) => void;
  editingItemId?: string | number;
  isLoading?: boolean;
}

export function CreateItemDialog({
  open,
  onOpenChange,
  onSubmit,
  editingItemId,
  isLoading,
}: CreateItemDialogProps) {
  const { data: detailsData, isLoading: isFetchingDetails } = useItemDetails(editingItemId);

  const initialData = useMemo(() => ({
    item_code: '',
    item_name: '',
    item_weight: 0,
    item_length: 0,
    item_width: 0,
    item_height: 0,
    item_cubic: 0,
    is_default: false,
  }), []);

  const formDataToLoad = useMemo(() => {
    if (editingItemId && detailsData?.data) {
      const item = detailsData.data;
      return {
        id: item.id,
        item_code: item.item_code || '',
        item_name: item.item_name || '',
        item_weight: Number(item.item_weight) || 0,
        item_length: Number(item.item_length) || 0,
        item_width: Number(item.item_width) || 0,
        item_height: Number(item.item_height) || 0,
        item_cubic: Number(item.item_cubic) || 0,
        is_default: Boolean(item.is_default),
      };
    }
    return initialData;
  }, [editingItemId, detailsData, initialData]);

  const formKey = editingItemId ? `edit-${editingItemId}-${detailsData?.data ? 'loaded' : 'loading'}` : 'new';

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <CustomModel
      title={editingItemId ? 'Edit Item' : 'Add New Item'}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      isLoading={!!isLoading}
      submitText={editingItemId ? 'Update' : 'Submit'}
    >
      <ItemForm
        key={formKey}
        ref={formRef}
        initialValues={formDataToLoad}
        isFetching={isFetchingDetails}
        onSubmit={onSubmit}
      />
    </CustomModel>
  )
}

interface ItemFormProps {
  initialValues: ItemFormData;
  isFetching: boolean;
  onSubmit: (data: ItemFormData) => void;
}

const ItemForm = forwardRef<HTMLFormElement, ItemFormProps>(
  ({ initialValues, isFetching, onSubmit }, ref) => {
    const [formData, setFormData] = useState<ItemFormData>(initialValues);
    const [submited, setSubmited] = useState(false);

    const handleChange = useCallback((field: keyof ItemFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback((e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setSubmited(true);

      if (!formData.item_code || !formData.item_name || !formData.item_weight) {
        return;
      }

      const submissionData = {
        ...formData,
        is_default: formData.is_default ? "on" : "off"
      } as ItemFormData;

      onSubmit(submissionData);
    }, [formData, onSubmit]);

    return (
      <form ref={ref} onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
        {isFetching && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching Details...</p>
            </div>
          </div>
        )}
        <div className="grid gap-3">
          <div className="grid gap-2">
            <FormInput
              label="Item Code"
              value={formData.item_code}
              onChange={(val) => handleChange('item_code', val)}
              placeholder="Enter item code (e.g. ITM-123)"
              required
              error={submited && !formData.item_code}
              errormsg="Item code is required"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              label="Item Name"
              value={formData.item_name}
              onChange={(val) => handleChange('item_name', val)}
              placeholder="Enter item name"
              required
              error={submited && !formData.item_name}
              errormsg="Item name is required"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              type="number"
              step="0.0001"
              label="Item Cubic (Volume)"
              value={formData.item_cubic}
              onChange={(val) => handleChange('item_cubic', Number(val))}
              placeholder="0.0000"
              required
              error={submited && Number(formData.item_cubic) <= 0}
              errormsg="Item cubic cannot be negative"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              type="number"
              label="Dead Weight (kg)"
              value={formData.item_weight}
              onChange={(val) => handleChange('item_weight', Number(val))}
              placeholder="0.00"
              required
              error={submited && Number(formData.item_weight) <= 0}
              errormsg="Weight must be greater than 0"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              type="number"
              label="Length (cm)"
              value={formData.item_length}
              onChange={(val) => handleChange('item_length', Number(val))}
              placeholder="0"
              required
              error={submited && Number(formData.item_length) <= 0}
              errormsg="Length must be greater than 0"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              type="number"
              label="Width (cm)"
              value={formData.item_width}
              onChange={(val) => handleChange('item_width', Number(val))}
              placeholder="0"
              required
              error={submited && Number(formData.item_width) <= 0}
              errormsg="Width must be greater than 0"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              type="number"
              label="Height (cm)"
              value={formData.item_height}
              onChange={(val) => handleChange('item_height', Number(val))}
              placeholder="0"
              required
              error={submited && Number(formData.item_height) <= 0}
              errormsg="Height must be greater than 0"
            />
          </div>
          <div className="flex items-center gap-3 p-1">
            <Switch
              id="isDefault"
              checked={!!formData.is_default}
              onCheckedChange={(checked) => handleChange('is_default', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="isDefault" className="text-sm font-medium text-slate-700 dark:text-zinc-300 cursor-pointer">
              Is Default Item
            </Label>
          </div>
        </div>
      </form>
    );
  }
);


