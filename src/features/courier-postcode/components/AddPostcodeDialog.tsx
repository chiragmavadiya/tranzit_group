import { useState, useMemo, useRef, forwardRef, useCallback } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { COURIER_OPTIONS } from '../constants';
import type { CourierPostcode } from '../types';

interface AddPostcodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<CourierPostcode>) => void;
  initialData?: CourierPostcode | null;
  isLoading?: boolean;
}

export function AddPostcodeDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading
}: AddPostcodeDialogProps) {
  const initialValues = useMemo(() => ({
    courierName: '',
    postCode: '',
    price: ''
  }), []);

  const formDataToLoad = useMemo(() => {
    if (initialData) {
      return {
        courierName: initialData.courierName,
        postCode: initialData.postCode,
        price: initialData.price
      };
    }
    return initialValues;
  }, [initialData, initialValues]);

  const formKey = initialData ? `edit-${initialData.id}` : 'new';
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <CustomModel
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Postcode" : "Add Postcode"}
      onSubmit={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      submitText={initialData ? "Update" : "Submit"}
      cancelText="Cencel"
      isLoading={isLoading}
      contentClass="sm:max-w-[400px]"
    >
      <PostcodeForm
        key={formKey}
        ref={formRef}
        initialValues={formDataToLoad}
        onSubmit={onSubmit}
      />
    </CustomModel>
  );
}

interface PostcodeFormProps {
  initialValues: any;
  onSubmit: (data: any) => void;
}

const PostcodeForm = forwardRef<HTMLFormElement, PostcodeFormProps>(
  ({ initialValues, onSubmit }, ref) => {
    const [formData, setFormData] = useState(initialValues);
    const [submited, setSubmited] = useState(false);

    const handleChange = useCallback((field: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmited(true);

      if (!formData.courierName || !formData.postCode || !formData.price) {
        return;
      }

      onSubmit(formData);
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-5 p-1">
        <FormSelect
          label="Courier Name"
          value={formData.courierName}
          onValueChange={(val) => handleChange('courierName', val || '')}
          options={COURIER_OPTIONS}
          placeholder="Select Courier"
          required
          error={submited && !formData.courierName}
          errormsg="Courier Name is required"
        />

        <FormInput
          label="Post Code"
          value={formData.postCode}
          onChange={(val) => handleChange('postCode', val)}
          placeholder="Enter PostCode"
          required
          error={submited && !formData.postCode}
          errormsg="Post Code is required"
        />

        <FormInput
          label="Price"
          value={formData.price}
          onChange={(val) => handleChange('price', val)}
          placeholder="Enter Price"
          required
          error={submited && !formData.price}
          errormsg="Price is required"
        />
      </form>
    );
  }
);
