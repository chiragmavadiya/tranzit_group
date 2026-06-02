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
import { Shield, CheckCircle2, ShieldOff, RotateCw } from 'lucide-react'
// import { Switch } from '@/components/ui/switch'
// import DatePicker from '@/components/common/DatePicker';
import type { QuoteCalculations } from '@/features/quote/types';
import { memo, useMemo } from 'react';
// import { CustomLabel } from '../OrderFormUI';
import { cn } from '@/lib/utils';
import { StatusBadge } from '../StatusBadge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SidePanelProps {
  itemsData?: any[];
  quoteData?: any;
  handleOptionalFieldsChange: (type: "insurance" | "signature" | "delivery_instructions", value: boolean | string) => void;
  insuranceSelected: boolean;
  signatureSelected: boolean;
  deliveryInstructions: string;
  orderType?: string;
  calculation: QuoteCalculations
  liability: boolean;
  liabilityMessage: string | undefined;
  payment_status?: string;
  shipping_activity?: any[];
}

export const SidePanel: React.FC<SidePanelProps> = memo(({
  calculation,
  handleOptionalFieldsChange,
  insuranceSelected,
  deliveryInstructions,
  orderType,
  liability = false,
  liabilityMessage,
  payment_status,
  shipping_activity = [],
}) => {
  const isCreate = useMemo(() => orderType === 'create' || orderType === 'create-menual' || orderType === 'consign' || orderType === 'return', [orderType]);

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
      <Accordion multiple defaultValue={['notes', 'services', 'summary', "support", "liability", "timeline"]} className="flex flex-col gap-3">

        {/* TRANSIT TIMELINE */}
        {!isCreate && (
          <AccordionItem value="timeline" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
            <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
              <span className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">Transit Timeline</span>
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
                      className="flex items-center gap-1.5 text-[11px] font-bold text-gray-900 dark:text-zinc-100 hover:text-primary transition-colors uppercase tracking-wider h-8 px-3 border border-gray-200 dark:border-zinc-800 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all duration-200"
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
                              stage.completed ? "bg-primary dark:bg-primary" : "bg-gray-100 dark:bg-zinc-800"
                            )} />
                          </div>
                        )}

                        {/* Circle */}
                        <div className={cn(
                          "relative w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-zinc-950 transition-all duration-300 z-10 ",
                          stage.completed
                            ? "border-primary dark:border-[#1b7a58]"
                            : "border-gray-200 dark:border-zinc-800"
                        )}>
                          {stage.completed && (
                            <div className="w-2 h-2 rounded-full bg-[#0f4431] dark:bg-[#1b7a58]" />
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-start w-full">
                            <span className={cn(
                              "text-sm transition-colors duration-300 leading-none",
                              stage.completed
                                ? "font-bold text-primary dark:text-primary"
                                : "font-medium text-gray-400 dark:text-zinc-600"
                            )}>
                              {stage.title || stage.status}
                            </span>

                            {/* Refresh button next to Delivered (index 0) */}
                            {idx === 0 && (
                              <button
                                type="button"
                                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-900 dark:text-zinc-100 hover:text-primary transition-colors uppercase tracking-wider h-5"
                              >
                                <RotateCw className={"w-3.5 h-3.5"} />
                                REFRESH
                              </button>
                            )}
                          </div>

                          {stage.description && stage.completed && (
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
            <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
              <div className="flex flex-wrap items-center gap-2.5 w-full text-left pr-6">
                <span className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-wider">
                  ORDER QUOTATION SUMMARY
                </span>
                {payment_status && <StatusBadge status={payment_status} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pb-4 pt-1">


              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Total Items</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.totalItems}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Total Weight</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.totalWeight?.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Volumetric</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.volumetric?.toFixed(3)} m³</span>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Service (Inc. F.L)</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">${calculation?.servicePrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Extra surcharges</span>
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
                <span className="text-base text-gray-900 dark:text-zinc-100 font-bold">Total inc GST & F.L</span>
                <span className="text-base font-bold text-primary">${calculation?.grandTotal?.toFixed(2)}</span>
              </div>

            </AccordionContent>
          </AccordionItem>
        )}


        {/* ADDITIONAL SERVICES */}
        {(isCreate) && (
          <>
            <AccordionItem value="services" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-destructive/10 dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
              <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
                <span className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">liability protection</span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5 pb-4 pt-1">

                {/* Shipment Protection */}
                <div className="flex flex-col gap-3">

                  <div className="text-xs font-medium text-gray-600 dark:text-zinc-400 flex flex-col gap-1">
                    <span className='text-destructive/80'>This consignment is currently not covered by any limited liability protection.</span>
                    <span className="font-semibold text-gray-800 dark:text-zinc-200">
                      Would you like to add limited liability cover of up to $100 per consignment?*
                    </span>
                  </div>
                  <RadioGroup
                    value={insuranceSelected ? "yes" : "no"}
                    onValueChange={(val) => handleOptionalFieldsChange('insurance', val === 'yes')}
                    className="flex flex-col gap-2 mt-1"

                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="insurance-yes" className="destructive" />
                      <label htmlFor="insurance-yes" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                        Yes, add cover for $6.00 AUD
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="insurance-no" />
                      <label htmlFor="insurance-no" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                        No, I don’t need cover
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          </>
        )}
        {/* NOTES */}
        <AccordionItem value="notes" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary items-center">
            <span className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">Delivery Instructions (Printed on Label)</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 pb-4">
            {!isCreate ? (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-xs font-medium text-gray-700 dark:text-zinc-300 min-h-[50px]">
                {deliveryInstructions || "No delivery instructions provided."}
              </div>
            ) : (
              <Textarea
                className="min-h-[100px] border-gray-200 dark:border-zinc-800 text-xs text-gray-700 dark:text-zinc-300 focus:border-primary focus:ring-0 focus-visible:ring-0 transition-all duration-200 shadow-none font-medium"
                placeholder="Add your notes here..."
                value={deliveryInstructions}
                onChange={(e) => handleOptionalFieldsChange('delivery_instructions', e.target.value)}
              />
            )}
          </AccordionContent>
        </AccordionItem>

        {/* LIABILITY COVER */}
        {!isCreate && (
          <AccordionItem value="liability" className={cn(
            "border rounded-xl shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0",
            liability
              ? "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10"
              : "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50"
          )}>
            <AccordionTrigger className={cn(
              "hover:no-underline py-3 px-0",
              liability ? "[&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-500" : "[&>svg]:text-slate-400 dark:[&>svg]:text-zinc-500"
            )}>
              <div className={cn(
                "flex items-center gap-2",
                liability ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-zinc-400"
              )}>
                <Shield className="h-4 w-4" />
                <span className="text-base font-bold tracking-wider uppercase">Liability Cover</span>
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
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Active Coverage</span>
                    </>
                  ) : (
                    <>
                      <ShieldOff className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">No Coverage</span>
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
