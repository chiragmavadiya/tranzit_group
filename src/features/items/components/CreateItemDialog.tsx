import { useState, useCallback, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomModel, } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import type { ItemFormData } from '../types';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { useItemDetails } from '../hooks/useItems';

interface CreateItemDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onSubmit: (data: ItemFormData) => void;
  editingItemId?: string | number | null;
  isLoading?: boolean;
}

export function CreateItemDialog({
  open,
  onClose,
  onSubmit,
  editingItemId,
  isLoading,
}: CreateItemDialogProps) {

  const [formData, setFormData] = useState<ItemFormData>({
    item_code: '',
    item_name: '',
    item_weight: undefined,
    item_length: undefined,
    item_width: undefined,
    item_height: undefined,
    item_cubic: undefined,
    is_default: false,
  });
  const [submited, setSubmited] = useState(false);
  const { data: detailsData, isLoading: isFetchingDetails } = useItemDetails(editingItemId || undefined);

  const handleChange = useCallback((field: keyof ItemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const calculatedVolume = useMemo(() => {
    const l = Number(formData.item_length)
    const w = Number(formData.item_width)
    const h = Number(formData.item_height)
    if (!l || !w || !h) return ""
    return (l * w * h / 1000000).toFixed(3) // cm³ → m³
  }, [formData.item_length, formData.item_width, formData.item_height])

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmited(true);

    if (!formData.item_code || !formData.item_name || !formData.item_weight) {
      return;
    }
    const submissionData = {
      ...formData,
      item_cubic: Number(calculatedVolume),
      is_default: formData.is_default ? "on" : "off"
    } as ItemFormData;

    onSubmit(submissionData);
  }, [formData, onSubmit, calculatedVolume]);



  useEffect(() => {
    if (!open || !detailsData?.data) return;
    const data = detailsData.data;
    setFormData({
      ...data,
      item_cubic: data.item_cubic,
      item_weight: data.item_weight,
      item_length: data.item_length,
      item_width: data.item_width,
      item_height: data.item_height,
      is_default: Boolean(data.is_default),
    })
  }, [open, detailsData])

  return (
    <CustomModel
      title={editingItemId ? 'Edit Item' : 'Add New Item'}
      open={open}
      onOpenChange={onClose}
      onSubmit={() => handleSubmit()}
      onCancel={() => onClose(false)}
      isLoading={!!isLoading}
      submitText={editingItemId ? 'Update' : 'Submit'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
        {isFetchingDetails && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching Details...</p>
            </div>
          </div>
        )}
        <div className="space-y-6">

          {/* 🔹 Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormInput
                label="Item Code"
                value={formData.item_code}
                onChange={(val) => handleChange('item_code', val)}
                placeholder="Enter item code (e.g. ITM-123)"
                required
                error={submited && !formData.item_code}
                errormsg="Please enter an item code"
              />
            </div>

            <div>
              <FormInput
                label="Item Name"
                value={formData.item_name}
                onChange={(val) => handleChange('item_name', val)}
                placeholder="Enter item name"
                required
                error={submited && !formData.item_name}
                errormsg="Please enter an item name"
              />
            </div>
          </div>

          {/* 🔹 Dimensions */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Dimensions (cm)
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FormInput
                  type="number"
                  label="Length (cm)"
                  value={formData.item_length || ''}
                  onChange={(val) => handleChange('item_length', Number(val))}
                  placeholder="0"
                  required
                  error={submited && !formData.item_length}
                  errormsg="Please enter the item length"
                />
              </div>

              <div>
                <FormInput
                  type="number"
                  label="Width (cm)"
                  value={formData.item_width || ''}
                  onChange={(val) => handleChange('item_width', Number(val))}
                  placeholder="0"
                  required
                  error={submited && !formData.item_width}
                  errormsg="Please enter the item width"
                />
              </div>

              <div>
                <FormInput
                  type="number"
                  label="Height (cm)"
                  value={formData.item_height || ''}
                  onChange={(val) => handleChange('item_height', Number(val))}
                  placeholder="0"
                  required
                  error={submited && !formData.item_height}
                  errormsg="Please enter the item height"
                />
              </div>
            </div>
          </div>

          {/* 🔹 Weight & Volume */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Weight & Volume
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  type="number"
                  label="Dead Weight (kg)"
                  value={formData.item_weight || ''}
                  onChange={(val) => handleChange('item_weight', Number(val))}
                  placeholder="0.00"
                  required
                  error={submited && !formData.item_weight}
                  errormsg="Please enter the item weight"
                />
              </div>

              <div>
                <FormInput
                  type="number"
                  step="0.0001"
                  label="Item Cubic (Volume m³)"
                  value={calculatedVolume}
                  readOnly
                  disabled
                  onChange={(val) => handleChange('item_cubic', Number(val))}
                  placeholder="0.0000"
                // required
                // error={submited && !formData.item_cubic}
                // errormsg="Please enter the item cubic"
                />
              </div>
            </div>
          </div>

          {/* 🔹 Default Toggle */}
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <p className="text-sm font-medium mb-0">Set as Default Item</p>
              <p className="text-xs text-muted-foreground mb-0">
                This item will be selected by default
              </p>
            </div>
            <Switch
              id="isDefault"
              checked={!!formData.is_default}
              onCheckedChange={(checked) => handleChange('is_default', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

        </div>
      </form>
    </CustomModel>
  )
}

