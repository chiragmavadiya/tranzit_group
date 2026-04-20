import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { QuoteCalculations } from "../types";

interface QuoteSummaryProps {
  calculations: QuoteCalculations;
}

export function QuoteSummary({ calculations }: QuoteSummaryProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val);

  return (
    <Card className="sticky top-20 shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <CardHeader className="bg-slate-50 dark:bg-zinc-900/50 rounded-t-lg pb-4 border-b border-slate-100 dark:border-zinc-800">
        <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-blue-600 dark:text-blue-400">
          <FileText className="w-4 h-4" />
          Quote Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Total Items</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{calculations.totalItems}</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Dead Weight</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{calculations.deadWeight.toFixed(2)} kg</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Volumetric Weight</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{calculations.volumetricWeight.toFixed(2)} kg</span>
        </div>
        <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Service Cost</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatCurrency(calculations.serviceCost)}</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">GST (10%)</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatCurrency(calculations.gst)}</span>
        </div>
        <div className="flex justify-between items-center text-[13.5px]">
          <span className="text-slate-500 dark:text-zinc-400">Extra surcharges</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatCurrency(calculations.surcharges)}</span>
        </div>
        <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-slate-900 dark:text-zinc-100 leading-tight">Total</span>
            <span className="text-[10px] font-normal text-slate-500 dark:text-zinc-500">(inc GST & F.L)</span>
          </div>
          <span className="text-[20px] font-bold text-blue-600 dark:text-blue-400">{formatCurrency(calculations.total)}</span>
        </div>
        <p className="text-[11px] text-center text-slate-400 dark:text-zinc-500 italic mt-6 pt-2 border-t border-slate-50 dark:border-zinc-900">
          Details will be confirmed on the booking screen.
        </p>
      </CardContent>
    </Card>
  );
}
