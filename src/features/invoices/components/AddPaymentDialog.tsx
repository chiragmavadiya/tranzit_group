import React, { useState } from 'react';
import { X, CreditCard, Save, RefreshCw } from 'lucide-react';
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
import { useAdminInvoicePayment } from '../hooks/useInvoices';

interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | number;
}

export function AddPaymentDialog({ isOpen, onOpenChange, invoiceId }: AddPaymentDialogProps) {
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'Bank Transfer',
    payment_date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const { add } = useAdminInvoicePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    add.mutate({
      id: invoiceId,
      data: {
        ...formData,
        amount: parseFloat(formData.amount)
      }
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          amount: '',
          payment_method: 'Bank Transfer',
          payment_date: new Date().toISOString().split('T')[0],
          note: ''
        });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={() => !add.isPending && onOpenChange(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Record Payment</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
            disabled={add.isPending}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount (AUD)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
              className="h-11 bg-slate-50/50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 focus:bg-white text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(val) => setFormData(prev => ({ ...prev, payment_method: val! }))}
              >
                <SelectTrigger className="h-11 bg-slate-50/50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</Label>
              <Input
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
                required
                className="h-11 bg-slate-50/50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Note (Optional)</Label>
            <Input
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Payment reference, tx ID, etc."
              className="h-11 bg-slate-50/50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 focus:bg-white"
            />
          </div>

          <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-zinc-900">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 font-bold h-11"
              onClick={() => onOpenChange(false)}
              disabled={add.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest text-[11px] h-11 gap-2 shadow-xl shadow-slate-200"
              disabled={add.isPending}
            >
              {add.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
