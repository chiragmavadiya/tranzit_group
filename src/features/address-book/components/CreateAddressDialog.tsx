import { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomModel, } from '@/components/ui/dialog';
import type { AddressFormData } from '../types';
import { FormInput, FormTextarea, FormSelect } from '@/features/orders/components/OrderFormUI';
import { AUSTRALIAN_STATES, STREET_TYPES } from '../constants';
import { useAddressBookDetails } from '../hooks/useAddressBook';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { showToast } from '@/components/ui/custom-toast';

interface CreateAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormData) => void;
  editingAddressId?: string | number | null;
  isLoading?: boolean;
}

export function CreateAddressDialog({
  open,
  onOpenChange,
  onSubmit,
  editingAddressId,
  isLoading = false,
}: CreateAddressDialogProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    code: '',
    contact_person: '',
    business_name: '',
    email: '',
    phone: '',
    unit_number: '',
    street_number: '',
    street_name: '',
    street_type: '',
    suburb: '',
    state: '',
    postcode: '',
    additional_details: '',
    special_instructions: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [submited, setSubmited] = useState(false);
  const { data: detailsData, isLoading: isFetchingDetails } = useAddressBookDetails(editingAddressId || undefined);

  const formRef = useRef<HTMLFormElement>(null);

  // Use a unique key to force remount when the underlying data changes
  // const formKey = editingAddressId ? `edit-${editingAddressId}-${detailsData?.data ? 'loaded' : 'loading'}` : 'new';

  const handleChange = useCallback((field: keyof AddressFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);
    console.log(formData);
    if (
      formData.code.trim().length === 0 ||
      formData.contact_person.trim().length === 0 ||
      formData.email.trim().length === 0 ||
      formData.address.trim().length === 0 ||
      formData.street_number.trim().length === 0 ||
      formData.street_name.trim().length === 0 ||
      formData.street_type.trim().length === 0 ||
      formData.suburb.trim().length === 0 ||
      formData.state.trim().length === 0 ||
      formData.postcode.trim().length === 0 ||
      !formData.phone ||
      formData.phone.trim().length === 0
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

  console.log(formData.address, 'formData.address')
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
            <div className="flex dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950">
              <div className="flex-1 relative flex items-center">
                <PlaceAutocomplete
                  onPlaceSelect={(opt) => {
                    handleChange('address', opt.formatted_address);
                    handleChange('street_name', opt.street_name);
                    handleChange('street_number', opt.street_number);
                    handleChange('street_type', opt.street_type);
                    handleChange('suburb', opt.suburb);
                    handleChange('state', opt.state);
                    handleChange('postcode', opt.post_code);
                    handleChange('longitude', opt.longitude);
                    handleChange('latitude', opt.latitude);
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
                  label="Code"
                  value={formData.code}
                  onChange={(val) => handleChange('code', val)}
                  placeholder="Enter code"
                  required
                  error={submited && formData.code.length < 1}
                  errormsg="Please enter a code"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Contact Person"
                  value={formData.contact_person}
                  onChange={(val) => handleChange('contact_person', val)}
                  placeholder="Full name"
                  required
                  error={submited && formData.contact_person.length < 1}
                  errormsg="Please enter contact person name"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Business Name"
                  value={formData.business_name}
                  onChange={(val) => handleChange('business_name', val)}
                  placeholder="Company name"
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
                  value={formData.special_instructions || ''}
                  onChange={(val) => handleChange('special_instructions', val)}
                  placeholder="instructions..."
                  rows={3}
                  isFullWidth
                />
                <FormTextarea
                  layout="horizontal"
                  label="Additional Details"
                  value={formData.additional_details || ''}
                  onChange={(val) => handleChange('additional_details', val)}
                  placeholder="notes..."
                  rows={3}
                  isFullWidth
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <FormInput
                  layout="horizontal"
                  label="Unit Number"
                  value={formData.unit_number || ''}
                  onChange={(val) => handleChange('unit_number', val)}
                  placeholder="e.g. 1A"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Street Name"
                  value={formData.street_name || ''}
                  onChange={(val) => handleChange('street_name', val)}
                  placeholder="e.g. George"
                  required
                  error={submited && formData.street_name.length < 1}
                  errormsg="Please enter the street name"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Street Number"
                  value={formData.street_number || ''}
                  onChange={(val) => handleChange('street_number', val)}
                  placeholder="e.g. 123"
                  required
                  error={submited && formData.street_number.length < 1}
                  errormsg="Please enter the street number"
                  isFullWidth
                />
                <FormSelect
                  layout="horizontal"
                  label="Street Type"
                  value={formData.street_type || ''}
                  onValueChange={(val) => handleChange('street_type', val)}
                  options={STREET_TYPES}
                  placeholder="Select type"
                  required
                  error={submited && formData.street_type.length < 1}
                  errormsg="Please select the street type"
                // isFullWidth
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
                  label="Latitude"
                  value={formData.latitude || ''}
                  onChange={(val) => handleChange('latitude', val)}
                  placeholder="e.g. -33.8688"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Longitude"
                  value={formData.longitude || ''}
                  onChange={(val) => handleChange('longitude', val)}
                  placeholder="e.g. 151.2093"
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