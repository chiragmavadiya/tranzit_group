import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
// import { Button } from '@/components/ui/button'
// import SelectComponent from '@/components/ui/select'
// import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Shield, CheckCircle2, ShieldOff, Info } from 'lucide-react'
// import { Switch } from '@/components/ui/switch'
// import DatePicker from '@/components/common/DatePicker';
import type { QuoteCalculations } from '@/features/quote/types';
import { memo, useMemo } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
// import { CustomLabel } from '../OrderFormUI';
import { cn } from '@/lib/utils';
import { StatusBadge } from '../StatusBadge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
interface SidePanelProps {
  itemsData?: any[];
  quoteData?: any;
  handleOptionalFieldsChange: (type: "insurance" | "signature" | "delivery_instructions", value: boolean | string) => void;
  insuranceSelected: boolean;
  // signatureSelected: boolean;
  deliveryInstructions: string;
  orderType?: string;
  calculation: QuoteCalculations
  liability: boolean;
  liabilityMessage: string | undefined;
  payment_status?: string;
  shipping_activity?: any[];
  courierResponse?: Record<string, unknown> | null;
}

export const SidePanel: React.FC<SidePanelProps> = memo(({
  calculation,
  quoteData,
  handleOptionalFieldsChange,
  insuranceSelected,
  deliveryInstructions,
  orderType,
  liability = false,
  liabilityMessage,
  payment_status,
  shipping_activity = [],
  courierResponse,
  // signatureSelected,
}) => {
  const isCreate = useMemo(() => orderType === 'create' || orderType === 'create-menual' || orderType === 'consign' || orderType === 'return', [orderType]);

  const surchargesList = useMemo(() => {
    const list: any[] = [];
    const seen = new Set<string>();

    if (Array.isArray(quoteData?.surcharges)) {
      quoteData.surcharges.forEach((charge: any) => {
        if (charge && charge.name && !seen.has(charge.name)) {
          seen.add(charge.name);
          list.push(charge);
        }
      });
    }

    if (Array.isArray(quoteData?.courier?.applied_surcharges)) {
      quoteData.courier.applied_surcharges.forEach((charge: any) => {
        if (charge && charge.name && !seen.has(charge.name)) {
          seen.add(charge.name);
          list.push(charge);
        }
      });
    }
    // if(quoteData?.courier?.courier_based_charge > 0){ 
    //   seen.add("Post code Surcharge");
    //   list.push({ name: "Post code Surcharge", amount: quoteData.courier.courier_based_charge });
    // }
    return list;
  }, [quoteData]);

  const postcodeSurcharge = Number(quoteData?.courier?.courier_based_charge ?? quoteData?.courier_based_charge ?? 0);

  const awaitingCourierQuote = isCreate && !quoteData?.courier;

  const hasCourierResponse = !!courierResponse && Object.keys(courierResponse).length > 0;

  const timelineData = useMemo(() => {
    if (!Array.isArray(shipping_activity) || shipping_activity.length === 0) {
      return { stages: [], activeId: null };
    }

    // Sort by id descending so Delivered (id 5) is first, Order placed (id 1) is last.
    const stages = [...shipping_activity].sort((a, b) => {
      const idA = Number(a.id) || 0;
      const idB = Number(b.id) || 0;
      return idB - idA;
    });

    // The active stage is the first completed stage in the descending list
    const activeStage = stages.find(s => s.completed);

    return {
      stages,
      activeId: activeStage ? activeStage.id : null
    };
  }, [shipping_activity]);

  return (
    <div className="flex flex-col gap-4">
      <Accordion multiple defaultValue={['notes', 'services', 'summary', "support", "liability", "timeline", "courier_response"]} className="flex flex-col gap-3">

        {/* TRANSIT TIMELINE */}
        {!isCreate && (
          <AccordionItem value="timeline" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
            <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary cursor-pointer">
              <span className="text-base font-bold text-gray-900 dark:text-zinc-100 uppercase">Transit Timeline</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1">
              <div className="flex flex-col pl-1 pt-2">
                {timelineData.stages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 px-4 text-center gap-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-zinc-500">
                      No transit history available for this order.
                    </span>
                    {/* <button
                      type="button"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-gray-900 dark:text-zinc-100 hover:text-primary transition-colors uppercase h-8 px-3 border border-gray-200 dark:border-zinc-800 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all duration-200"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Refresh Timeline
                    </button> */}
                  </div>
                ) : (
                  timelineData.stages.map((stage, idx) => {
                    const isActive = true;
                    // const isActive = stage.id === timelineData.activeId;
                    const dateTime = stage.dateTime || stage.updated_at || stage.date || stage.date_time;
                    return (
                      <div key={stage.id} className="flex gap-4 items-start relative pb-6 last:pb-0">
                        {/* Left column for line */}
                        {idx < timelineData.stages.length - 1 && (
                          <div className="absolute left-[9px] top-2 bottom-0 w-[2px] z-0">
                            <div className={cn(
                              "h-full w-full",
                              !stage.completed ? "bg-primary dark:bg-primary" : "bg-gray-100 dark:bg-zinc-800"
                            )} />
                          </div>
                        )}

                        {/* Circle */}
                        <div className={cn(
                          "relative w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-zinc-950 transition-all duration-300 z-10 ",
                          !stage.completed
                            ? "border-primary"
                            : "border-gray-200"
                        )}>
                          {!stage.completed && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-start w-full">
                            <span className={cn(
                              "text-sm transition-colors duration-300 leading-none",
                              !stage.completed
                                ? "font-bold text-primary dark:text-primary"
                                : "font-medium text-gray-400 dark:text-zinc-600"
                            )}>
                              {stage.title || stage.status}
                            </span>

                            {/* Refresh button next to Delivered (index 0) */}
                            {/* {idx === 0 && (
                              <button
                                type="button"
                                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-900 dark:text-zinc-100 hover:text-primary transition-colors uppercase h-5"
                              >
                                <RotateCw className={"w-3.5 h-3.5"} />
                                REFRESH
                              </button>
                            )} */}
                          </div>

                          {stage.description && !stage.completed && (
                            <span className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                              {stage.description}
                            </span>
                          )}

                          {isActive && dateTime && (
                            <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium mt-0.5 animate-in fade-in duration-200">
                              Last updated: {dateTime}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ORDER QUOTATION SUMMARY */}
        {orderType !== 'create-menual' && (
          <AccordionItem value="summary" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
            <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary cursor-pointer">
              <div className="flex flex-wrap items-center gap-2.5 w-full text-left pr-6">
                <span className="text-base font-bold text-gray-900 dark:text-zinc-100">
                  Quote Summary
                </span>
                {payment_status && <StatusBadge status={payment_status} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pb-4 pt-1">


              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Items</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.totalItems}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Dead weight</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.totalWeight?.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Volumetric Weight</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.volumetric?.toFixed(2)} kg</span>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>

              {awaitingCourierQuote ? (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 dark:border-amber-900/30 dark:bg-amber-950/20">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                    Select a courier to see the shipping charges for this order.
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-sm">
                    {/* quoteData.courier.courier_based_charge */}

                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 dark:text-zinc-400 font-medium">Shipping Services</span>
                      {postcodeSurcharge > 0 && (
                        <Tooltip>
                          <TooltipTrigger className="h-[14px]">
                            <span className="inline-flex items-center justify-center text-gray-400 hover:text-primary dark:text-zinc-500 dark:hover:text-primary cursor-pointer transition-colors duration-200">
                              <Info className="h-3.5 w-3.5" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="flex flex-col items-start gap-1.5 p-2.5 min-w-[240px] text-left bg-gray-900 dark:bg-zinc-800 text-gray-100 border border-gray-800 dark:border-zinc-700">
                            <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-400 uppercase tracking-wide pb-1 border-b border-gray-800 dark:border-zinc-700 w-full">
                              Included in this price
                            </div>
                            <div className="flex justify-between items-center gap-3 text-[12px] w-full">
                              <span className="text-white font-medium dark:text-zinc-300">Postcode Surcharge</span>
                              <span className="text-white font-bold dark:text-zinc-100">
                                ${postcodeSurcharge.toFixed(2)}
                              </span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 dark:text-zinc-100">${calculation?.servicePrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 dark:text-zinc-400 font-medium">Extra surcharges</span>
                      {surchargesList.length > 0 && (
                        // <TooltipProvider delay={100}>
                        <Tooltip>
                          <TooltipTrigger className="h-[14px]">
                            <span className="inline-flex items-center justify-center text-gray-400 hover:text-primary dark:text-zinc-500 dark:hover:text-primary cursor-pointer transition-colors duration-200">
                              <Info className="h-3.5 w-3.5" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="flex flex-col gap-1.5 p-2.5 min-w-[180px] bg-gray-900 dark:bg-zinc-800 text-gray-100 border border-gray-800 dark:border-zinc-700">
                            <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-400 uppercase tracking-wide pb-1 border-b border-gray-800 dark:border-zinc-700 w-full">
                              Surcharge Breakdown
                            </div>
                            <div className="flex flex-col gap-1 w-full max-h-32 overflow-y-auto no-scrollbar">
                              {surchargesList.map((charge: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center gap-3 text-[12px]">
                                  <span className="text-white font-medium dark:text-zinc-300">- {charge.name}</span>
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        // </TooltipProvider>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 dark:text-zinc-100">${calculation?.totalSurcharges?.toFixed(2)}</span>
                  </div>
                  {calculation?.insurance && (
                    <div className="flex justify-between items-center text-sm text-primary animate-in fade-in slide-in-from-top-1">
                      <span className="font-medium">Shipment Protection</span>
                      <span className="font-bold">+$6.00</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-zinc-400 font-medium">GST</span>
                    <span className="font-bold text-gray-900 dark:text-zinc-100">${calculation?.gst?.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-100 dark:border-zinc-800 my-1 pt-2 flex justify-between items-center">
                    <span className="text-base text-gray-900 dark:text-zinc-100 font-bold">Total {orderType === 'consign' || orderType === 'create' ? 'Payable' : ''}</span>
                    <span className="text-base font-bold text-primary">${calculation?.grandTotal?.toFixed(2)}</span>
                  </div>
                </>
              )}

            </AccordionContent>
          </AccordionItem>
        )}


        {/* ADDITIONAL SERVICES */}
        {(isCreate) && (
          <>
            <AccordionItem value="services" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-destructive/10 dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
              <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary cursor-pointer">
                <span className="text-base font-bold text-gray-900 dark:text-zinc-100">Liability Cover</span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5 pb-4 pt-1">

                {/* Shipment Protection */}
                <div className="flex flex-col gap-3">

                  <div className="text-xs font-medium text-gray-600 dark:text-zinc-400 flex flex-col gap-1">
                    <span className='text-destructive/80'>This consignment is not currently covered by limited liability cover.</span>
                    {/* <span className="font-semibold text-gray-800 dark:text-zinc-200">
                      Would you like to add limited liability cover of up to $100 per consignment?*
                    </span> */}
                  </div>
                  <RadioGroup
                    value={insuranceSelected ? "yes" : "no"}
                    name='liability_cover'
                    onValueChange={(val) => handleOptionalFieldsChange('insurance', val === 'yes')}
                    className="flex flex-col gap-2 mt-1"

                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="insurance-yes" className="destructive" />
                      <label htmlFor="insurance-yes" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                        Yes, Add cover up to $100 - $6.00
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="insurance-no" />
                      <label htmlFor="insurance-no" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                        No cover required
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          </>
        )}
        {/* {(isCreate) && (
          <>
            <AccordionItem value="services" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
              <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
                <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">Signature Required ?</span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5 pb-4 pt-1">
                <div className="flex items-center justify-between">
                  <RadioGroup
                    value={signatureSelected ? "yes" : "no"}
                    name='signature_required'
                    onValueChange={(val) => handleOptionalFieldsChange('signature', val === 'yes')}
                    className="flex flex-col gap-2 mt-1"

                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="signature-yes" className="destructive" />
                      <label htmlFor="signature-yes" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="signature-no" />
                      <label htmlFor="signature-no" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                        No
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          </>
        )} */}
        {/* NOTES */}
        <AccordionItem value="notes" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary items-center cursor-pointer">
            <span className="text-base font-bold text-gray-900 dark:text-zinc-100">Delivery Instructions</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 pb-4">
            {!isCreate ? (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-xs font-medium text-gray-700 dark:text-zinc-300 min-h-[50px]">
                {deliveryInstructions || "No delivery instructions provided."}
              </div>
            ) : (
              <>
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">These notes may appear on the courier label or delivery instructions</span>
                <Textarea
                  className="min-h-[100px] border-gray-200 dark:border-zinc-800 text-xs text-gray-700 dark:text-zinc-300 focus:border-primary focus:ring-0 focus-visible:ring-0 transition-all duration-200 shadow-none font-medium"
                  placeholder=" e.g. Leave at reception, call before delivery, loading dock access"
                  value={deliveryInstructions}
                  onChange={(e) => handleOptionalFieldsChange('delivery_instructions', e.target.value)}
                />
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* COURIER RESPONSE — admin only; the prop is undefined for customers */}
        {hasCourierResponse && (
          <AccordionItem value="courier_response" className="border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/60 dark:bg-zinc-900/40 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
            <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-slate-400 dark:[&>svg]:text-zinc-500 cursor-pointer">
              <div className="flex flex-wrap items-center gap-2.5 w-full text-left pr-6">
                <span className="text-base font-bold text-gray-900 dark:text-zinc-100">Courier Response</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1">
              <pre className="max-h-80 overflow-auto rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 text-[11px] leading-relaxed font-mono text-gray-700 dark:text-zinc-300">
                {JSON.stringify(courierResponse, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* LIABILITY COVER */}
        {!isCreate && (
          <AccordionItem value="liability" className={cn(
            "border rounded-xl shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0",
            liability
              ? "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10"
              : "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50"
          )}>
            <AccordionTrigger className={cn(
              "hover:no-underline py-3 px-0 cursor-pointer",
              liability ? "[&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-500" : "[&>svg]:text-slate-400 dark:[&>svg]:text-zinc-500"
            )}>
              <div className={cn(
                "flex items-center gap-2",
                liability ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-zinc-400"
              )}>
                <Shield className="h-4 w-4" />
                <span className="text-base font-bold uppercase">Liability Cover</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1">
              <div className="flex flex-col gap-2">
                <p className={cn(
                  "text-xs font-medium leading-relaxed m-0",
                  liability ? "text-emerald-800 dark:text-emerald-300" : "text-slate-500 dark:text-zinc-400"
                )}>
                  {liabilityMessage || (liability ? "This order is covered by our limited liability protection." : "This order is not covered by liability protection.")}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {liability ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Active Coverage</span>
                    </>
                  ) : (
                    <>
                      <ShieldOff className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase">No Coverage</span>
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>)}
      </Accordion>
    </div>
  )
})
