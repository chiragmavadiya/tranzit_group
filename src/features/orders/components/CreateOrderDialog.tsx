import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import type { AddressData, CreateOrderDialogProps } from '@/features/orders/types';
import { CustomModel } from '@/components/ui/dialog';
import { showToast } from '@/components/ui/custom-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { cn } from '@/lib/utils';
import { STATES } from '@/constants';
import { AutoComplete } from '@/components/common';
import { useAddressBookSearch } from '@/features/address-book/hooks/useAddressBook';
import { useDebounce } from '@/hooks/useDebounce';
import { useOrderDetails } from '../hooks/useOrders';

export default function CreateOrderDialog({ onOpenChange, type, open, initialData, onSubmit, isEdit, orderId }: CreateOrderDialogProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddressData>({
    email: "",
    phone: "",
    company: "",
    address: "",
    address1: "",
    suburb: "",
    state: "",
    street_name: "",
    unit_number: "",
    street_number: "",
    postcode: "",
    country: "",
    name: "",
    saveToAddressBook: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [activeLookup, setActiveLookup] = useState<string>('address');

  const debouncedSearchAddress = useDebounce(searchAddress, 400);
  const { data: addressBookData } = useAddressBookSearch(debouncedSearchAddress);
  const { data: orderResponse } = useOrderDetails(orderId || '')
  const options = useMemo(() => {
    if (!addressBookData?.data) return [];
    return addressBookData.data.map(({ value, label, data }) => ({
      value: value,
      label: label,
      name: data.receiver_name,
      phone: data.receiver_phone,
      email: data.receiver_email,
      address: `${data.street_number} ${data.street_name} ${data.street_type} ${data.suburb} ${data.state} ${data.postcode}`,
      address1: data.receiver_address,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
      country: "Australia",
      street_name: data.street_name,
      street_number: data.street_number,
      street_type: data.street_type,
    }));
  }, [addressBookData]);
  const updateField = (field: keyof AddressData, value: string | boolean | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/.test(phone.replace(/[\s-()]/g, ''));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { address1, country, name, postcode, state, street_name, street_number, suburb, phone, email } = formData;
    if (!name || !address1 || !street_number || !street_name || !suburb || !state || !postcode || !country || !phone || !email) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (!isEmailValid(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (!isPhoneValid(phone)) {
      showToast("Please enter a valid Australian phone number", "error");
      return;
    }
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
    navigate(-1);
  }

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData])

  useEffect(() => {
    if (orderResponse?.data) {
      setFormData({
        email: orderResponse?.data.receiver_details.email,
        phone: orderResponse?.data.receiver_details.mobile,
        company: orderResponse?.data.receiver_details.company || '',
        address: orderResponse?.data.receiver_details.address,
        address1: orderResponse?.data.receiver_details.address_detail.address_line,
        suburb: orderResponse?.data.receiver_details.address_detail.suburb,
        state: orderResponse?.data.receiver_details.address_detail.state,
        street_name: orderResponse?.data.receiver_details.address_detail.street_name,
        street_number: orderResponse?.data.receiver_details.address_detail.street_number,
        street_type: orderResponse?.data.receiver_details.address_detail.street_type,
        postcode: orderResponse?.data.receiver_details.address_detail.postcode,
        country: orderResponse?.data.receiver_details?.address_detail?.country || 'Australia',
        name: orderResponse?.data.receiver_details?.name,
        saveToAddressBook: false,
      });
    }
  }, [orderResponse])
  return (
    <CustomModel
      open={open}
      onOpenChange={handleCloseMenualy}
      title={`${type === 'receiver' ? 'Receiver' : 'Sender'} address`}
      description={`Enter the ${type}'s address. You can lookup a customer's details saved in the address book to complete this section.`}
      contentClass='min-w-3xl'
      onSubmit={handleSubmit}
      customFooter={<div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="saveToAddressBook"
          checked={formData.saveToAddressBook}
          onCheckedChange={(checked) => updateField('saveToAddressBook', checked as boolean)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-[4px]"
        />
        <label
          htmlFor="saveToAddressBook"
          className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer select-none"
        >
          Save address to address book
        </label>
      </div>}
    >
      <div className="flex-1 overflow-y-auto p-4 pt-0 custom-scrollbar">
        <div className="space-y-5 max-w-5xl mx-auto">

          <div className="flex flex-col md:flex-row gap-0">
            <div className="flex overflow-hidden border border-primary shrink-0 h-8">
              <button
                onClick={() => setActiveLookup('contact')}
                className={cn(
                  "px-6 py-2 text-[10px] font-bold tracking-widest transition-colors border-r border-primary",
                  activeLookup === 'contact' ? "bg-primary text-white" : "bg-white text-primary"
                )}
              >
                LOOK UP CONTACT
              </button>
              <button
                onClick={() => setActiveLookup('address')}
                className={cn(
                  "px-6 py-2 text-[10px] font-bold tracking-widest transition-colors",
                  activeLookup === 'address' ? "bg-primary text-white" : "bg-white text-primary"
                )}
              >
                LOOK UP ADDRESS
              </button>
            </div>
            <div className="flex-1 relative">
              {activeLookup === 'address' ? (
                <PlaceAutocomplete
                  onPlaceSelect={(opt) => {
                    updateField('address', opt.formatted_address);
                    updateField('address1', opt.address1);
                    updateField('suburb', opt.suburb);
                    updateField('state', opt.state);
                    updateField('postcode', opt.post_code);
                    updateField('country', opt.country);
                    updateField('street_name', opt.street_name);
                    updateField('street_number', opt.street_number);
                    updateField('street_type', opt.street_type);
                  }}
                  onChange={(value) => { updateField('address', value!); updateField('address1', value!) }}
                  value={formData.address}
                  inputClassName='rounded-none'
                />
              ) : (
                <AutoComplete
                  placeholder='Enter name or code to search the address book'
                  className='rounded-none'
                  inputClassName='rounded-none'
                  onChange={(value) => { setSearchAddress(value!); }}
                  value={searchAddress}
                  onSearch={(value) => setSearchAddress(value)}
                  onSelect={(value) => {
                    const option = options.find((opt) => opt.value === value);
                    if (option) {
                      updateField('name', option.name);
                      updateField('phone', option.phone);
                      updateField('email', option.email);
                      updateField('address', option.address);
                      updateField('address1', option.address1);
                      updateField('suburb', option.suburb);
                      updateField('state', option.state);
                      updateField('postcode', option.postcode);
                      updateField('country', option.country);
                      updateField('street_name', option.street_name);
                      updateField('street_number', option.street_number);
                      updateField('street_type', option.street_type);
                    }
                  }}
                  options={options}
                />
              )}
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-12 gap-x-12 gap-y-6 mt-4">

            {/* Left Column */}
            <div className="col-span-12 md:col-span-6 space-y-2">
              <FormInput
                label="Name"
                value={formData.name}
                onChange={val => updateField('name', val)}
                layout="horizontal"
                required
                placeholder="Enter Name"
                error={isSubmitting && formData.name?.trim() === ''}
                errormsg="Please enter your name"
                className='rounded-none'
              />
              <FormInput
                label="Email"
                value={formData.email}
                onChange={val => updateField('email', val)}
                layout="horizontal"
                placeholder="Enter Email"
                required
                error={isSubmitting && (!formData.email?.trim() || !isEmailValid(formData.email))}
                errormsg={!formData.email?.trim() ? "Please enter your email" : "Please enter a valid email address"}
              />
              <FormInput
                label="Phone"
                value={formData.phone}
                onChange={val => updateField('phone', val)}
                layout="horizontal"
                placeholder="Enter Phone"
                required
                error={isSubmitting && (!formData.phone?.trim() || !isPhoneValid(formData.phone))}
                errormsg={!formData.phone?.trim() ? "Please enter your phone" : "Please enter a valid phone number"}
              />
              <div className="space-y-4">
                <FormInput
                  label="Company"
                  value={formData.company}
                  onChange={val => updateField('company', val)}
                  layout="horizontal"
                  placeholder='Enter Company name'
                />
                {/* <div className="flex justify-start">
                  <ValidAddressBadge />
                </div> */}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 md:col-span-6 space-y-2">
              <FormInput
                label="Unit Number"
                value={formData.unit_number}
                onChange={val => updateField('unit_number', val)}
                layout="horizontal"
                placeholder='Enter unit number'
              />
              <FormInput
                label="Street Name"
                value={formData.street_name}
                onChange={val => updateField('street_name', val)}
                layout="horizontal"
                placeholder='Enter Street name'
                required
                error={isSubmitting && formData.street_name?.trim() === ''}
                errormsg="Please enter your street name"
              />
              <FormInput
                label="Street Number"
                value={formData.street_number}
                onChange={val => updateField('street_number', val)}
                layout="horizontal"
                placeholder='Enter Street number'
                required
                error={isSubmitting && formData.street_number?.trim() === ''}
                errormsg="Please enter your street number"
              />
              <FormInput
                label="Suburb"
                value={formData.suburb}
                onChange={val => updateField('suburb', val ?? '')}
                layout="horizontal"
                placeholder="Enter Suburb"
                required
                error={isSubmitting && formData.suburb?.trim() === ''}
                errormsg="Please enter your suburb"
              />
              <FormInput
                label="Postcode"
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
                  label="Country"
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
          {/* <div className="col-span-12">
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
          </div> */}

        </div>
      </div>
    </CustomModel>
  );
}
