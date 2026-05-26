import { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomModel, } from '@/components/ui/dialog';
import type { AddressFormData } from '../types';
import { FormInput, FormTextarea, FormSelect } from '@/features/orders/components/OrderFormUI';
import { AUSTRALIAN_STATES } from '../constants';
import { useAddressBookDetails } from '../hooks/useAddressBook';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { showToast } from '@/components/ui/custom-toast';
// import { GlobalCourierSelect } from '@/features/courier-surcharge/components/GlobalCourierSelect';
import { Checkbox } from '@/components/ui/checkbox';

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
    name: '',
    email: '',
    phone: '',
    instructions: '',
    default_carrier: '',
    default_code: '',
    signature_required: false,

    address: '',
    company: '',
    building: '',
    street: '',
    suburb: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
  });
  const [submited, setSubmited] = useState(false);
  const { data: detailsData, isLoading: isFetchingDetails } = useAddressBookDetails(editingAddressId || undefined);

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = useCallback((field: keyof AddressFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);
    if (
      formData.name.trim().length === 0 ||
      formData.street.trim().length === 0 ||
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
    setFormData({ ...data })
  }, [open, detailsData])

  return (
    <CustomModel
      title={editingAddressId ? 'Edit Address' : 'Add New Address'}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={() => formRef.current?.requestSubmit()}
      isLoading={isLoading}
      cancelText="Cancel"
      submitText={editingAddressId ? 'Save Changes' : 'Create Address'}
      contentClass="sm:max-w-4xl"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar relative">
          {isFetchingDetails && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching Details...</p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex dark:border-zinc-800 rounded-xs overflow-hidden bg-white dark:bg-zinc-950">
              <div className="flex-1 relative flex items-center">
                <PlaceAutocomplete
                  onPlaceSelect={(opt) => {
                    handleChange('address', opt.formatted_address);
                    handleChange('street', opt.street);
                    handleChange('suburb', opt.suburb);
                    handleChange('state', opt.state);
                    handleChange('postcode', opt.post_code);
                  }}
                  onChange={(value) => handleChange('address', value)}
                  error={submited && formData.address?.trim() === ''}
                  errormsg='Please enter an address'
                  value={formData.address}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {/* Left Column */}
              <div className="space-y-4">
                <FormInput
                  layout="horizontal"
                  label="Contact Person"
                  value={formData.name}
                  onChange={(val) => handleChange('name', val)}
                  placeholder="Full name"
                  required
                  error={submited && formData.name.length < 1}
                  errormsg="Please enter contact person name"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Email ID"
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
                  label="Mobile"
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
                  value={formData.instructions || ''}
                  onChange={(val) => handleChange('instructions', val)}
                  placeholder="instructions..."
                  rows={3}
                  isFullWidth
                />
                <FormSelect
                  layout="horizontal"
                  label="Default Carrier"
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
                  label="Code"
                  value={formData.default_code}
                  onChange={(val) => handleChange('default_code', val)}
                  placeholder="Enter code"
                  required
                  error={submited && formData.default_code.length < 1}
                  errormsg="Please enter a code"
                  isFullWidth
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Checkbox
                    id="signature_required"
                    checked={formData.signature_required}
                    onCheckedChange={(checked) => handleChange('signature_required', checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-[4px]"
                  />
                  <label
                    htmlFor="signature_required"
                    className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer select-none"
                  >
                    Signature Required
                  </label>
                </div>


              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <FormInput
                  layout="horizontal"
                  label="Company Name"
                  value={formData.company || ''}
                  onChange={(val) => handleChange('company', val)}
                  placeholder="Company name"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Building"
                  value={formData.building || ''}
                  onChange={(val) => handleChange('building', val)}
                  placeholder="e.g. 1234"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Street"
                  value={formData.street || ''}
                  onChange={(val) => handleChange('street', val)}
                  placeholder="e.g. George"
                  required
                  error={submited && formData.street.length < 1}
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
                <FormInput
                  layout="horizontal"
                  label="City"
                  value={formData.city || ''}
                  onChange={(val) => handleChange('city', val)}
                  placeholder="e.g. Sydney"
                  // required
                  // error={submited && formData.city.length < 1}
                  // errormsg="Please enter the city"
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
                  value={formData.country || ''}
                  onChange={(val) => handleChange('country', val)}
                  placeholder="e.g. Australia"
                  required
                  error={submited && formData.country.length < 1}
                  errormsg="Please enter the country"
                  isFullWidth
                />

              </div>
            </div>
          </div>
        </div>
      </form>
    </CustomModel>
  );
}