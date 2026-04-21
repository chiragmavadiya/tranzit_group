import { useState, useCallback } from 'react';
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

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ItemFormData) => void;
  editItem?: ItemFormData | null;
  isLoading?: boolean;
}

export function CreateItemDialog({
  open,
  onOpenChange,
  onSubmit,
  editItem,
  isLoading,
}: CreateItemDialogProps) {
  // Initialize state directly from props. 
  // Because the parent uses a 'key', this component will remount (and thus re-initialize)
  // whenever the selected item changes or the dialog is closed/opened.
  const [formData, setFormData] = useState<ItemFormData>({
    item_code: editItem?.item_code || '',
    item_name: editItem?.item_name || '',
    item_weight: Number(editItem?.item_weight) || 0,
    item_length: Number(editItem?.item_length) || 0,
    item_width: Number(editItem?.item_width) || 0,
    item_height: Number(editItem?.item_height) || 0,
    item_cubic: Number(editItem?.item_cubic) || 0,
    is_default: !!editItem?.is_default,
  });

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

    // Convert boolean to "on"/"off" as expected by the API
    const submissionData = {
      ...formData,
      is_default: formData.is_default ? "on" : "off"
    } as ItemFormData;

    onSubmit(submissionData);
  }, [formData, onSubmit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100 italic!">
              {editItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-6 overflow-auto max-h-[calc(100vh-200px)]">
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
                error={submited && formData.item_cubic < 0}
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
                error={submited && formData.item_weight <= 0}
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
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-6 border-gray-200 dark:border-zinc-800 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 bg-[#0060FE] hover:bg-[#0052db] text-white font-semibold transition-all shadow-md shadow-blue-100 dark:shadow-none"
            >
              {isLoading ? 'Processing...' : (editItem ? 'Save Changes' : 'Create Item')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
