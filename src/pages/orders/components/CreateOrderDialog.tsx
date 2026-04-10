import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Search, Pencil, ExternalLink, Lock, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, generateUniqueId } from '@/lib/utils';
import { FormInput, FormSelect, FormTextarea, ValidAddressBadge } from './OrderFormUI';
import type { CreateOrderDialogProps, OrderFormData } from '../types';

const SUBURBS = [
  { value: "Truganina", key: "Truganina" },
  { value: "Melbourne", key: "Melbourne" },
  { value: "Sydney", key: "Sydney" },
];

const POSTCODES = [
  { value: "3029", key: "3029" },
  { value: "3000", key: "3000" },
  { value: "2000", key: "2000" },
];

export const initialData: OrderFormData = {
  receiverContactPerson: '',
  receiverEmail: '',
  receiverPhone: '',
  receiverCompany: '',
  receiverBuilding: '',
  receiverInstructions: '',
  receiverStreetAddress: '',
  receiverTownSuburb: '',
  receiverCity: '',
  receiverState: '',
  receiverPostcode: '',
  receiverCountry: '',
  saveToAddressBook: false,
  packets: [],
};

export function CreateOrderDialog({ onOpenChange, type }: CreateOrderDialogProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OrderFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);
  const [activeLookup, setActiveLookup] = useState<'contact' | 'address'>('address');

  const updateField = (field: keyof OrderFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // setIsSuccess(true);
    // redirect to order view page
    navigate(`/orders/new/${generateUniqueId()}`);
  };

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      // setIsSuccess(false);
      setFormData(initialData);
    }, 300);
  }, [onOpenChange]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 animate-in fade-in"
        onClick={() => !isSubmitting && onOpenChange(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full bg-white dark:bg-zinc-950 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border dark:border-zinc-800 max-w-4xl">

        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-slate-100 dark:border-zinc-900 group">
          <div className="flex gap-4">
            <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 capitalize">
                {type} address
              </h2>
              <p className="text-[12px] text-slate-500 dark:text-zinc-400 font-medium leading-tight">
                Enter the receiver's address. You can lookup a customer's details saved in the address book to complete this section.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-400 hover:text-slate-900 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-6 custom-scrollbar bg-[#f8fafc] dark:bg-zinc-950/20">
          <div className="space-y-5 max-w-5xl mx-auto">

            <div className="flex flex-col md:flex-row gap-0">
              <div className="flex overflow-hidden border border-[#0060fe] shrink-0 h-8">
                <button
                  onClick={() => setActiveLookup('contact')}
                  className={cn(
                    "px-6 py-2 text-[10px] font-bold tracking-widest transition-colors border-r border-[#0060fe]",
                    activeLookup === 'contact' ? "bg-[#0060fe] text-white" : "bg-white text-[#0060fe]"
                  )}
                >
                  LOOK UP CONTACT
                </button>
                <button
                  onClick={() => setActiveLookup('address')}
                  className={cn(
                    "px-6 py-2 text-[10px] font-bold tracking-widest transition-colors",
                    activeLookup === 'address' ? "bg-[#0060fe] text-white" : "bg-white text-[#0060fe]"
                  )}
                >
                  LOOK UP ADDRESS
                </button>
              </div>
              <div className="flex-1 relative h-8">
                <input
                  type="text"
                  placeholder="Enter an address to search"
                  className="w-full h-full pl-4 pr-10 border border-l-0 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm font-medium focus:outline-none focus:ring-0 focus:border-slate-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-12 gap-x-12 gap-y-6">

              {/* Left Column */}
              <div className="col-span-12 md:col-span-6 space-y-2">
                <FormInput
                  label="NAME"
                  value={formData.receiverContactPerson}
                  onChange={val => updateField('receiverContactPerson', val)}
                  layout="horizontal"
                  required
                  placeholder="Enter Name"
                />
                <FormInput
                  label="EMAIL"
                  value={formData.receiverEmail}
                  onChange={val => updateField('receiverEmail', val)}
                  layout="horizontal"
                  placeholder="Enter Email"
                />
                <FormInput
                  label="PHONE"
                  value={formData.receiverPhone}
                  onChange={val => updateField('receiverPhone', val)}
                  layout="horizontal"
                  placeholder="Enter Phone"
                />
                <FormInput
                  label="COMPANY"
                  value={formData.receiverCompany}
                  onChange={val => updateField('receiverCompany', val)}
                  layout="horizontal"
                />
                <FormInput
                  label="BUILDING"
                  value={formData.receiverBuilding}
                  onChange={val => updateField('receiverBuilding', val)}
                  layout="horizontal"
                />
                <FormTextarea
                  label="INSTRUCTIONS"
                  value={formData.receiverInstructions}
                  onChange={val => updateField('receiverInstructions', val)}
                  rows={5}
                  layout="horizontal"
                />
              </div>

              {/* Right Column */}
              <div className="col-span-12 md:col-span-6 space-y-2">
                <FormInput
                  label="STREET"
                  value={formData.receiverStreetAddress}
                  onChange={val => updateField('receiverStreetAddress', val)}
                  layout="horizontal"
                  required
                />
                <FormSelect
                  label="SUBURB"
                  value={formData.receiverTownSuburb}
                  onValueChange={val => updateField('receiverTownSuburb', val ?? '')}
                  options={SUBURBS}
                  layout="horizontal"
                  placeholder="Select Suburb"
                  required
                />
                <FormInput
                  label="CITY"
                  value={formData.receiverCity}
                  onChange={val => updateField('receiverCity', val)}
                  layout="horizontal"
                />
                <FormInput
                  label="STATE"
                  value={formData.receiverState}
                  onChange={val => updateField('receiverState', val)}
                  layout="horizontal"
                  required
                />
                <FormSelect
                  label="POSTCODE"
                  value={formData.receiverPostcode}
                  onValueChange={val => updateField('receiverPostcode', val ?? '')}
                  options={POSTCODES}
                  layout="horizontal"
                  required
                />
                <div className="space-y-4">
                  <FormInput
                    label="COUNTRY"
                    value={formData.receiverCountry}
                    onChange={val => updateField('receiverCountry', val)}
                    layout="horizontal"
                    required
                  />
                  <div className="flex justify-start">
                    <ValidAddressBadge />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Validation Accordion */}
            <div className="col-span-12">
              <Accordion className="w-full border border-slate-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950/50 shadow-sm overflow-hidden">
                <AccordionItem value="validation" className="border-none">
                  <AccordionTrigger className="px-5 py-3 hover:no-underline flex justify-between items-center group">
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-zinc-300 uppercase tracking-widest leading-none">
                      ADDRESS VALIDATION
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <p className="text-sm text-slate-400 font-medium italic">No address suggestions to display.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-3 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="save-contact"
              checked={formData.saveToAddressBook}
              onCheckedChange={(checked) => updateField('saveToAddressBook', !!checked)}
              className="w-5 h-5 rounded border-slate-300 dark:border-zinc-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-none transition-all"
            />
            <label
              htmlFor="save-contact"
              className="text-sm font-semibold text-slate-600 dark:text-zinc-400 leading-none cursor-pointer"
            >
              Save contact to address book
            </label>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View on Google Maps
              <ExternalLink className="w-4 h-4" />
            </a>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#00a651] hover:bg-[#009247] text-white font-extrabold h-10 px-10 rounded-md flex items-center gap-2.5 shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" strokeWidth={2.5} />
              )}
              SAVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
