import { useState, useCallback, useMemo, useRef, forwardRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { CustomModel, } from '@/components/ui/dialog';
import type { AddressFormData } from '../types';
import { FormInput, FormTextarea, FormSelect, Required } from '@/features/orders/components/OrderFormUI';
import { AUSTRALIAN_STATES, STREET_TYPES } from '../constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddressBookDetails } from '../hooks/useAddressBook';

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
          <div className="space-y-8">
            {/* Basic Information Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Basic Information</h3>
              </div>
              <div className='space-y-4'>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormInput
                      label="Code"
                      value={formData.code}
                      onChange={(val) => handleChange('code', val)}
                      placeholder="Enter code"
                      required
                      error={submited && formData.code.length < 1}
                      errormsg="Required Code"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Contact Person"
                      value={formData.contact_person}
                      onChange={(val) => handleChange('contact_person', val)}
                      placeholder="Full name"
                      required
                      error={submited && formData.contact_person.length < 1}
                      errormsg="Required Contact Person"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Business Name"
                      value={formData.business_name}
                      onChange={(val) => handleChange('business_name', val)}
                      placeholder="Company name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormInput
                      label="Email ID"
                      value={formData.email}
                      onChange={(val) => handleChange('email', val)}
                      placeholder="example@mail.com"
                      required
                      error={submited && formData.email.length < 1}
                      errormsg="Required Email"
                    />
                  </div>
                  <div className="col-span-6">
                    <FormInput
                      label="Mobile"
                      value={formData.phone || ''}
                      onChange={(val) => handleChange('phone', val)}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Address Information Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Address Information</h3>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <Label className="text-[11px] ml-0.5 font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider gap-0 mb-1">
                    Address
                    <Required />
                  </Label>
                  <Search className="absolute left-2.5 top-9 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Search for an address..."
                    className="pl-8 h-8 rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus-visible:ring-0 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-700 text-sm"
                    error={submited && formData.address.length < 1}
                  />
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormInput
                      label="Unit Number"
                      value={formData.unit_number || ''}
                      onChange={(val) => handleChange('unit_number', val)}
                      placeholder="e.g. 1A"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Street Name"
                      value={formData.street_name || ''}
                      onChange={(val) => handleChange('street_name', val)}
                      placeholder="e.g. George"
                      required
                      error={submited && formData.street_name.length < 1}
                      errormsg="Required Street Name"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Street Number"
                      value={formData.street_number || ''}
                      onChange={(val) => handleChange('street_number', val)}
                      placeholder="e.g. 123"
                      required
                      error={submited && formData.street_number.length < 1}
                      errormsg="Required Street Number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormSelect
                      label="Street Type"
                      value={formData.street_type || ''}
                      onValueChange={(val) => handleChange('street_type', val)}
                      options={STREET_TYPES}
                      placeholder="Select type"
                      required
                      error={submited && formData.street_type.length < 1}
                      errormsg="Required Street Type"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Suburb"
                      value={formData.suburb || ''}
                      onChange={(val) => handleChange('suburb', val)}
                      placeholder="e.g. Sydney"
                      required
                      error={submited && formData.suburb.length < 1}
                      errormsg="Required Suburb"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormSelect
                      label="State"
                      value={formData.state || ''}
                      onValueChange={(val) => handleChange('state', val)}
                      options={AUSTRALIAN_STATES}
                      placeholder="Select state"
                      required
                      error={submited && formData.state.length < 1}
                      errormsg="Required State"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Post Code"
                      value={formData.postcode || ''}
                      onChange={(val) => handleChange('postcode', val)}
                      placeholder="e.g. 2000"
                      required
                      error={submited && formData.postcode.length < 1}
                      errormsg="Required Post code"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Latitude"
                      value={formData.latitude || ''}
                      onChange={(val) => handleChange('latitude', val)}
                      placeholder="e.g. 2000"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormInput
                      label="Longitude"
                      value={formData.longitude || ''}
                      onChange={(val) => handleChange('longitude', val)}
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Information Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Additional Details</h3>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormTextarea
                    label="Special Instructions"
                    value={formData.special_instructions || ''}
                    onChange={(val) => handleChange('special_instructions', val)}
                    placeholder="Delivery instructions..."
                    rows={3}
                    isFullWidth
                  />
                </div>
                <div className="col-span-6">
                  <FormTextarea
                    label="Additional Details"
                    value={formData.additional_details || ''}
                    onChange={(val) => handleChange('additional_details', val)}
                    placeholder="Internal notes..."
                    rows={3}
                    isFullWidth
                  />
                </div>
              </div>
            </section>
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
