import { useState, useCallback } from 'react';
import { X, FilePlus, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { InvoiceFormData } from '../types';

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: InvoiceFormData) => void;
}

const initialData: InvoiceFormData = {
  invoice_number: '',
  zoho_invoice_number: '',
  status: 'Pending',
  customerName: '',
  customerEmail: '',
  total: 0,
  issued_date: new Date().toISOString().split('T')[0],
  till_date_paid: 0,
};

export function CreateInvoiceDialog({ isOpen, onOpenChange, onSubmit }: CreateInvoiceDialogProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = useCallback((field: keyof InvoiceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    onSubmit?.(formData);
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData(initialData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={() => !isSubmitting && onOpenChange(false)}
      />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <FilePlus className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Create New Invoice</h2>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Invoice #</Label>
              <Input 
                value={formData.invoice_number}
                onChange={(e) => handleUpdate('invoice_number', e.target.value)}
                placeholder="#0000"
                required
                className="bg-gray-50/50 dark:bg-zinc-900 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Zoho Invoice #</Label>
              <Input 
                value={formData.zoho_invoice_number}
                onChange={(e) => handleUpdate('zoho_invoice_number', e.target.value)}
                placeholder="Optional"
                className="bg-gray-50/50 dark:bg-zinc-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer Name</Label>
            <Input 
              value={formData.customerName}
              onChange={(e) => handleUpdate('customerName', e.target.value)}
              placeholder="Enter customer name"
              required
              className="bg-gray-50/50 dark:bg-zinc-900 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer Email</Label>
            <Input 
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleUpdate('customerEmail', e.target.value)}
              placeholder="customer@example.com"
              className="bg-gray-50/50 dark:bg-zinc-900 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Amount ($)</Label>
              <Input 
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => handleUpdate('total', parseFloat(e.target.value))}
                required
                className="bg-gray-50/50 dark:bg-zinc-900 focus:bg-white tabular-nums"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val: any) => handleUpdate('status', val)}
              >
                <SelectTrigger className="bg-gray-50/50 dark:bg-zinc-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-zinc-900 mt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary text-white hover:bg-primary-hover min-w-32 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
