import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
import type { AddressData, CreateOrderDialogProps } from '@/features/orders/types';
import { CustomModel } from '@/components/ui/dialog';
import { showToast } from '@/components/ui/custom-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { cleanSpaces, cn, isEmailValid, isPhoneValid } from '@/lib/utils';
import { STATES } from '@/constants';
import AutoComplete from '@/components/common/AutoComplate2';
import { useAddressBookSearch } from '@/features/address-book/hooks/useAddressBook';
import { useDebounce } from '@/hooks/useDebounce';
import { useOrderReceiverAddress, useUpdateOrderReceiverAddress } from '../hooks/useOrders';
import { useAppSelector } from '@/hooks/store.hooks';
import { useCustomers } from '@/features/customers/hooks/useCustomers';

export default function CreateOrderDialog({ onOpenChange, type, open, initialData, isEdit, onSubmit, orderId, orderType, selectedCustomer, onCustomerSelect }: CreateOrderDialogProps) {
  const navigate = useNavigate();
  const { role } = useAppSelector((state) => state.auth);
  const isAdminCreate = role === 'admin' && (orderType === 'create' || orderType === 'create-menual') && type === 'receiver';

  const [localCustomerId, setLocalCustomerId] = useState<number | undefined>(selectedCustomer);

  const { data: customersData } = useCustomers({ per_page: 1000 }, isAdminCreate);

  const [formData, setFormData] = useState<AddressData>({
    email: "",
    phone: "",
    company: "",
    address_info: "",
    address1: "",
    unit_number: "",
    street_number: "",
    street_name: "",
    suburb: "",
    state: "",
    instructions: "",
    postcode: "",
    country: "AU",
    name: "",
    saveToAddressBook: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [activeLookup, setActiveLookup] = useState<string>('address');
  const [isSelected, setIsSelected] = useState(false);

  const debouncedSearchAddress = useDebounce(searchAddress, 400);
  const { data: addressBookData } = useAddressBookSearch(debouncedSearchAddress);
  const { data: orderResponse } = useOrderReceiverAddress((!initialData && orderId) || '');
  // const { mutate: createOrder, isPending: saveLoading } = useCreateOrder();
  const { mutateAsync: updateOrderReceiverAddress, isPending: isUpdatePending } = useUpdateOrderReceiverAddress();
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
      unit_number: data.unit_number,
      street_name: data.street_name,
      street_number: data.street_number,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
      company_name: data.receiver_business_name,
      country: "AU",
    }));
  }, [addressBookData]);

  const updateField = (field: keyof AddressData, value: string | boolean | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePayload = useMemo(() => ({
    receiver_name: formData.name,
    receiver_business_name: formData.company,
    receiver_phone: cleanSpaces(formData?.phone),
    receiver_email: formData.email,
    receiver_address: formData.address1,
    unit_number: formData.unit_number,
    address_info: formData.address_info,
    address: formData.address1,
    street_number: formData.street_number,
    street_name: formData.street_name,
    suburb: formData.suburb,
    state: formData.state,
    postcode: formData.postcode,
    special_instructions: formData.instructions
  }), [formData])

  // const executeCreateOrder = () => {
  //   if (!user) return;
  //   const service = hasDefaultItemAndCourier ? default_courier : JSON.parse(sessionStorage.getItem('quote_courier') || '{}')?.courier;
  //   const items = hasDefaultItemAndCourier ? default_item : JSON.parse(sessionStorage.getItem('quote_items') || '[]');
  //   const payload = {
  //     sender: {
  //       email: user.email || '',
  //       phone: user.office_number || '',
  //       company: user.company_name || '',
  //       address: user.addresses?.[0]?.address || '',
  //       address1: user.addresses?.[0]?.address || '',
  //       suburb: user.addresses?.[0]?.suburb || '',
  //       state: user.addresses?.[0]?.state || '',
  //       street_name: user.addresses?.[0]?.street_name || '',
  //       street_number: user.addresses?.[0]?.street_number || '',
  //       postcode: user.addresses?.[0]?.postcode || '',
  //       name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
  //       country: user.addresses?.[0]?.country || 'Australia',
  //     },
  //     receiver: {
  //       ...formData
  //     },
  //     parcels: items.length > 0 ? items.map((item: any) => ({
  //       type: "box",
  //       quantity: item.quantity || 1,
  //       weight: item.weight || 0,
  //       length: item.length || 0,
  //       width: item.width || 0,
  //       height: item.height || 0
  //     })) : undefined,
  //     service: service ? {
  //       courier: service.carrier_id,
  //       product_id: service.product_id,
  //       product_type: service.product_type,
  //       shipment_summary: service.shipment_summary,
  //       cover_limited_liability: 0,
  //       signature_required: 0,
  //     } : undefined,
  //     surcharges: JSON.parse(sessionStorage.getItem('quote_courier') || '{}')?.surcharges || [],
  //     capture: false
  //   }
  //   sessionStorage.removeItem('quote_courier')
  //   sessionStorage.removeItem('quote_items')
  //   createOrder(payload, {
  //     onSuccess: (response) => {
  //       if (response.status) {
  //         showToast('Orders Created successfully', 'success');
  //         setIsSubmitting(false);
  //         onOpenChange(false)
  //         navigate(`${role === 'admin' ? '/admin' : ''}/orders/consign/${response?.data?.order_number}`);
  //         // setWalletCheckOpen(false);
  //         // if (response.order_number) {
  //         //   printLabel(response.order_number);
  //         // }
  //       } else {
  //         showToast(response.message || 'Failed to create orders', 'error');
  //       }
  //     },
  //     onError: (err: any) => {
  //       showToast(err?.response?.data?.message || 'Failed to create orders', 'error');
  //     },
  //   });
  // };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { address1, country, name, postcode, state, suburb, phone, email } = formData;
    if (!name || !address1?.trim() || !suburb || !state || !postcode || !country) {
      showToast("Please fill in all required fields", "error");
      setIsSelected(false)
      return;
    }

    if (email && !isEmailValid(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (phone && !isPhoneValid(phone)) {
      showToast("Please enter a valid phone number", "error");
      return;
    }

    // if (orderType === 'create' && hasDefaultItemAndCourier && !isEdit) {
    //   executeCreateOrder()
    //   return;
    // }
    if (isAdminCreate && !localCustomerId) {
      showToast("Please select a customer", "error");
      return;
    }

    if (isEdit && orderType !== 'create' && role !== 'admin') {
      updateOrderReceiverAddress({
        orderId: orderId as string,
        data: updatePayload
      }, {
        onSuccess: () => {
          onSubmit(type!, formData);
          onCustomerSelect?.(localCustomerId);
          onOpenChange(false);
        }
      })
    } else {
      onSubmit(type!, formData)
      onCustomerSelect?.(localCustomerId);
      setIsSubmitting(false);
      onOpenChange(false)
    }
  };

  const handleCloseMenualy = (value: boolean) => {
    if (!value && isEdit) {
      onOpenChange(false)
      return
    }
    if (value) return
    navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
  }

  useEffect(() => {
    setLocalCustomerId(selectedCustomer);
  }, [selectedCustomer]);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData])

  useEffect(() => {
    if (orderResponse?.data) {
      setFormData({
        name: orderResponse?.data.receiver_name,
        email: orderResponse?.data.receiver_email,
        phone: orderResponse?.data.receiver_phone,
        company: orderResponse?.data.receiver_business_name || '',
        instructions: orderResponse?.data.special_instructions || '',
        address_info: orderResponse?.data.address_info,
        address1: orderResponse?.data.receiver_address,
        unit_number: orderResponse?.data.unit_number || '',
        street_name: orderResponse?.data.street_name || '',
        street_number: orderResponse?.data.street_number || '',
        suburb: orderResponse?.data.suburb,
        state: orderResponse?.data.state,
        postcode: orderResponse?.data.postcode,
        country: orderResponse?.data.country || 'AU',
        saveToAddressBook: false,
      });
    }
  }, [orderResponse])

  return (
    <CustomModel
      open={open}
      onOpenChange={handleCloseMenualy}
      title={`Add ${type === 'receiver' ? 'Receiver' : 'Sender'} Detail`}
      // description={`Enter the ${type}'s address. You can lookup a customer's details saved in the address book to complete this section.`}
      description={`Search your address book or enter the ${type}'s  delivery detail for this order.`}
      contentClass="w-[95vw] sm:max-w-none md:w-full md:max-w-3xl md:min-w-[720px] lg:min-w-[850px] lg:max-w-4xl"
      onSubmit={handleSubmit}
      customFooter={!orderId && <div className="flex items-center gap-2">
        <Checkbox
          id="saveToAddressBook"
          checked={formData.saveToAddressBook}
          onCheckedChange={(checked) => updateField('saveToAddressBook', checked as boolean)}
        // className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-[4px]"
        />
        <label
          htmlFor="saveToAddressBook"
          className="text-sm font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer select-none"
        >
          Save contact to address book
        </label>
      </div>}
      submitText={isEdit ? 'Update' : 'Continue'}
      isLoading={isUpdatePending}
    >
      <div className="space-y-5 max-w-5xl mx-auto p-1">

        {isAdminCreate && (
          <FormSelect
            label="Customer"
            placeholder="Select Customer"
            value={localCustomerId?.toString() || ''}
            onValueChange={(val) => {
              const id = val ? Number(val) : undefined;
              setLocalCustomerId(id);
              onCustomerSelect?.(id);
            }}
            options={customersData?.data?.map((c: any) => ({
              value: c.id.toString(),
              label: `${c.first_name} ${c.last_name} (${c.email})`
            })) || []}
            layout="horizontal"
            required
          />
        )}

        <div className="flex flex-col gap-2">
          {/* Segmented Control (Tabs) */}
          <div className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-900 p-0.5 text-slate-500 dark:text-zinc-400 w-full sm:w-auto self-start">
            <button
              onClick={() => setActiveLookup('address')}
              type="button"
              className={cn(
                "flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1 text-xs font-bold transition-all h-7 cursor-pointer",
                activeLookup === 'address'
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-50 shadow-sm border border-slate-100/50 dark:border-zinc-700/30"
                  : "bg-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50"
              )}
            >
              Search by Address
            </button>
            <button
              onClick={() => setActiveLookup('contact')}
              type="button"
              className={cn(
                "flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1 text-xs font-bold transition-all h-7 cursor-pointer",
                activeLookup === 'contact'
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-50 shadow-sm border border-slate-100/50 dark:border-zinc-700/30"
                  : "bg-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50"
              )}
            >
              Search by Contact
            </button>
          </div>

          {/* Search Input Container */}
          <div className="relative border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950 focus-within:border-primary dark:focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all h-8 [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:rounded-none [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:h-8 [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:dark:bg-transparent [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:h-8 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:dark:bg-transparent [&_[data-slot=input]]:focus-visible:ring-0 [&_[data-slot=input]]:focus-visible:border-transparent">
            {activeLookup === 'address' ? (
              <PlaceAutocomplete
                onPlaceSelect={(opt) => {
                  updateField('address_info', opt.formatted_address);
                  updateField('address1', opt.street);
                  updateField('suburb', opt.suburb);
                  if (opt.unit_number) {
                    updateField('unit_number', opt.unit_number);
                  }
                  updateField('street_name', opt.street_name!);
                  updateField('street_number', opt.street_number!);
                  updateField('state', opt.state);
                  updateField('postcode', opt.post_code);
                  setIsSelected(true);
                }}
                onChange={(value) => { updateField('address_info', value!); setIsSelected(false) }}
                value={formData.address_info}
              />
            ) : (
              <AutoComplete
                placeholder='Enter name or code to search the address book'
                onChange={(value) => { setSearchAddress(value!); setIsSelected(false) }}
                value={searchAddress}
                onSearch={(value) => setSearchAddress(value)}
                shouldFilter={false}
                onSelect={(value) => {
                  const option = options.find((opt) => opt.value === value);
                  if (option) {
                    updateField('name', option.name);
                    updateField('phone', option.phone);
                    updateField('email', option.email);
                    updateField('address_info', option.address);
                    updateField('address1', option.address1);
                    if (option.unit_number) {
                      updateField('unit_number', option.unit_number);
                    }
                    updateField('street_name', option.street_name!);
                    updateField('street_number', option.street_number!);
                    updateField('suburb', option.suburb);
                    updateField('state', option.state);
                    updateField('postcode', option.postcode);
                    updateField('company', option.company_name);
                    setIsSelected(true);
                  }
                }}
                options={options}
              />
            )}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-4 mt-4">

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
            // required
            // error={isSubmitting && (!formData.email?.trim() || !isEmailValid(formData.email))}
            // errormsg={!formData.email?.trim() ? "Please enter your email" : "Please enter a valid email address"}
            />
            <FormInput
              label="Phone"
              value={formData.phone}
              onChange={val => updateField('phone', val)}
              layout="horizontal"
              placeholder="Enter Phone"
            // required
            // error={isSubmitting && (!formData.phone?.trim() || !isPhoneValid(formData.phone))}
            // errormsg={!formData.phone?.trim() ? "Please enter your phone" : "Please enter a valid phone number"}
            />
            <div className="space-y-4">
              <FormInput
                label="Company"
                value={formData.company}
                onChange={val => updateField('company', val)}
                layout="horizontal"
                placeholder='Enter Company name'
              />
            </div>
            {/* <div className="space-y-4">
                <FormInput
                  label="Building"
                  value={formData.building}
                  onChange={val => updateField('building', val)}
                  layout="horizontal"
                  placeholder='Enter Building name'
                />
              </div> */}
            <div className="space-y-4">
              <FormTextarea
                label="Instruction"
                value={formData.instructions}
                onChange={val => updateField('instructions', val)}
                layout="horizontal"
                placeholder='Enter Instruction'
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 md:col-span-6 space-y-2">
            <FormInput
              label="Unit number"
              value={formData.unit_number}
              onChange={val => updateField('unit_number', val)}
              layout="horizontal"
              placeholder='Enter Unit Number'
            // disabled={isSelected}
            />
            <FormInput
              label="Street"
              value={formData.address1}
              onChange={val => { updateField('address1', val); updateField('street_name', val) }}
              layout="horizontal"
              placeholder='Enter Street name'
              required
              error={isSubmitting && formData.address1?.trim() === ''}
              errormsg="Please enter your street name"
              disabled={formData.address1?.trim() !== '' && isSelected}
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
              disabled={isSelected}
            />
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
              disabled={isSelected}
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
              disabled={isSelected}
            />
            <div className="space-y-4">
              <FormInput
                label="Country"
                value={formData.country}
                // onChange={val => updateField('country', val)}
                layout="horizontal"
                placeholder='Enter Country Name'
                disabled
              // required
              // error={isSubmitting && formData.country?.trim() === ''}
              // errormsg="Please enter your country"
              />
            </div>
          </div>
        </div>

        {/* Address Validation Accordion */}
        {/* <div className="col-span-12">
            <Accordion className="w-full border border-slate-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950/50 shadow-sm overflow-hidden">
              <AccordionItem value="validation" className="border-none [&>h3]:my-0">
                <AccordionTrigger className="px-5 py-3 hover:no-underline flex justify-between items-center group">
                  <span className="text-[11px] font-extrabold text-slate-800 dark:text-zinc-300 uppercase tracking-wide leading-none">
                    ADDRESS VALIDATION
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <p className="text-sm text-slate-400 font-medium">No address suggestions to display.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}

      </div>
    </CustomModel>
  );
}
