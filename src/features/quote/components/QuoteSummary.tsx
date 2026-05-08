import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Percent, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/features/orders/components/OrderFormUI";
import type { QuoteCalculations } from "../types";

interface QuoteSummaryProps {
  quoteData: QuoteCalculations;
  isAdmin?: boolean;
  margin?: string;
  setMargin?: (val: string) => void;
  onSendQuote?: () => void;
  isValid?: boolean;
  calculation?: QuoteCalculations
}

export function QuoteSummary({
  calculation,
  quoteData,
  isAdmin = false,
  margin = '0',
  setMargin,
  onSendQuote,
  isValid = false
}: QuoteSummaryProps) {
  console.log(quoteData, 'quoteData')
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val) || 0;

  return (
    <Card className="sticky top-20 p-0 gap-0 shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-zinc-900/50 rounded-t-lg py-4 border-b border-slate-100 dark:border-zinc-800">
        <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-blue-600 dark:text-blue-400">
          <FileText className="w-4 h-4" />
          {isAdmin ? 'Admin Quote Summary' : 'Quote Summary'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {isAdmin && setMargin && (
          <div className="p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/30 space-y-3 mb-2">
            <div className="flex items-center gap-2">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[12px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Extra Margin (%)</span>
            </div>
            <FormInput
              placeholder="0"
              value={margin}
              onChange={setMargin}
              type="number"
              className="bg-white dark:bg-zinc-950"
            />
          </div>
        )}

        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Total Items</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{calculation?.totalItems}</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Dead Weight</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{calculation?.totalWeight?.toFixed(2)} kg</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Volumetric Weight</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{calculation?.volumetric?.toFixed(2)} kg</span>
        </div>
        <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Service Cost</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatCurrency(calculation?.servicePrice || 0)}</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">GST (10%)</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatCurrency(calculation?.gst || 0)}</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Extra surcharges</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatCurrency(calculation?.totalSurcharges || 0)}</span>
        </div>

        {isAdmin && calculation?.margin && Number(calculation?.margin) > 0 && (
          <div className="flex justify-between items-center text-[13.5px]">
            <span className="text-blue-600 font-bold">Admin Margin</span>
            <span className="font-bold text-blue-600">{formatCurrency(calculation?.margin || 0)}</span>
          </div>
        )}

        <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-slate-900 dark:text-zinc-100 leading-tight">Total</span>
            <span className="text-[10px] font-normal text-slate-500 dark:text-zinc-500">(inc GST & F.L)</span>
          </div>
          <span className="text-[22px] font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">{formatCurrency(calculation?.grandTotal || 0)}</span>
        </div>

        {isAdmin && onSendQuote && (
          <Button
            onClick={onSendQuote}
            disabled={!isValid || calculation?.servicePrice === 0}
            className="w-full bg-[#0060FE] hover:bg-blue-700 text-white gap-2 h-10 text-[13px] font-bold my-2  shadow-lg active:scale-[0.98] transition-all"
          >
            <Mail className="w-4 h-4" />
            Send Quote to Customer
          </Button>
        )}

        <p className="text-[11px] text-center text-slate-400 dark:text-zinc-500 italic py-1 border-t border-slate-50 dark:border-zinc-900">
          Details will be confirmed on the booking screen.
        </p>
      </CardContent>
    </Card>
  );
}
