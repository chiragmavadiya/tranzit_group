import { useState, useCallback, useMemo, useRef, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomModel, } from '@/components/ui/dialog';
import type { AddressFormData } from '../types';
import { FormInput, FormTextarea, FormSelect } from '@/features/orders/components/OrderFormUI';
import { AUSTRALIAN_STATES, STREET_TYPES } from '../constants';
import { useAddressBookDetails } from '../hooks/useAddressBook';
import { AutoComplete } from '@/components/common';

interface CreateAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormData) => void;
  editAddress?: AddressFormData | null;
  isLoading?: boolean;
}

export function CreateAddressDialog({
  open,
  onOpenChange,
  onSubmit,
  editAddress,
  isLoading = false,
}: CreateAddressDialogProps) {
  const { data: detailsData, isLoading: isFetchingDetails } = useAddressBookDetails(editAddress?.id);

  const initialData = useMemo(() => ({
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
    latitude: 0,
    longitude: 0,
  }), []);

  // Determine the final data to pass to the form
  const formDataToLoad = useMemo(() => {
    if (editAddress?.id && detailsData?.data) {
      const addr = detailsData.data;
      return {
        id: addr.id,
        code: addr.code || '',
        contact_person: addr.contact_person || '',
        business_name: addr.business_name || '',
        email: addr.email || '',
        phone: addr.phone || '',
        unit_number: addr.unit_number || '',
        street_number: addr.street_number || '',
        street_name: addr.street_name || '',
        street_type: addr.street_type || '',
        suburb: addr.suburb || '',
        state: addr.state || '',
        postcode: addr.postcode || '',
        additional_details: addr.additional_details || '',
        special_instructions: addr.special_instructions || '',
        address: addr.address || '',
        latitude: Number(addr.latitude) || 0,
        longitude: Number(addr.longitude) || 0,
      };
    }
    return initialData;
  }, [editAddress, detailsData, initialData]);

  // Use a unique key to force remount when the underlying data changes
  const formKey = editAddress?.id ? `edit-${editAddress.id}-${detailsData?.data ? 'loaded' : 'loading'}` : 'new';

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <CustomModel
      title={editAddress?.id ? 'Edit Address' : 'Add New Address'}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={() => formRef.current?.requestSubmit()}
      isLoading={isLoading}
      cancelText="Cancel"
      submitText={editAddress?.id ? 'Save Changes' : 'Create Address'}
      contentClass="sm:max-w-4xl"
    >
      {/* <Dialog open={open} onOpenChange={onOpenChange}> */}
      {/* <DialogContent className="sm:max-w-4xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"> */}
      <AddressForm
        key={formKey}
        ref={formRef}
        initialValues={formDataToLoad}
        isFetching={isFetchingDetails}
        onSubmit={onSubmit}
      />
      {/* </DialogContent> */}
      {/* </Dialog> */}
    </CustomModel>
  );
}

interface AddressFormProps {
  initialValues: AddressFormData;
  isFetching: boolean;
  onSubmit: (data: AddressFormData) => void;

}

const AddressForm = forwardRef<HTMLFormElement, AddressFormProps>(
  ({ initialValues, isFetching, onSubmit }, ref) => {
    const [formData, setFormData] = useState<AddressFormData>(initialValues);
    const [submited, setSubmited] = useState(false);

    const handleChange = useCallback((field: keyof AddressFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmited(true);

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
        return;
      }

      onSubmit(formData);
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
        {/* <DialogHeader className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100 italic!">
          {isEdit ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
      </DialogHeader> */}

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar relative">
          {isFetching && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching Details...</p>
              </div>
            </div>
          )}
          <div className="space-y-6">
            <div className="flex dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950">
              {/* <button type="button" className="px-6 py-2 text-[12px] font-bold text-blue-600 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 uppercase tracking-wider hover:bg-slate-50 transition-colors">
                LOOK UP CONTACT
              </button>
              <button type="button" className="px-6 py-2 text-[12px] font-bold text-white bg-blue-600 uppercase tracking-wider">
                LOOK UP ADDRESS
              </button> */}
              <div className="flex-1 relative flex items-center">
                {/* <Input
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter an address to search"
                  className="w-full h-8 border-0 rounded-none focus-visible:ring-0 bg-transparent px-9 font-medium text-sm"
                /> */}
                <AutoComplete
                  placeholder="Start typing suburb or postcode..."
                  options={[
                    { value: 'SYD-2000', label: 'Sydney, NSW 2000', suburb: 'Sydney', state: 'NSW', postcode: '2000', country: 'Australia' },
                    { value: 'MEL-3000', label: 'Melbourne, VIC 3000', suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia' },
                    { value: 'BNE-4000', label: 'Brisbane, QLD 4000', suburb: 'Brisbane', state: 'QLD', postcode: '4000', country: 'Australia' },
                    { value: 'PER-6000', label: 'Perth, WA 6000', suburb: 'Perth', state: 'WA', postcode: '6000', country: 'Australia' },
                  ]}
                  onSelect={() => {
                    // const opt = locationOptions.find(o => o.value === val);
                    // if (opt) setLocations(prev => ({ ...prev, sender: opt }));
                  }}
                // className="w-full h-8 border-0 rounded-none focus-visible:ring-0  px-9 font-medium text-sm"
                />
              </div>
            </div>

            {submited && formData.address.length < 1 && (
              <p className="text-red-500 text-[11px] mt-1">Required Address</p>
            )}

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
                  errormsg="Required Code"
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
                  errormsg="Required Contact Person"
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
                  errormsg="Required Email"
                  isFullWidth
                />
                <FormInput
                  layout="horizontal"
                  label="Mobile"
                  value={formData.phone || ''}
                  onChange={(val) => handleChange('phone', val)}
                  placeholder="Phone number"
                  isFullWidth
                />
                <FormTextarea
                  layout="horizontal"
                  label="Special Instructions"
                  value={formData.special_instructions || ''}
                  onChange={(val) => handleChange('special_instructions', val)}
                  placeholder="Delivery instructions..."
                  rows={3}
                  isFullWidth
                />
                <FormTextarea
                  layout="horizontal"
                  label="Additional Details"
                  value={formData.additional_details || ''}
                  onChange={(val) => handleChange('additional_details', val)}
                  placeholder="Internal notes..."
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
                  errormsg="Required Street Name"
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
                  errormsg="Required Street Number"
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
                  errormsg="Required Street Type"
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
                  errormsg="Required Suburb"
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
                  errormsg="Required State"
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
                  errormsg="Required Post code"
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

                {/* <div className="pl-[126px] pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-emerald-600 rounded-md text-[11px] font-bold text-emerald-600 uppercase tracking-wider w-fit shadow-sm cursor-default">
                    <CheckCircle2 className="w-4 h-4" />
                    VALID ADDRESS
                    <RefreshCw className="w-3.5 h-3.5 ml-1 cursor-pointer hover:rotate-180 transition-transform duration-500" />
                  </div>
                </div> */}
              </div>
            </div>

            {/* <div className="mt-8 border border-gray-200 dark:border-zinc-800 rounded-md">
              <button type="button" className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-zinc-950 rounded-md hover:bg-slate-50 transition-colors">
                <span className="text-[12px] font-extrabold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">ADDRESS VALIDATION</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div> */}
          </div>
        </div>

        {/* <DialogFooter className="gap-3 p-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6 border-gray-200 dark:border-zinc-800 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 bg-[#0060FE] hover:bg-[#0052db] text-white font-semibold transition-all shadow-md shadow-blue-100 dark:shadow-none active:scale-[0.98]"
        >
          {isLoading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Address')}
        </Button>
      </DialogFooter> */}
      </form>
    );
  }
);
