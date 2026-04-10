import React, { useState, useCallback, useEffect } from 'react';
import { Pencil, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect } from '../../components/OrderFormUI';
import type { ItemData } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemData | null;
  onSave: (data: ItemData) => void;
  onAddAnother?: (data: ItemData) => void;
}

const COUNTRIES = [
  { key: 'Australia', value: 'Australia' },
  { key: 'China', value: 'China' },
  { key: 'USA', value: 'USA' },
  { key: 'UK', value: 'UK' },
  { key: 'India', value: 'India' },
];

export const EditItemDialog: React.FC<EditItemDialogProps> = ({
  open,
  onOpenChange,
  item,
  onSave,
  onAddAnother
}) => {
  const [formData, setFormData] = useState<ItemData | null>(null);

  useEffect(() => {
    if (open && item) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...item });
    }
  }, [open, item]);

  const updateField = useCallback((field: keyof ItemData, value: string | number | null) => {
    setFormData((prev) => prev ? ({ ...prev, [field]: value }) : null);
  }, []);

  const handleSave = useCallback(() => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  }, [formData, onSave, onOpenChange]);

  const handleAddAnother = useCallback(() => {
    if (formData && onAddAnother) {
      onAddAnother(formData);
    }
  }, [formData, onAddAnother]);

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[40vw] p-0 gap-0 overflow-hidden outline-none border dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950">
        <DialogHeader className="px-6 py-5 flex flex-row items-start gap-4 border-b border-slate-100 dark:border-zinc-900 space-y-0">
          <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Item details
            </DialogTitle>
            <DialogDescription className="text-[12px] text-slate-500 dark:text-zinc-400 font-medium leading-tight">
              Enter the details for the item.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-[#f8fafc] dark:bg-zinc-950/20 max-h-[70vh]">
          <div className="space-y-8">
            {/* Section 1: General Details */}
            <div className="grid grid-cols-12 gap-x-6 gap-y-3">
              <div className="col-span-6">
                <FormInput
                  label="ITEM NAME"
                  value={formData.item}
                  onChange={(val: string) => updateField('item', val)}
                  placeholder='e.g "Short sleeve t-shirt"'
                  required
                />
              </div>
              <div className="col-span-6">
                <FormInput
                  label="ITEM SKU"
                  value={formData.sku}
                  onChange={(val: string) => updateField('sku', val)}
                  placeholder="Enter the Item SKU"
                  required
                />
              </div>

              <div className="col-span-12 grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <FormInput
                    label="COLOR"
                    value={formData.color || ''}
                    onChange={(val: string) => updateField('color', val)}
                  />
                </div>
                <div className="col-span-3">
                  <FormInput
                    label="SIZE"
                    value={formData.size}
                    onChange={(val: string) => updateField('size', val)}
                  />
                </div>
                <div className="col-span-2">
                  <FormInput
                    label="WEIGHT(KG)"
                    value={String(formData.weight)}
                    onChange={(val: string) => updateField('weight', Number(val))}
                    type="number"
                  />
                </div>
                <div className="col-span-2">
                  <FormInput
                    label="UNIT PRICE"
                    value={String(formData.unitPrice)}
                    onChange={(val: string) => updateField('unitPrice', Number(val))}
                    type="number"
                  />
                </div>
                <div className="col-span-2">
                  <FormInput
                    label="CURRENCY"
                    value={formData.currency || 'AUD'}
                    onChange={(val: string) => updateField('currency', val)}
                    placeholder="AUD"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
                <div className="col-span-4">
                  <FormInput
                    label="QTY ORDERED"
                    value={String(formData.qtyOrdered || 0)}
                    onChange={(val: string) => updateField('qtyOrdered', Number(val))}
                    type="number"
                  />
                </div>
                <div className="col-span-4">
                  <FormInput
                    label="QTY TO SHIP"
                    value={String(formData.ship)}
                    onChange={(val: string) => updateField('ship', Number(val))}
                    type="number"
                  />
                </div>
                <div className="col-span-4">
                  <FormInput
                    label="QTY SHIPPED"
                    value={String(formData.qtyShipped)}
                    onChange={(val: string) => updateField('qtyShipped', Number(val))}
                    type="number"
                  />
                </div>
              </div>
              <div className="col-span-4">
                <FormInput
                  label="BARCODE"
                  value={formData.barcode || ''}
                  onChange={(val: string) => updateField('barcode', val)}
                  placeholder="Enter the barcode"
                />
              </div>
              <div className="col-span-4">
                <FormInput
                  label="BIN LOCATION"
                  value={formData.binLocation || ''}
                  onChange={(val: string) => updateField('binLocation', val)}
                  placeholder="Enter the bin location"
                />
              </div>
            </div>

          </div>

          {/* Section 2: Customs Details */}
          <div className="space-y-4 mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Customs details</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Required for international shipments.</p>
            </div>

            <div className="grid grid-cols-12 gap-x-6 gap-y-3">
              <div className="col-span-4">
                <FormInput
                  label="HS CODE"
                  value={formData.hsCode || ''}
                  onChange={(val: string) => updateField('hsCode', val)}
                  placeholder="Enter the HS Code"
                />
              </div>
              <div className="col-span-4">
                <FormInput
                  label="MATERIAL"
                  value={formData.material || ''}
                  onChange={(val: string) => updateField('material', val)}
                  placeholder="Enter the materials"
                />
              </div>
              <div className="col-span-4">
                <FormSelect
                  label="COUNTRY OF ORIGIN (COO)"
                  value={formData.countryOfOrigin}
                  onValueChange={(val: string | null) => updateField('countryOfOrigin', val)}
                  options={COUNTRIES}
                  placeholder="Select the country of origin"
                />
              </div>

              <div className="col-span-4">
                <FormInput
                  label="MANUFACTURER ID (MID)"
                  value={formData.manufacturerId || ''}
                  onChange={(val: string) => updateField('manufacturerId', val)}
                  placeholder="Enter the manufacturer ID"
                />
              </div>
              <div className="col-span-4">
                <FormInput
                  label="BRAND NAME"
                  value={formData.brandName || ''}
                  onChange={(val: string) => updateField('brandName', val)}
                  placeholder="Enter the brand name"
                />
              </div>
              <div className="col-span-4">
                <FormInput
                  label="MAKE OR MODEL"
                  value={formData.makeOrModel || ''}
                  onChange={(val: string) => updateField('makeOrModel', val)}
                  placeholder="Enter the make or model"
                />
              </div>

              <div className="col-span-12">
                <FormInput
                  label="USAGE OR PURPOSE"
                  value={formData.usageOrPurpose || ''}
                  onChange={(val: string) => updateField('usageOrPurpose', val)}
                  placeholder="Enter the usage or purpose"
                  isFullWidth
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleAddAnother}
            className="flex items-center gap-2 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold h-10 px-6 uppercase text-xs hover:bg-slate-50 dark:hover:bg-zinc-900"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            ADD ANOTHER ITEM
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#40a16f] hover:bg-[#009247] text-white font-bold h-10 px-8 rounded-md flex items-center gap-2 shadow-md shadow-emerald-500/10"
          >
            <Check className="w-4 h-4" strokeWidth={3} />
            UPDATE ORDER
          </Button>
        </div>
      </DialogContent>
    </Dialog >
  );
};
