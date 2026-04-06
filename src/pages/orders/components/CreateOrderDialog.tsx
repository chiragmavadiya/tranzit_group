import { useState, useCallback } from 'react';
import {
  X, ChevronRight, ChevronLeft, User, MapPin,
  Package, LayoutGrid, CheckCircle2,
  Loader2, Info, Building, Mail, Search, Hash, Phone,
  Plus, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

import { Stepper } from '@/components/ui/stepper';
import type { Step } from '@/components/ui/stepper';
import { HeaderIcon, FormInput, FormSelect, SummaryCard, SummaryMetric, SuccessScreen } from './OrderFormUI';

// --- Constants ---
const AU_STATES = [
  { value: "NSW", label: "New South Wales (NSW)" },
  { value: "VIC", label: "Victoria (VIC)" },
  { value: "QLD", label: "Queensland (QLD)" },
  { value: "WA", label: "Western Australia (WA)" },
  { value: "SA", label: "South Australia (SA)" },
  { value: "TAS", label: "Tasmania (TAS)" },
  { value: "ACT", label: "Australian Capital Territory (ACT)" },
  { value: "NT", label: "Northern Territory (NT)" },
] as const;

const PACKAGE_TYPES = [
  { value: "Standard Box", label: "Standard Box" },
  { value: "Small Packet", label: "Small Packet" },
  { value: "Pallet", label: "Heavy Pallet" },
  { value: "Documents", label: "Direct Documents" },
] as const;

// --- Types ---
export interface Packet {
  id: string;
  itemType: string;
  quantity: string;
  weight: string;
  length: string;
  width: string;
  height: string;
}

export interface OrderFormData {
  senderContactPerson: string;
  senderBusinessName: string;
  senderStreetAddress: string;
  senderStreetNumber: string;
  senderStreetName: string;
  senderTownSuburb: string;
  senderState: string;
  senderPostcode: string;
  senderPhone: string;
  senderEmail: string;
  receiverContactPerson: string;
  receiverBusinessName: string;
  receiverEmail: string;
  receiverStreetAddress: string;
  receiverStreetNumber: string;
  receiverStreetName: string;
  receiverTownSuburb: string;
  receiverState: string;
  receiverPostcode: string;
  receiverPhone: string;
  packets: Packet[];
}

const initialData: OrderFormData = {
  senderContactPerson: '',
  senderBusinessName: '',
  senderStreetAddress: '',
  senderStreetNumber: '',
  senderStreetName: '',
  senderTownSuburb: '',
  senderState: '',
  senderPostcode: '',
  senderPhone: '',
  senderEmail: '',
  receiverContactPerson: '',
  receiverBusinessName: '',
  receiverEmail: '',
  receiverStreetAddress: '',
  receiverStreetNumber: '',
  receiverStreetName: '',
  receiverTownSuburb: '',
  receiverState: '',
  receiverPostcode: '',
  receiverPhone: '',
  packets: [
    {
      id: crypto.randomUUID?.() || Date.now().toString(),
      itemType: 'Standard Box',
      quantity: '1',
      weight: '',
      length: '',
      width: '',
      height: '',
    }
  ],
};

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'order' | 'return';
}

// --- Main Dialog Component ---
export function CreateOrderDialog({ onOpenChange, type = 'order' }: CreateOrderDialogProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps: Step[] = [
    { title: type === 'order' ? 'Sender' : 'Origin', icon: User },
    { title: type === 'order' ? 'Receiver' : 'Destination', icon: MapPin },
    { title: 'Information', icon: Package },
    { title: 'Review', icon: LayoutGrid },
  ];

  const updateField = (field: keyof OrderFormData, value: string) => {
    setFormData((prev: OrderFormData) => ({ ...prev, [field]: value }));
  };

  const addPacket = () => {
    setFormData(prev => ({
      ...prev,
      packets: [
        ...prev.packets,
        {
          id: crypto.randomUUID?.() || Date.now().toString(),
          itemType: 'Standard Box',
          quantity: '1',
          weight: '',
          length: '',
          width: '',
          height: '',
        }
      ]
    }));
  };

  const removePacket = (id: string) => {
    setFormData(prev => ({
      ...prev,
      packets: prev.packets.length > 1
        ? prev.packets.filter(p => p.id !== id)
        : prev.packets
    }));
  };

  const updatePacket = (id: string, field: keyof Packet, value: string) => {
    setFormData(prev => ({
      ...prev,
      packets: prev.packets.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const nextStep = () => setStep((s: number) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s: number) => Math.max(s - 1, 0));

  const isStepValid = useCallback(() => {
    switch (step) {
      case 0:
        return !!(
          formData.senderContactPerson &&
          formData.senderStreetAddress &&
          formData.senderTownSuburb &&
          formData.senderState &&
          formData.senderPostcode &&
          formData.senderPhone &&
          formData.senderEmail
        );
      case 1:
        return !!(
          formData.receiverContactPerson &&
          formData.receiverTownSuburb &&
          formData.receiverState &&
          formData.receiverPostcode
        );
      case 2:
        return formData.packets.every(p =>
          p.itemType && p.quantity && p.weight && p.length && p.width && p.height
        );
      default:
        return true;
    }
  }, [step, formData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset after transition duration
    setTimeout(() => {
      setStep(0);
      setIsSuccess(false);
      setFormData(initialData);
    }, 300);
  }, [onOpenChange]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={() => !isSubmitting && onOpenChange(false)}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative w-full bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500 border dark:border-zinc-800",
        isSuccess ? "max-w-lg" : "max-w-4xl"
      )}>

        {isSuccess ? (
          <SuccessScreen
            type={type}
            title={type === 'order' ? "Order Created!" : "Return Processed!"}
            message={type === 'order' 
              ? "Your shipment has been successfully booked and is ready for pickup." 
              : "The return request has been initiated. A courier will be assigned shortly."}
            orderId={type === 'order' ? "#ORD-7241" : "#RET-8829"}
            onClose={handleClose}
          />
        ) : (
          <>
            {/* Header Section */}
            <div className="px-8 pt-6 pb-2 flex items-start justify-between border-b border-slate-50 dark:border-zinc-900">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  {type === 'order' ? 'Create New Order' : 'Create Return Order'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">Shipment status tracked automatically</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200 text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100 disabled:opacity-50"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

        {/* Reusable Stepper Component */}
        <Stepper steps={steps} currentStep={step} />

        {/* Form Body with Transitions */}
        <div className="flex-1 overflow-y-auto px-10 pt-6 pb-8 custom-scrollbar">
          <div key={step} className="animate-in slide-in-from-right-4 fade-in duration-500">
            {step === 0 && (
              <div className="space-y-6">
                {/* <HeaderIcon icon={User} title="Sender" color="blue" /> */}
                <div className="grid grid-cols-6 gap-x-5 gap-y-4">
                  {/* Contact Person */}
                  <div className="col-span-6">
                    <FormInput
                      label="Contact Person*"
                      value={formData.senderContactPerson}
                      onChange={val => updateField('senderContactPerson', val)}
                      placeholder="e.g. John Doe"
                      icon={User}
                    />
                  </div>

                  {/* Business Name */}
                  <div className="col-span-6">
                    <FormInput
                      label="Business Name"
                      value={formData.senderBusinessName}
                      onChange={val => updateField('senderBusinessName', val)}
                      placeholder="e.g. Acme Corp"
                      icon={Building}
                    />
                  </div>

                  {/* Street Address */}
                  <div className="col-span-6">
                    <FormInput
                      label="Street Address*"
                      value={formData.senderStreetAddress}
                      onChange={val => updateField('senderStreetAddress', val)}
                      placeholder="Search..."
                      icon={Search}
                    />
                  </div>

                  {/* Street Number & Name */}
                  <div className="col-span-2">
                    <FormInput
                      label="Street Number"
                      value={formData.senderStreetNumber}
                      onChange={val => updateField('senderStreetNumber', val)}
                      placeholder="e.g. 12"
                      icon={Hash}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Street Name"
                      value={formData.senderStreetName}
                      onChange={val => updateField('senderStreetName', val)}
                      placeholder="e.g. Main Street"
                      icon={MapPin}
                    />
                  </div>

                  {/* Town/Suburb, State, Postcode */}
                  <div className="col-span-2">
                    <FormInput
                      label="Town / Suburb*"
                      value={formData.senderTownSuburb}
                      onChange={val => updateField('senderTownSuburb', val)}
                      placeholder="e.g. Sydney"
                      icon={Building}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm font-bold text-slate-800 dark:text-zinc-200 ml-1 tracking-tight">State*</Label>
                    <Select value={formData.senderState} onValueChange={val => updateField('senderState', val ?? '')}>
                      <SelectTrigger className="h-10 w-full rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium data-[size=default]:h-10">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="" >
                        {AU_STATES.map(state => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      label="Postcode*"
                      value={formData.senderPostcode}
                      onChange={val => updateField('senderPostcode', val)}
                      placeholder="2000"
                      icon={Hash}
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="col-span-3">
                    <FormInput
                      label="Phone*"
                      value={formData.senderPhone}
                      onChange={val => updateField('senderPhone', val)}
                      placeholder="04xx xxx xxx"
                      icon={Phone}
                    />
                  </div>
                  <div className="col-span-3">
                    <FormInput
                      label="Email*"
                      value={formData.senderEmail}
                      onChange={val => updateField('senderEmail', val)}
                      placeholder="john@example.com"
                      icon={Mail}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-6 gap-x-5 gap-y-4">
                  {/* Row 1 */}
                  <FormInput
                    label="CONTACT PERSON *"
                    value={formData.receiverContactPerson}
                    onChange={val => updateField('receiverContactPerson', val)}
                    isHalf
                    placeholder="e.g. Jane Smith"
                    icon={User}
                  />
                  <FormInput
                    label="BUSINESS NAME"
                    value={formData.receiverBusinessName}
                    onChange={val => updateField('receiverBusinessName', val)}
                    isHalf
                    placeholder="e.g. Global Tech"
                    icon={Building}
                  />

                  {/* Row 2 */}
                  <FormInput
                    label="PHONE"
                    value={formData.receiverPhone}
                    onChange={val => updateField('receiverPhone', val)}
                    isHalf
                    placeholder="04xx xxx xxx"
                    icon={Phone}
                  />
                  <FormInput
                    label="EMAIL"
                    value={formData.receiverEmail}
                    onChange={val => updateField('receiverEmail', val)}
                    isHalf
                    placeholder="jane@example.com"
                    icon={Mail}
                  />

                  {/* Row 3 - Full Address Search */}
                  <FormInput
                    label="FULL ADDRESS SEARCH"
                    value={formData.receiverStreetAddress}
                    onChange={val => updateField('receiverStreetAddress', val)}
                    isFullWidth
                    placeholder="Start typing to search address..."
                    icon={Search}
                  />

                  {/* Row 4 */}
                  <div className="col-span-2">
                    <FormInput
                      label="Street Number"
                      value={formData.receiverStreetNumber}
                      onChange={val => updateField('receiverStreetNumber', val)}
                      placeholder="e.g. 45"
                      icon={Hash}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Street Name"
                      value={formData.receiverStreetName}
                      onChange={val => updateField('receiverStreetName', val)}
                      placeholder="e.g. Queen Street"
                      icon={MapPin}
                    />
                  </div>

                  {/* Row 5 */}
                  <div className="col-span-2">
                    <FormInput
                      label="Town / Suburb *"
                      value={formData.receiverTownSuburb}
                      onChange={val => updateField('receiverTownSuburb', val)}
                      placeholder="e.g. Melbourne"
                      icon={Building}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm font-bold text-slate-800 dark:text-zinc-200 ml-1 tracking-tight">State *</Label>
                    <Select value={formData.receiverState} onValueChange={val => updateField('receiverState', val ?? '')}>
                      <SelectTrigger className="h-10 w-full rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium data-[size=default]:h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {AU_STATES.map(state => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      label="Postcode *"
                      value={formData.receiverPostcode}
                      onChange={val => updateField('receiverPostcode', val)}
                      placeholder="3000"
                      icon={Hash}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Shipment Content</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Add one or more items to your order</p>
                    </div>
                  </div>

                </div>

                <div className="space-y-5">
                  {formData.packets.map((packet, index) => (
                    <div
                      key={packet.id}
                      className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      {/* Left accent bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600" />

                      {/* Remove button */}
                      {formData.packets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePacket(packet.id)}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all z-20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Card header */}
                      <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Item {index + 1}</h4>
                          <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Package details & dimensions</p>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="px-6 py-5 space-y-5">
                        {/* Row 1: Type, Qty, Weight — proper 4-column grid */}
                        <div className="grid grid-cols-3 gap-4">
                          <FormSelect
                            label="Package Type"
                            value={packet.itemType}
                            onValueChange={val => updatePacket(packet.id, 'itemType', val ?? 'Standard Box')}
                            options={PACKAGE_TYPES}
                            isCompact
                          />
                          <FormInput
                            label="Quantity"
                            type="number"
                            value={packet.quantity}
                            onChange={val => updatePacket(packet.id, 'quantity', val)}
                            placeholder="1"
                            isCompact
                          />
                          <FormInput
                            label="Weight (kg)"
                            type="number"
                            value={packet.weight}
                            onChange={val => updatePacket(packet.id, 'weight', val)}
                            placeholder="0.00"
                            isCompact
                          />
                        </div>

                        {/* Row 2: Dimensions */}
                        <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50 p-4">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Dimensions</p>
                          <div className="grid grid-cols-3 gap-4">
                            <FormInput
                              label="Length (cm)"
                              type="number"
                              value={packet.length}
                              onChange={val => updatePacket(packet.id, 'length', val)}
                              isCompact
                              placeholder="0"
                            />
                            <FormInput
                              label="Width (cm)"
                              type="number"
                              value={packet.width}
                              onChange={val => updatePacket(packet.id, 'width', val)}
                              isCompact
                              placeholder="0"
                            />
                            <FormInput
                              label="Height (cm)"
                              type="number"
                              value={packet.height}
                              onChange={val => updatePacket(packet.id, 'height', val)}
                              isCompact
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPacket}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-bold text-sm hover:border-blue-400 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center transition-colors">
                      <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    </div>
                    Add Another Item
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-[12px] leading-relaxed text-amber-800 dark:text-amber-200 font-medium">
                    Ensure all item weights and dimensions are accurate to avoid additional surcharges or logistics delays.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
                <HeaderIcon icon={CheckCircle2} title="Final Review" color="green" />
                <div className="rounded-3xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-8 divide-x divide-slate-100 dark:divide-zinc-800 font-medium">
                    <SummaryCard
                      title="From"
                      name={formData.senderContactPerson}
                      address={`${formData.senderStreetNumber} ${formData.senderStreetName} ${formData.senderStreetAddress}, ${formData.senderTownSuburb}, ${formData.senderState} ${formData.senderPostcode}`}
                      phone={formData.senderPhone}
                    />
                    <SummaryCard
                      title="To"
                      name={formData.receiverContactPerson}
                      address={`${formData.receiverStreetNumber} ${formData.receiverStreetName} ${formData.receiverStreetAddress}, ${formData.receiverTownSuburb}, ${formData.receiverState} ${formData.receiverPostcode}`}
                      phone={formData.receiverPhone}
                      isRight
                    />
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
                    <h4 className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 ml-1">Package Details</h4>
                    <div className="space-y-3">
                      {formData.packets.map((packet, index) => (
                        <div key={packet.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100/50 dark:border-zinc-800/50">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{packet.itemType}</p>
                              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium uppercase tracking-tight">
                                {packet.length}x{packet.width}x{packet.height} cm
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-8 text-right">
                            <SummaryMetric label="Qty" value={packet.quantity} />
                            <SummaryMetric label="Weight" value={`${packet.weight} kg`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0060FE]/5 dark:bg-[#0060FE]/10 border border-[#0060FE]/10 dark:border-[#0060FE]/20 flex gap-4">
                  <div className="w-10 h-10 rounded-md bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center shrink-0">
                    <LayoutGrid className="w-5 h-5 text-[#0060FE] dark:text-blue-400" />
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400">
                    By clicking <span className="font-bold text-slate-900 dark:text-zinc-100 italic">Create Order</span>, you agree to our platform's logistics and safety terms. Your request will be instantly visible to partners.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="px-8 py-6 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 0 || isSubmitting}
            className={cn("gap-2 px-4 rounded-md text-slate-500 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800", step === 0 && "invisible")}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={step === steps.length - 1 ? handleSubmit : nextStep}
            disabled={!isStepValid() || isSubmitting}
            className={cn(
              "gap-2 min-w-[140px] h-10 rounded-md font-bold transition-all duration-300 shadow-md",
              step === steps.length - 1
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 text-white"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Shipping...
              </>
            ) : step === steps.length - 1 ? (
              <>
                Create Order
                <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </>
            )}
          </Button>
        </div>
      </>
    )}
  </div>
</div>
  );
}
