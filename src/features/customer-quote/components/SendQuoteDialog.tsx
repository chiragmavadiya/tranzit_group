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
import type { QuoteCalculations, ServiceRate, QuoteLocation } from "../../quote/types";
import { useCreateQuote } from '../../quote/hooks/useQuote';
import { showToast } from '@/components/ui/custom-toast';
import type { ItemData } from '@/features/orders/types';

interface SendQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculations: QuoteCalculations;
  courierData: ServiceRate | null;
  locations: {
    sender: QuoteLocation | null;
    receiver: QuoteLocation | null;
  };
  items: ItemData[];
  margin: string;
  pickupCharge: number;
}

export function SendQuoteDialog({
  open,
  onOpenChange,
  calculations,
  courierData,
  locations,
  items,
  margin,
  pickupCharge
}: SendQuoteDialogProps) {
  const [email, setEmail] = useState('');
  const { mutate: createQuote, isPending } = useCreateQuote();
  console.log(courierData, 'courierDatacourierData')
  const handleSend = () => {
    if (!courierData || !locations.sender || !locations.receiver) return;

    const payload = {
      sender: `${locations.sender.postcode}|${locations.sender.suburb}|${locations.sender.state}`,
      receiver: `${locations.receiver.postcode}|${locations.receiver.suburb}|${locations.receiver.state}`,
      parcels: items.map(item => ({
        type: item.type,
        quantity: item.quantity || 1,
        weight: item.weight,
        length: item.length,
        width: item.width,
        height: item.height
      })),
      service: {
        courier: courierData.carrier_id,
        carrier_name: courierData.carrier,
        product_id: courierData.product_id,
        product_type: courierData.product_type
      },
      surcharges: [],
      chosenTotal: calculations.grandTotal,
      email: email,
      margin: Number(margin),
      pickup_charge: pickupCharge
    };

    createQuote(payload, {
      onSuccess: () => {
        showToast('Quote sent to customer successfully', 'success');
        onOpenChange(false);
        setEmail('');
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || 'Failed to send quote', 'error');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="my-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Send Quote to Customer
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pb-0">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800">
              <p className="text-[13px] font-medium text-slate-500 dark:text-zinc-400">Selected Service</p>
              <p className="text-[15px] font-bold text-slate-900 dark:text-zinc-100">{courierData?.carrier} - {courierData?.service_name}</p>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-500 dark:text-zinc-400">Total Quote</span>
                <span className="text-[16px] font-bold text-blue-600 dark:text-blue-400">
                  {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(calculations.grandTotal)}
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
            disabled={!email || isPending}
            className="w-full bg-[#0060FE] hover:bg-blue-700 text-white gap-2 font-bold"
          >
            {isPending ? (
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

