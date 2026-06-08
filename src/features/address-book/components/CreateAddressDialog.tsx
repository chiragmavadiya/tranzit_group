import { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomModel, } from '@/components/ui/dialog';
import type { AddressFormData } from '../types';
import { FormInput, FormTextarea, FormSelect } from '@/features/orders/components/OrderFormUI';
import { AUSTRALIAN_STATES } from '../constants';
import { useAddressBookDetails } from '../hooks/useAddressBook';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { showToast } from '@/components/ui/custom-toast';
// import { GlobalCourierSelect } from '@/features/courier-surcharge/components/GlobalCourierSelect';

interface CreateAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormData) => void;
  editingAddressId?: string | number | null;
  isLoading?: boolean;
}

const MOCK_COURIERS = [
  {
    "label": "MyPost Business",
    "value": "5"
  },
  {
    "label": "Aramex Tranzit Group",
    "value": "6"
  },
  {
    "label": "Australia Post",
    "value": "8"
  },
  {
    "label": "Direct Freight Express Tranzit Group",
    "value": "13"
  }
]


export function CreateAddressDialog({
  open,
  onOpenChange,
  onSubmit,
  editingAddressId,
  isLoading = false,
}: CreateAddressDialogProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    contact_person: '',
    email: '',
    phone: '',
    special_instructions: '',
    default_carrier: '',
    customer_reference: '',
    business_name: '',
    address_info: '',
    address: '',
    building: '',
    unit_number: '',
    street_number: '',
    street_name: '',
    street_type: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
  });
  const [submited, setSubmited] = useState(false);
  const { data: detailsData, isLoading: isFetchingDetails } = useAddressBookDetails(editingAddressId || undefined);

  // const formRef = useRef<HTMLFormElement>(null);

  const handleChange = useCallback((field: keyof AddressFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = () => {
    // e.preventDefault();
    setSubmited(true);
    if (
      formData.contact_person.trim().length === 0 ||
      formData.address.trim().length === 0 ||
      formData.suburb.trim().length === 0 ||
      formData.state.trim().length === 0 ||
      formData.postcode.trim().length === 0 ||
      formData.country.trim().length === 0
    ) {
      showToast("Please fill all the required fields", 'error');
      return;
    }

    onSubmit(formData);
  };

  useEffect(() => {
    if (!open || !detailsData?.data) return;
    const data = detailsData.data;
    setFormData({ ...data, country: 'Australia' })
  }, [open, detailsData])

  return (
    <CustomModel
      title={editingAddressId ? 'Edit Address' : 'Add Receiver Address'}
      description='Save receiver details so you can reuse them when creating order and consignment'
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      cancelText="Cancel"
      submitText={editingAddressId ? 'Save Changes' : 'Create Address'}
      contentClass="sm:max-w-5xl gap-0"
    >
      {/* <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col max-h-[85vh] pb-4"> */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar relative">
        {isFetchingDetails && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fetching Details...</p>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div className="flex dark:border-zinc-800 rounded-xs overflow-hidden bg-white dark:bg-zinc-950 mb-6">
            <div className="flex-1 relative flex items-center">
              <PlaceAutocomplete
                placeholder='Search street address'
                onPlaceSelect={(opt) => {
                  handleChange('address_info', opt.formatted_address);
                  handleChange('unit_number', opt.unit_number);
                  handleChange('address', opt.street);
                  handleChange('street_number', opt.street_number);
                  handleChange('street_name', opt.street_name);
                  handleChange('street_type', opt.street_type);
                  handleChange('suburb', opt.suburb);
                  handleChange('state', opt.state);
                  handleChange('postcode', opt.post_code);
                }}
                onChange={(value) => handleChange('address_info', value)}
                // error={submited && formData.address_information?.trim() === ''}
                // errormsg='Please enter an address'
                value={formData.address_info}
                autoFocus={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              <FormInput
                layout="horizontal"
                label="Receiver name"
                value={formData.contact_person}
                onChange={(val) => handleChange('contact_person', val)}
                placeholder="Receiver name"
                required
                error={submited && formData.contact_person.length < 1}
                errormsg="Please enter receiver name"
                isFullWidth
              />
              <FormInput
                layout="horizontal"
                label="Email"
                value={formData.email}
                onChange={(val) => handleChange('email', val)}
                placeholder="example@mail.com"
                required
                error={submited && formData.email.length < 1}
                errormsg="Please enter an email"
                isFullWidth
              />
              <FormInput
                layout="horizontal"
                label="Phone"
                value={formData.phone || ''}
                onChange={(val) => handleChange('phone', val)}
                placeholder="Phone number"
                isFullWidth
                required
                error={submited && formData.phone.length < 1}
                errormsg="Please enter a phone number"
              />
              <FormTextarea
                layout="horizontal"
                label="Special Instructions"
                value={formData.special_instructions || ''}
                onChange={(val) => handleChange('special_instructions', val)}
                placeholder="instructions..."
                rows={3}
                isFullWidth
              />
              <FormSelect
                layout="horizontal"
                label="Preferred Courier"
                value={formData.default_carrier || ''}
                onValueChange={(val) => handleChange('default_carrier', val)}
                options={MOCK_COURIERS}
                placeholder="Select type"
                required
                error={submited && formData.default_carrier.length < 1}
                errormsg="Please select the carrier"
                isFullWidth
              />
              {/* <GlobalCourierSelect
                  layout='horizontal'
                  value={formData.default_carrier}
                  onValueChange={(val) => handleChange('default_carrier', val || '')}
                  required
                  error={submited && !formData.default_carrier}
                  errormsg="Please select a Default Courier"
                /> */}
              <FormInput
                layout="horizontal"
                label="Customer Reference"
                value={formData.customer_reference}
                onChange={(val) => handleChange('customer_reference', val)}
                placeholder="Customer Reference"
              // required
              // error={submited && formData.code.length < 1}
              // errormsg="Please enter a customer reference"
              // isFullWidth
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormInput
                layout="horizontal"
                label="Company Name"
                value={formData.business_name || ''}
                onChange={(val) => handleChange('business_name', val)}
                placeholder="Company name"
                isFullWidth
              />
              <FormInput
                layout="horizontal"
                label="Unit Number"
                value={formData.unit_number || ''}
                onChange={(val) => handleChange('unit_number', val)}
                placeholder="e.g. 1234"
                isFullWidth
              />
              <FormInput
                layout="horizontal"
                label="Street"
                value={formData.address || ''}
                onChange={(val) => handleChange('address', val)}
                placeholder="e.g. George"
                required
                error={submited && formData.address.length < 1}
                errormsg="Please enter the street"
                isFullWidth
              />
              <FormInput
                layout="horizontal"
                label="Suburb"
                value={formData.suburb || ''}
                onChange={(val) => handleChange('suburb', val)}
                placeholder="e.g. Sydney"
                required
                error={submited && formData.suburb.length < 1}
                errormsg="Please enter the suburb"
                isFullWidth
              />
              <FormSelect
                layout="horizontal"
                label="State"
                value={formData.state || ''}
                onValueChange={(val) => handleChange('state', val)}
                options={AUSTRALIAN_STATES}
                placeholder="Select state"
                required
                error={submited && formData.state.length < 1}
                errormsg="Please select the state"
              // isFullWidth
              />
              <FormInput
                layout="horizontal"
                label="Post Code"
                value={formData.postcode || ''}
                onChange={(val) => handleChange('postcode', val)}
                placeholder="e.g. 2000"
                required
                error={submited && formData.postcode.length < 1}
                errormsg="Please enter the post code"
                isFullWidth
              />
              <FormInput
                layout="horizontal"
                label="Country"
                value={formData.country || 'Australia'}
                // onChange={(val) => handleChange('country', val)}
                disabled
                placeholder="e.g. Australia"
                // required
                // error={submited && formData.country.length < 1}
                // errormsg="Please enter the country"
                isFullWidth
              />

            </div>
          </div>
        </div>
      </div>
      {/* </form> */}
    </CustomModel>
  );
}