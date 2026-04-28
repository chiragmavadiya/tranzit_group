import { useState, useMemo, useRef, forwardRef, useCallback } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { COURIER_OPTIONS } from '../constants';
import type { CourierPostcode, CourierPostcodeFormData } from '../types';

interface AddPostcodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourierPostcodeFormData) => void;

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
    global_courier_id: '',
    single_post_code: '',
    price: ''
  }), []);

  const formDataToLoad = useMemo(() => {
    if (initialData) {
      return {
        global_courier_id: initialData.global_courier_id?.toString(),
        single_post_code: initialData.single_post_code,
        price: initialData.price?.toString()
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
      cancelText="Cancel"
      isLoading={isLoading}
      contentClass="sm:max-w-[400px]"
    >
      <PostcodeForm
        key={formKey}
        ref={formRef}
        initialValues={formDataToLoad}
        onSubmit={(data) => {
          onSubmit({
            global_courier_id: Number(data.global_courier_id),
            single_post_code: Number(data.single_post_code),
            price: Number(data.price)
          });
        }}
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

      if (!formData.global_courier_id || !formData.single_post_code || !formData.price) {
        return;
      }

      onSubmit(formData);
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-5 p-1">
        <FormSelect
          label="Courier Name"
          value={formData.global_courier_id}
          onValueChange={(val) => handleChange('global_courier_id', val || '')}
          options={COURIER_OPTIONS}
          placeholder="Select Courier"
          required
          error={submited && !formData.global_courier_id}
          errormsg="Courier is required"
        />

        <FormInput
          label="Post Code"
          value={formData.single_post_code}
          onChange={(val) => handleChange('single_post_code', val)}
          placeholder="Enter PostCode"
          required
          error={submited && !formData.single_post_code}
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

