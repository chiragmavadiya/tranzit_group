import { useState, useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AddressFormData } from '../types';
import { FormInput, FormTextarea, FormSelect, Required } from '@/features/orders/components/OrderFormUI';
import { AUSTRALIAN_STATES, STREET_TYPES } from '../constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const initialData = useMemo(() => ({
    code: editAddress?.code || '',
    contact_person: editAddress?.contact_person || '',
    business_name: editAddress?.business_name || '',
    email: editAddress?.email || '',
    phone: editAddress?.phone || '',
    unit_number: editAddress?.unit_number || '',
    street_number: editAddress?.street_number || '',
    street_name: editAddress?.street_name || '',
    street_type: editAddress?.street_type || '',
    suburb: editAddress?.suburb || '',
    state: editAddress?.state || '',
    postcode: editAddress?.postcode || '',
    additional_details: editAddress?.additional_details || '',
    special_instructions: editAddress?.special_instructions || '',
    address: editAddress?.address || '',
    latitude: editAddress?.latitude || 0,
    longitude: editAddress?.longitude || 0,
  }), [editAddress]);

  const [formData, setFormData] = useState<AddressFormData>(initialData);
  const [submited, setSubmited] = useState(false);

  const handleChange = useCallback((field: keyof AddressFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);

    // Basic validation for required fields
    if (
      formData.code.length === 0 ||
      formData.contact_person.length === 0 ||
      formData.business_name.length === 0 ||
      formData.email.length === 0 ||
      formData.address.length === 0 ||
      formData.street_number.length === 0 ||
      formData.street_name.length === 0 ||
      formData.street_type.length === 0 ||
      formData.suburb.length === 0 ||
      formData.state.length === 0 ||
      formData.postcode.length === 0 ||
      !formData.phone ||
      formData.phone.length === 0
    ) {
      return;
    }

    // Call onSubmit with data
    onSubmit(formData);
    onOpenChange(false);
  }, [formData, onSubmit, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100 italic!">
              {editAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
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
                  {/* Search bar mock-up */}
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
                      // required
                      error={submited && formData.address.length < 1}
                      errormsg="Required Address"
                    />
                  </div>

                  {/* Address Grid */}
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

          <DialogFooter className="gap-3 p-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 border-gray-200 dark:border-zinc-800 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 bg-[#0060FE] hover:bg-[#0052db] text-white font-semibold transition-all shadow-md shadow-blue-100 dark:shadow-none active:scale-[0.98]"
            >
              {isLoading ? (editAddress ? 'Saving...' : 'Creating...') : (editAddress ? 'Save Changes' : 'Create Address')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
