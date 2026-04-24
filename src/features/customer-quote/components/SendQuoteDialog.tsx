import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/features/orders/components/OrderFormUI";
import { Mail, Send } from "lucide-react";
import type { QuoteCalculations, ServiceRate } from "../../quote/types";

interface SendQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculations: QuoteCalculations;
  selectedRate: ServiceRate | null;
}

export function SendQuoteDialog({ open, onOpenChange, calculations, selectedRate }: SendQuoteDialogProps) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSending(false);
    onOpenChange(false);
    // Add success toast here if available
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Send Quote to Customer
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800">
              <p className="text-[13px] font-medium text-slate-500 dark:text-zinc-400">Selected Service</p>
              <p className="text-[15px] font-bold text-slate-900 dark:text-zinc-100">{selectedRate?.provider} - {selectedRate?.name}</p>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-500 dark:text-zinc-400">Total Quote</span>
                <span className="text-[16px] font-bold text-blue-600 dark:text-blue-400">
                  {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(calculations.total)}
                </span>
              </div>
            </div>

            <FormInput
              label="Customer Email Address"
              placeholder="customer@example.com"
              value={email}
              onChange={setEmail}
              icon={Mail}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSend}
            disabled={!email || sending}
            className="w-full bg-[#0060FE] hover:bg-blue-700 text-white gap-2 font-bold"
          >
            {sending ? (
              <span className="flex items-center gap-2 animate-pulse">
                Sending...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Quote
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
