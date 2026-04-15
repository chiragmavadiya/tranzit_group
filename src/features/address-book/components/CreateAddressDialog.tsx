import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AddressFormData } from '../types';
import { FormInput } from '@/features/orders/components/OrderFormUI';

interface CreateAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormData) => void;
  editAddress?: AddressFormData | null;
}

export function CreateAddressDialog({
  open,
  onOpenChange,
  onSubmit,
  editAddress,
}: CreateAddressDialogProps) {
  const [formData, setFormData] = useState<AddressFormData>(() => {
    if (editAddress) {
      return {
        code: editAddress.code,
        contact_person: editAddress.contact_person,
        business_name: editAddress.business_name,
        email_id: editAddress.email_id,
        mobile: editAddress.mobile,
        address: editAddress.address,
      };
    }
    return {
      code: '',
      contact_person: '',
      business_name: '',
      email_id: '',
      mobile: '',
      address: '',
    };
  });
  const [submited, setSubmited] = useState(false);

  const handleChange = useCallback((field: keyof AddressFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);
    if (
      formData.code.length === 0 ||
      formData.contact_person.length === 0 ||
      formData.business_name.length === 0 ||
      formData.email_id.length === 0 ||
      formData.mobile.length === 0 ||
      formData.address.length === 0
    ) {
      return;
    }
    onSubmit(formData);
    onOpenChange(false);
  }, [formData, onSubmit, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100 italic!">
              {editAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-6 overflow-auto max-h-[calc(100vh-200px)]">
            <div className="grid gap-2">
              <FormInput
                label="Code"
                value={formData.code}
                onChange={(val) => handleChange('code', val)}
                placeholder="Enter address code"
                required
                error={submited && formData.code.length < 1}
                errormsg="Code is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                label="Contact Person"
                value={formData.contact_person}
                onChange={(val) => handleChange('contact_person', val)}
                placeholder="Enter contact person name"
                required
                error={submited && formData.contact_person.length < 1}
                errormsg="Contact person is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                label="Business Name"
                value={formData.business_name}
                onChange={(val) => handleChange('business_name', val)}
                placeholder="Enter business name"
                required
                error={submited && formData.business_name.length < 1}
                errormsg="Business name is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                label="Email ID"
                value={formData.email_id}
                onChange={(val) => handleChange('email_id', val)}
                placeholder="Enter email ID"
                required
                error={submited && formData.email_id.length < 1}
                errormsg="Email ID is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                label="Mobile"
                value={formData.mobile}
                onChange={(val) => handleChange('mobile', val)}
                placeholder="Enter mobile number"
                required
                error={submited && formData.mobile.length < 1}
                errormsg="Mobile number is required"
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                label="Address"
                value={formData.address}
                onChange={(val) => handleChange('address', val)}
                placeholder="Enter full address"
                required
                error={submited && formData.address.length < 1}
                errormsg="Address is required"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 border-gray-200 dark:border-zinc-800 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 bg-[#0060FE] hover:bg-[#0052db] text-white font-semibold transition-all shadow-md shadow-blue-100 dark:shadow-none"
            >
              {editAddress ? 'Save Changes' : 'Create Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
