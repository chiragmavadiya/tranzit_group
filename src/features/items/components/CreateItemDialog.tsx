import { useState, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-0 overflow-hidden">
        <ItemForm
          key={formKey}
          initialValues={formDataToLoad}
          isFetching={isFetchingDetails}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={!!isLoading}
          isEdit={!!editingItemId}
        />
      </DialogContent>
    </Dialog>
  );
}

interface ItemFormProps {
  initialValues: ItemFormData;
  isFetching: boolean;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  isEdit: boolean;
}

function ItemForm({ initialValues, isFetching, onSubmit, onCancel, isLoading, isEdit }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>(initialValues);
  const [submited, setSubmited] = useState(false);

  const handleChange = useCallback((field: keyof ItemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
      <DialogHeader className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100 italic!">
          {isEdit ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin relative">
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
              error={submited && Number(formData.item_cubic) < 0}
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
      </div>
      <DialogFooter className="gap-3 p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 border-gray-200 dark:border-zinc-800 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 h-8"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 bg-[#0060FE] hover:bg-[#0052db] text-white font-semibold transition-all shadow-md shadow-blue-100 dark:shadow-none active:scale-[0.98] h-8"
        >
          {isLoading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Create Item')}
        </Button>
      </DialogFooter>
    </form>
  );
}

