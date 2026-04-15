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
}

export function CreateItemDialog({
  open,
  onOpenChange,
  onSubmit,
  editItem,
}: CreateItemDialogProps) {
  const [formData, setFormData] = useState<ItemFormData>(() => {
    if (editItem) {
      return {
        item_name: editItem.item_name,
        item_code: editItem.item_code,
        item_weight: editItem.item_weight,
        item_length: editItem.item_length,
        item_width: editItem.item_width,
        item_height: editItem.item_height,
        item_cubic: editItem.item_cubic,
        is_default: editItem.is_default,
      };
    }
    return {
      item_code: '',
      item_name: '',
      item_weight: 0,
      item_length: 0,
      item_width: 0,
      item_height: 0,
      item_cubic: 0,
      is_default: true,
    };
  });
  const [submited, setSubmited] = useState(false);

  const handleChange = useCallback((field: keyof ItemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);
    if (formData.item_code.length === 0 || formData.item_name.length === 0 || formData.item_weight === 0 || formData.item_length === 0 || formData.item_width === 0 || formData.item_height === 0 || formData.item_cubic === 0) {
      return;
    }
    onSubmit(formData);
    onOpenChange(false);
  }, [formData, onSubmit, onOpenChange]);

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
                placeholder="Enter item code (e.g. SHIP_2014)"
                required
                error={submited && formData.item_code.length < 1}
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
                error={submited && formData.item_name.length < 1}
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
                error={submited && formData.item_cubic < 1}
                errormsg="Item cubic is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                type="number"
                label="Dead Weight"
                value={formData.item_weight}
                onChange={(val) => handleChange('item_weight', Number(val))}
                placeholder="0.00"
                required
                error={submited && formData.item_weight < 1}
                errormsg="Item weight is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                type="number"
                label="Length (cm)"
                value={formData.item_length}
                onChange={(val) => handleChange('item_length', Number(val))}
                placeholder="0.00"
                required
                error={submited && formData.item_length < 1}
                errormsg="Item length is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                type="number"
                label="Width (cm)"
                value={formData.item_width}
                onChange={(val) => handleChange('item_width', Number(val))}
                placeholder="0.00"
                required
                error={submited && formData.item_width < 1}
                errormsg="Item width is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                type="number"
                label="Height (cm)"
                value={formData.item_height}
                onChange={(val) => handleChange('item_height', Number(val))}
                placeholder="0.00"
                required
                error={submited && formData.item_height < 1}
                errormsg="Item height is required"
              />
            </div>
            <div className="flex items-center gap-3 p-1">
              <Switch
                id="isDefault"
                checked={formData.is_default}
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
              className="px-6 border-gray-200 dark:border-zinc-800 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 bg-[#0060FE] hover:bg-[#0052db] text-white font-semibold transition-all shadow-md shadow-blue-100 dark:shadow-none"
            >
              {editItem ? 'Save Changes' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
