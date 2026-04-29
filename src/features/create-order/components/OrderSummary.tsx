import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { OrderSummaryProps } from "../types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function OrderSummary({
  calculations,
}: OrderSummaryProps) {
  const [instructions, setInstructions] = useState('');
  const [liabilityCover, setLiabilityCover] = useState('no');
  const [signatureRequired, setSignatureRequired] = useState('no');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRates, setAgreedRates] = useState(false);
  const [noDangerousGoods, setNoDangerousGoods] = useState(false);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val);

  return (
    <div className="space-y-4">
      {/* Quote Summary Table */}
      <Card className="p-0 gap-0 shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-zinc-900/50 rounded-t-lg py-4 border-b border-slate-100 dark:border-zinc-800">
          <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-blue-600 dark:text-blue-400">
            <FileText className="w-4 h-4" />
            Quote Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50 dark:divide-zinc-900">
            <div className="flex justify-between items-center py-2.5 px-4 text-[13px]">
              <span className="text-slate-600 dark:text-zinc-400">Items</span>
              <span className="font-medium text-slate-900 dark:text-zinc-100">{calculations.totalItems}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 px-4 text-[13px]">
              <span className="text-slate-600 dark:text-zinc-400">Dead weight</span>
              <span className="font-medium text-slate-900 dark:text-zinc-100">{calculations.deadWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between items-center py-2.5 px-4 text-[13px]">
              <span className="text-slate-600 dark:text-zinc-400">Volumetric</span>
              <span className="font-medium text-slate-900 dark:text-zinc-100">{calculations.volumetricWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between items-center py-2.5 px-4 text-[13px]">
              <span className="text-slate-600 dark:text-zinc-400">Service (Inc. F.L)</span>
              <span className="font-medium text-slate-900 dark:text-zinc-100">{formatCurrency(calculations.serviceCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 px-4 text-[13px]">
              <span className="text-slate-600 dark:text-zinc-400">GST (10%)</span>
              <span className="font-medium text-slate-900 dark:text-zinc-100">{formatCurrency(calculations.gst)}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 px-4 text-[13px]">
              <span className="text-slate-600 dark:text-zinc-400">Extra surcharges</span>
              <span className="font-medium text-slate-900 dark:text-zinc-100">{formatCurrency(calculations.surcharges)}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 text-[14px] bg-slate-50/50 dark:bg-zinc-900/30">
              <span className="font-bold text-slate-900 dark:text-zinc-100">Total inc GST & F.L</span>
              <span className="font-bold text-slate-900 dark:text-zinc-100">{formatCurrency(calculations.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liability Protection Section */}
      <Card className="shadow-none border-none bg-[#FFE5E5] dark:bg-red-950/20 p-4 rounded-md space-y-3">
        <p className="text-[12px] text-red-600 dark:text-red-400 ">
          This consignment is currently not covered by any limited liability protection.
        </p>
        <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
          Would you like to add limited liability cover of up to <span className="underline">$100 per consignment?*</span>
        </p>
        <RadioGroup value={liabilityCover} onValueChange={setLiabilityCover} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="liability-yes" className="border-red-300 text-red-600" />
            <Label htmlFor="liability-yes" className="text-[12px] font-medium text-slate-700 dark:text-zinc-300">
              Yes, add cover for <span className="font-bold text-slate-900 dark:text-white">$6.00 AUD</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="liability-no" className="border-red-300 text-red-600" />
            <Label htmlFor="liability-no" className="text-[12px] font-medium text-slate-700 dark:text-zinc-300">
              No, I don't need cover
            </Label>
          </div>
        </RadioGroup>
      </Card>

      {/* Delivery Instructions Section */}
      <Card className="shadow-none border-none bg-slate-100 dark:bg-zinc-900/50 p-4 rounded-md">
        <div className="relative space-y-1">
          <div className="flex justify-between">
            <Label className="text-[12px] font-bold text-slate-700 dark:text-zinc-300">
              Delivery Instructions <span className="text-red-500">(Printed on Label)</span>
            </Label>
            <span className="text-[10px] text-slate-400">{instructions.length}/128 characters</span>
          </div>

          <Textarea
            placeholder="Enter delivery instructions to be printed on the label..."
            className="text-[12px] min-h-[100px] bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 resize-none"
            maxLength={128}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

        </div>
      </Card>
      {/* Checkboxes Section */}
      <div className="space-y-2 px-1">
        <div className="flex items-start space-x-2 ">
          <Checkbox
            id="singautre"
            checked={signatureRequired === 'yes'}
            onCheckedChange={(checked) => setSignatureRequired(checked ? 'yes' : 'no')}
            className=""
          />
          <Label htmlFor="singautre" className="text-[12px] font-bold text-red-500 dark:text-red-400">
            Signature Required ?
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreedTerms}
            onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
            className=""
          />
          <Label htmlFor="terms" className="text-[12px] leading-tight font-medium text-slate-600 dark:text-zinc-400">
            I accept the <span className="text-slate-900 dark:text-white font-bold underline">Terms & Conditions</span> & Read the <span className="text-slate-900 dark:text-white font-bold underline">Privacy Policy</span>
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="rates"
            checked={agreedRates}
            onCheckedChange={(checked) => setAgreedRates(checked as boolean)}
            className=""
          />
          <Label htmlFor="rates" className="text-[12px] leading-tight font-medium text-slate-600 dark:text-zinc-400">
            I understand the Shipping Rates & Extra Charges
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="dangerous"
            checked={noDangerousGoods}
            onCheckedChange={(checked) => setNoDangerousGoods(checked as boolean)}
            className=""
          />
          <Label htmlFor="dangerous" className="text-[12px] leading-tight font-medium text-slate-600 dark:text-zinc-400">
            This consignment does not contain <span className="text-slate-900 dark:text-white font-bold underline">Dangerous Goods</span>
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        // className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-12 text-[15px] shadow-sm active:scale-[0.98] transition-all"
        className="global-btn h-10 w-full"
        disabled={!agreedTerms || !agreedRates || !noDangerousGoods}
      >
        Create Consignment
      </Button>
    </div>
  );
}
