import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
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
import { useCreateOrder, useOrderReceiverAddress, useUpdateOrderReceiverAddress } from '../hooks/useOrders';
import { useAppSelector } from '@/hooks/store.hooks';

export default function CreateOrderDialog({ onOpenChange, type, open, initialData, isEdit, orderId, isUpdate }: CreateOrderDialogProps) {
  const navigate = useNavigate();
  const { role, user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<AddressData>({
    email: "",
    phone: "",
    company: "",
    address: "",
    address1: "",
    unit_number: "",
    street_number: "",
    street_name: "",
    suburb: "",
    state: "",
    building: "",
    instructions: "",
    postcode: "",
    country: "AUSTRALIA",
    name: "",
    saveToAddressBook: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [activeLookup, setActiveLookup] = useState<string>('address');

  const debouncedSearchAddress = useDebounce(searchAddress, 400);
  const { data: addressBookData } = useAddressBookSearch(debouncedSearchAddress);
  const { data: orderResponse } = useOrderReceiverAddress(orderId || '');
  const { mutate: createOrder, isPending: saveLoading } = useCreateOrder();
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
      country: "AUSTRALIA",
    }));
  }, [addressBookData]);
  const updateField = (field: keyof AddressData, value: string | boolean | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/.test(phone.replace(/[\s-()]/g, ''));

  const updatePayload = useMemo(() => ({
    receiver_name: formData.name,
    receiver_business_name: formData.company,
    receiver_phone: formData.phone,
    receiver_email: formData.email,
    receiver_address: formData.address,
    unit_number: formData.building,
    street_number: formData.street_number,
    street_name: formData.street_name,
    suburb: formData.suburb,
    state: formData.state,
    postcode: formData.postcode,
    special_instructions: formData.instructions
  }), [formData])

  const executeCreateOrder = () => {
    if (!user) return;
    const service = JSON.parse(sessionStorage.getItem('quote_courier') || '{}')?.courier;
    const items = JSON.parse(sessionStorage.getItem('quote_items') || '[]');
    const payload = {
      sender: {
        email: user.email || '',
        phone: user.office_number || '',
        company: user.company_name || '',
        address: user.addresses?.[0]?.address || '',
        address1: user.addresses?.[0]?.address || '',
        suburb: user.addresses?.[0]?.suburb || '',
        state: user.addresses?.[0]?.state || '',
        street_name: user.addresses?.[0]?.street_name || '',
        street_number: user.addresses?.[0]?.street_number || '',
        postcode: user.addresses?.[0]?.postcode || '',
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        country: user.addresses?.[0]?.country || 'AUSTRALIA',
      },
      receiver: {
        ...formData
      },
      parcels: items.length > 0 ? items.map((item: any) => ({
        type: "box",
        quantity: item.quantity || 1,
        weight: item.weight || 0,
        length: item.length || 0,
        width: item.width || 0,
        height: item.height || 0
      })) : undefined,
      service: service ? {
        courier: service.courier_id,
        product_id: service.product_id,
        product_type: service.product_type,
        shipment_summary: service.shipment_summary,
        cover_limited_liability: 0,
        signature_required: 0,
      } : undefined,
      capture: false
    }
    sessionStorage.removeItem('quote_courier')
    sessionStorage.removeItem('quote_items')
    createOrder(payload, {
      onSuccess: (response) => {
        if (response.status) {
          showToast('Orders Created successfully', 'success');
          setIsSubmitting(false);
          onOpenChange(false)
          navigate(`${role === 'admin' ? '/admin' : ''}/orders/consign/${response?.data?.order_number}`);
          // setWalletCheckOpen(false);
          // if (response.order_number) {
          //   printLabel(response.order_number);
          // }
        } else {
          showToast(response.message || 'Failed to create orders', 'error');
        }
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || 'Failed to create orders', 'error');
      },
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { address1, country, name, postcode, state, suburb, phone, email } = formData;
    if (!name || !address1 || !suburb || !state || !postcode || !country) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (email && !isEmailValid(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (phone && !isPhoneValid(phone)) {
      showToast("Please enter a valid Australian phone number", "error");
      return;
    }
    if (isUpdate) {
      updateOrderReceiverAddress({
        orderId: orderId as string,
        data: updatePayload
      }, {
        onSuccess: () => {
          onOpenChange(false)
        }
      })
    } else {
      executeCreateOrder()
      // onSubmit(type!, formData)
      // setIsSubmitting(false);
      // onOpenChange(false)
    }
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
        name: orderResponse?.data.receiver_name,
        email: orderResponse?.data.receiver_email,
        phone: orderResponse?.data.receiver_phone,
        company: orderResponse?.data.receiver_business_name || '',
        building: orderResponse?.data.receiver_building || '',
        instructions: orderResponse?.data.special_instructions || '',
        address: orderResponse?.data.receiver_address,
        address1: orderResponse?.data.receiver_address,
        unit_number: orderResponse?.data.receiver_unit_number || '',
        street_name: orderResponse?.data.receiver_street_name || '',
        street_number: orderResponse?.data.receiver_street_number || '',
        suburb: orderResponse?.data.suburb,
        state: orderResponse?.data.state,
        postcode: orderResponse?.data.postcode,
        country: orderResponse?.data.country || 'Australia',
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
      submitText={isUpdate ? 'Update' : 'Save'}
      isLoading={isUpdatePending || saveLoading}
    >
      <div className="flex-1 overflow-y-auto p-4 pt-0 custom-scrollbar">
        <div className="space-y-5 max-w-5xl mx-auto">

          <div className="flex flex-col md:flex-row gap-0">
            <div className="flex overflow-hidden border border-primary shrink-0 h-8">
              <button
                onClick={() => setActiveLookup('contact')}
                className={cn(
                  "px-6 py-2 text-[12px] font-bold tracking-wide transition-colors border-r border-primary",
                  activeLookup === 'contact' ? "bg-primary text-white" : "bg-white dark:bg-zinc-950 text-primary"
                )}
              >
                Search by Contact
              </button>
              <button
                onClick={() => setActiveLookup('address')}
                className={cn(
                  "px-6 py-2 text-[12px] font-bold tracking-wide transition-colors",
                  activeLookup === 'address' ? "bg-primary text-white" : "bg-white dark:bg-zinc-950 text-primary"
                )}
              >
                Search by Address
              </button>
            </div>
            <div className="flex-1 relative">
              {activeLookup === 'address' ? (
                <PlaceAutocomplete
                  onPlaceSelect={(opt) => {
                    updateField('address', opt.formatted_address);
                    updateField('address1', opt.street);
                    updateField('suburb', opt.suburb);
                    updateField('unit_number', opt.unit_number);
                    updateField('street_name', opt.street_name!);
                    updateField('street_number', opt.street_number!);
                    updateField('state', opt.state);
                    updateField('postcode', opt.post_code);
                    updateField('country', opt.country);
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
                      updateField('unit_number', option.unit_number);
                      updateField('street_name', option.street_name!);
                      updateField('street_number', option.street_number!);
                      updateField('suburb', option.suburb);
                      updateField('state', option.state);
                      updateField('postcode', option.postcode);
                      updateField('country', option.country);
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
              <div className="space-y-4">
                <FormInput
                  label="Building"
                  value={formData.building}
                  onChange={val => updateField('building', val)}
                  layout="horizontal"
                  placeholder='Enter Building name'
                />
              </div>
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
                label="Street"
                value={formData.address1}
                onChange={val => updateField('address1', val)}
                layout="horizontal"
                placeholder='Enter Street name'
                required
                error={isSubmitting && formData.address1?.trim() === ''}
                errormsg="Please enter your street name"
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
                  <p className="text-sm text-slate-400 font-medium">No address suggestions to display.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}

        </div>
      </div>
    </CustomModel>
  );
}
