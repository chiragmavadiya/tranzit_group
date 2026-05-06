import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { generateUniqueId } from '@/lib/utils';
import { FormInput, FormSelect, ValidAddressBadge } from '@/features/orders/components/OrderFormUI';
import type { AddressData, CreateOrderDialogProps } from '@/features/orders/types';
import { CustomModel } from '@/components/ui/dialog';
import { AutoComplete } from '@/components/common';
import { LOCATION_OPTIONS, STATES } from '@/constants';
import { showToast } from '@/components/ui/custom-toast';
import { Checkbox } from '@/components/ui/checkbox';

// const initialData: AddressData = {
//   name: '',
//   email: '',
//   phone: '',
//   company: '',
//   address1: '',
//   suburb: '',
//   state: '',
//   street_number: '',
//   street_name: '',
//   postcode: '',
//   country: '',
//   saveToAddressBook: false,
// };

export default function CreateOrderDialog({ onOpenChange, type, open, initialData, onSubmit, isEdit }: CreateOrderDialogProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddressData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);

  const updateField = (field: keyof AddressData, value: string | boolean | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { address1, country, name, postcode, state, street_name, street_number, suburb } = formData;
    if (!name || !address1 || !street_number || !street_name || !suburb || !state || !postcode || !country) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    console.log(formData, 'formData')
    onSubmit(type!, formData)
    setIsSubmitting(false);
    onOpenChange(false)
  };

  const handleCloseMenualy = (value: boolean) => {
    if (!value && isEdit) {
      onOpenChange(false)
      return
    }
    if (value) return
    navigate(`/orders`);
  }
  return (
    <CustomModel
      open={open}
      onOpenChange={handleCloseMenualy}
      title={`${type === 'receiver' ? 'Receiver' : 'Sender'} address`}
      description={`Enter the ${type}'s address. You can lookup a customer's details saved in the address book to complete this section.`}
      contentClass='min-w-3xl'
      onSubmit={handleSubmit}
    >
      <div className="flex-1 overflow-y-auto p-4 pt-0 custom-scrollbar">
        <div className="space-y-5 max-w-5xl mx-auto">

          {/* <div className="flex flex-col md:flex-row gap-0"> */}
          {/* <div className="flex overflow-hidden border border-[#0060fe] shrink-0 h-8">
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
            </div> */}
          <div className="flex-1 relative">
            <AutoComplete
              label='Address Information'
              placeholder="Search suburb or postcode..."
              options={LOCATION_OPTIONS}
              defaultValue={formData.address1}
              onSelect={(val) => {
                const opt = LOCATION_OPTIONS.find(o => o.value === val);
                if (opt) {
                  updateField('address1', opt.label);
                  updateField('suburb', opt.suburb);
                  updateField('state', opt.state);
                  updateField('postcode', opt.postcode);
                  updateField('country', opt.country);
                  updateField('street_number', opt.streetNumber);
                  updateField('street_name', opt.streetName);
                }
              }}
              className="[&>div>input]:h-10 [&>div>input]:text-[13px]"
              required
              error={isSubmitting && formData.address1?.trim() === ''}
              errormsg="Please enter your address"
            />
          </div>
          {/* </div> */}

          {/* Form Grid */}
          <div className="grid grid-cols-12 gap-x-12 gap-y-6 mt-4">

            {/* Left Column */}
            <div className="col-span-12 md:col-span-6 space-y-2">
              <FormInput
                label="NAME"
                value={formData.name}
                onChange={val => updateField('name', val)}
                layout="horizontal"
                required
                placeholder="Enter Name"
                error={isSubmitting && formData.name?.trim() === ''}
                errormsg="Please enter your name"
              />
              <FormInput
                label="EMAIL"
                value={formData.email}
                onChange={val => updateField('email', val)}
                layout="horizontal"
                placeholder="Enter Email"
              />
              <FormInput
                label="PHONE"
                value={formData.phone}
                onChange={val => updateField('phone', val)}
                layout="horizontal"
                placeholder="Enter Phone"
              />
              <div className="space-y-4">
                <FormInput
                  label="COMPANY"
                  value={formData.company}
                  onChange={val => updateField('company', val)}
                  layout="horizontal"
                  placeholder='Enter Company name'
                />
                {/* <FormInput
                label="BUILDING"
                value={formData.receiverBuilding}
                onChange={val => updateField('receiverBuilding', val)}
                layout="horizontal"
              /> */}
                {/* <FormTextarea
                label="INSTRUCTIONS"
                value={formData.receiverInstructions}
                onChange={val => updateField('receiverInstructions', val)}
                rows={5}
                layout="horizontal"
              /> */}
                <div className="flex justify-start">
                  <ValidAddressBadge />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="saveToAddressBook"
                    checked={formData.saveToAddressBook}
                    onCheckedChange={(checked) => updateField('saveToAddressBook', checked as boolean)}
                    className="data-[state=checked]:bg-[#0060FE] data-[state=checked]:border-[#0060FE] rounded-[4px]"
                  />
                  <label
                    htmlFor="saveToAddressBook"
                    className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer select-none"
                  >
                    Save address to address book
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 md:col-span-6 space-y-2">
              <FormInput
                label="STREET NAME"
                value={formData.street_name}
                onChange={val => updateField('street_name', val)}
                layout="horizontal"
                placeholder='Enter Street name'
                required
                error={isSubmitting && formData.street_name?.trim() === ''}
                errormsg="Please enter your street name"
              />
              <FormInput
                label="STREET NUMBER"
                value={formData.street_number}
                onChange={val => updateField('street_number', val)}
                layout="horizontal"
                placeholder='Enter Street number'
                required
                error={isSubmitting && formData.street_number?.trim() === ''}
                errormsg="Please enter your street number"
              />
              <FormInput
                label="SUBURB"
                value={formData.suburb}
                onChange={val => updateField('suburb', val ?? '')}
                layout="horizontal"
                placeholder="Enter Suburb"
                required
                error={isSubmitting && formData.suburb?.trim() === ''}
                errormsg="Please enter your suburb"
              />
              <FormInput
                label="POSTCODE"
                value={formData.postcode}
                onChange={val => updateField('postcode', val ?? '')}
                // options={POSTCODES}
                layout="horizontal"
                placeholder='Postcode'
                required
                error={isSubmitting && formData.postcode?.trim() === ''}
                errormsg="Please enter your postcode"
              />
              {/* <FormInput
                label="STATE"
                value={formData.state}
                onChange={val => updateField('state', val)}
                layout="horizontal"
                required
              /> */}
              <FormSelect
                label="State"
                options={STATES}
                value={formData.state}
                placeholder='Select State'
                onValueChange={(val) => updateField('state', val!)}
                required
                error={isSubmitting && formData.state?.trim() === ''}
                errormsg="Please select your state"
                layout="horizontal"
              />

              <div className="space-y-4">
                <FormInput
                  label="COUNTRY"
                  value={formData.country}
                  onChange={val => updateField('country', val)}
                  layout="horizontal"
                  placeholder='Enter Country Name'
                  required
                  error={isSubmitting && formData.country?.trim() === ''}
                  errormsg="Please enter your country"
                />
              </div>
            </div>
          </div>

          {/* Address Validation Accordion */}
          <div className="col-span-12">
            <Accordion className="w-full border border-slate-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950/50 shadow-sm overflow-hidden">
              <AccordionItem value="validation" className="border-none [&>h3]:my-0">
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
    </CustomModel>
  );
}
