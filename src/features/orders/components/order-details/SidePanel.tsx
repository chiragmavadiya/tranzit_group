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
import { Shield, PenLine, CheckCircle2, Phone, Info, ShieldOff } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import DatePicker from '@/components/common/DatePicker';
import type { QuoteCalculations } from '@/features/quote/types';
import { useMemo } from 'react';
import { CustomLabel } from '../OrderFormUI';
import { cn } from '@/lib/utils';

interface SidePanelProps {
  itemsData?: any[];
  quoteData?: any;
  handleOptionalFieldsChange: (type: "insurance" | "signature" | "delivery_instructions", value: boolean | string) => void;
  insuranceSelected: boolean;
  signatureSelected: boolean;
  deliveryInstructions: string;
  pickupDate: Date | undefined;
  setPickupDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  orderType?: string;
  calculation: QuoteCalculations
  liability: boolean;
  liabilityMessage: string | undefined;
}

export const SidePanel: React.FC<SidePanelProps> = ({ calculation, handleOptionalFieldsChange, insuranceSelected, signatureSelected, deliveryInstructions, pickupDate, setPickupDate, orderType, liability = false, liabilityMessage }) => {
  const isCreate = useMemo(() => orderType === 'create' || orderType === 'create-menual', [orderType]);
  return (
    <div className="flex flex-col gap-4">
      <Accordion multiple defaultValue={['notes', 'services', 'summary', "support", "liability"]} className="flex flex-col gap-3">

        {/* ORDER QUOTATION SUMMARY */}
        {orderType !== 'create-menual' && (
          <AccordionItem value="summary" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
            <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
              <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">ORDER QUOTATION SUMMARY</span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pb-4 pt-1">


              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Total Items</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.totalItems}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Total Weight</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.totalWeight?.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Volumetric</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{calculation?.volumetric?.toFixed(3)} m³</span>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Service (Inc. F.L)</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">${calculation?.servicePrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">Extra surcharges</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">${calculation?.totalSurcharges?.toFixed(2)}</span>
              </div>
              {calculation?.insurance && (
                <div className="flex justify-between items-center text-xs text-primary animate-in fade-in slide-in-from-top-1">
                  <span className="font-medium">Shipment Protection</span>
                  <span className="font-bold">+$6.00</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400 font-medium">GST</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">${calculation?.gst?.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 my-1 pt-2 flex justify-between items-center">
                <span className="text-xs text-gray-900 dark:text-zinc-100 font-bold uppercase">Total inc GST & F.L</span>
                <span className="text-sm font-bold text-primary">${calculation?.grandTotal?.toFixed(2)}</span>
              </div>

            </AccordionContent>
          </AccordionItem>
        )}
        {/* ADDITIONAL SERVICES */}
        {(isCreate) && (
          <>
            <AccordionItem value="services" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
              <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
                <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">ADDITIONAL SERVICES</span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5 pb-4 pt-1">

                {/* Shipment Protection */}
                {calculation?.grandTotal > 100 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-100">Shipment Protection</h4>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium">Protect your shipment against loss or damage</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleOptionalFieldsChange('insurance', false)}
                        className={`cursor-pointer flex flex-col items-start p-3 rounded-[12px] border text-left transition-all duration-200 ${!insuranceSelected
                          ? 'border-primary bg-primary/5 dark:bg-primary/10 dark:border-primary ring-1 ring-primary/20 shadow-sm'
                          : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 shadow-sm'
                          }`}
                      >
                        <div className="flex justify-between w-full items-center mb-1">
                          <span className={`text-xs font-bold ${!insuranceSelected ? 'text-primary' : 'text-gray-700 dark:text-zinc-300'}`}>
                            No protection
                          </span>
                          {!insuranceSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOptionalFieldsChange('insurance', true)}
                        className={`cursor-pointer flex flex-col items-start p-3 rounded-[12px] border text-left transition-all duration-200 ${insuranceSelected
                          ? 'border-primary bg-primary/5 dark:bg-primary/10 dark:border-primary ring-1 ring-primary/20 shadow-sm'
                          : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 shadow-sm'
                          }`}
                      >
                        <div className="flex justify-between w-full items-center mb-1">
                          <span className={`text-xs font-bold ${insuranceSelected ? 'text-primary' : 'text-gray-700 dark:text-zinc-300'}`}>
                            Add cover
                          </span>
                          {insuranceSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium">up to $100</span>
                        <div className="mt-2 w-full text-right">
                          <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">+$6.00 AUD</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-100 dark:border-zinc-800/80"></div>

                {/* Signature on Delivery */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gray-200 dark:bg-zinc-900 rounded-md">
                      <PenLine className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-100">Signature on Delivery</h4>
                      <p className="my-0 text-[10px] text-gray-500 dark:text-zinc-400 font-medium">Ensure the parcel is handed over securely</p>
                    </div>
                  </div>
                  <Switch
                    checked={signatureSelected}
                    onCheckedChange={(value) => handleOptionalFieldsChange('signature', value)}
                    className="data-[state=checked]:bg-primary shadow-sm"
                  />
                </div>
                <div className="flex flex-col">
                  {/* <span className="text-xs font-bold text-gray-900 dark:text-zinc-100 tracking-wider">Pickup Date</span> */}
                  <CustomLabel label='Pickup Date' />
                  <DatePicker date={pickupDate} setDate={setPickupDate} className='w-full' />
                </div>

              </AccordionContent>
            </AccordionItem>
          </>
        )}
        {/* NOTES */}
        <AccordionItem value="notes" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary items-center">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">Delivery Instructions(Printed on Label)</span>
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

        {/* DOCUMENTS */}
        {/* <AccordionItem value="documents" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">DOCUMENTS</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pb-4">
            <div className="flex flex-col gap-2">
              {uploadedDocs.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">No documents uploaded yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {uploadedDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 group animate-in slide-in-from-top-1 duration-200">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-100 truncate max-w-[200px]">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">{doc.category}</span>
                          <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-medium">{doc.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase">Document type</label>
              <SelectComponent
                data={DOCUMENT_TYPES}
                value={selectedDocType}
                onValueChange={(val) => val && setSelectedDocType(val)}
                placeholder="Document type"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-fit flex items-center gap-2 border-primary text-primary hover:bg-primary/10 h-10 px-4 rounded-md font-bold text-xs uppercase"
              >
                <Upload className="h-4 w-4" />
                UPLOAD DOCUMENT
              </Button>
              {uploadError && (
                <p className="text-[10px] text-red-500 font-bold uppercase animate-in fade-in-0 duration-200">
                  {uploadError}
                </p>
              )}
            </div>

            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium uppercase mt-1">PDF, JPG or PNG up to 1 MB.</p>
          </AccordionContent>
        </AccordionItem> */}


        {/* TAGS */}
        {/* <AccordionItem value="tags" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">TAGS</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 pb-4">
            <Input
              className="h-10 text-xs border-gray-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-primary font-medium"
              placeholder="Search for or create a new tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <div key={tag} className="inline-flex items-center gap-1.5 px-2 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded text-[9px] font-bold text-gray-700 dark:text-zinc-300 transition-colors uppercase animate-in zoom-in-95 duration-200">
                  <div>{tag}</div>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-0.5 transition-colors group"
                  >
                    <X className="h-3 w-3 text-red-600 dark:text-red-500 transition-colors group-hover:scale-110" />
                  </button>
                </div>
              ))}
              {tags.length === 0 && !tagInput && (
                <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium italic py-1">No tags added yet. Type and press Enter.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem> */}

        {/* LIABILITY COVER */}
        <AccordionItem value="liability" className={cn(
          "border rounded-xl shadow-sm px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0",
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
              <span className="text-sm font-bold tracking-wider uppercase">Liability Cover</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-1">
            <div className="flex flex-col gap-2">
              <p className={cn(
                "text-[11px] font-medium leading-relaxed m-0",
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
        </AccordionItem>

        {/* SUPPORT & REFERENCE */}
        <AccordionItem value="support" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">Support & Reference</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pb-4 mt-1">
            <div className="flex justify-between items-center text-[13px] p-3 bg-slate-50 dark:bg-zinc-900/50 rounded-lg border border-slate-100 dark:border-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-gray-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Cust Ref</span>
              </div>
              <span className="text-gray-900 dark:text-zinc-100 font-bold tracking-tight">SH000099</span>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10 transition-colors">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Support Hotline</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 my-0!">1300 347 397</p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium leading-relaxed m-0">
                For enquiries or online support, contact our dedicated team.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
