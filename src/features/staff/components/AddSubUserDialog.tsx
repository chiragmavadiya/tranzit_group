import { useState, useMemo, useRef, forwardRef, useCallback } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import PermissionTreeView from '@/components/common/treeview';

interface AddSubUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function AddSubUserDialog({ open, onOpenChange, onSubmit, initialData }: AddSubUserDialogProps) {
  const initialValues = useMemo(() => ({
    firstName: '',
    lastName: '',
    loginEmail: '',
    mobile: '',
    personalEmail: '',
    personalMobile: '',
    role: 'Staff',
    password: '',
    status: 'Active'
  }), []);

  const formDataToLoad = useMemo(() => {
    if (initialData) {
      return {
        ...initialData,
        role: initialData.role || 'Staff',
        status: initialData.status || 'Active'
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
      title={initialData ? "Edit User" : "Add Sub User"}
      onSubmit={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      submitText={initialData ? "Update" : "Submit"}
      contentClass="sm:max-w-[700px]"
    >
      <SubUserForm
        key={formKey}
        ref={formRef}
        initialValues={formDataToLoad}
        onSubmit={onSubmit}
      />
    </CustomModel>
  );
}

interface SubUserFormProps {
  initialValues: any;
  onSubmit: (data: any) => void;
}

const SubUserForm = forwardRef<HTMLFormElement, SubUserFormProps>(
  ({ initialValues, onSubmit }, ref) => {
    const [formData, setFormData] = useState(initialValues);
    const [submited, setSubmited] = useState(false);

    const handleInputChange = useCallback((field: string, value: string) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmited(true);

      const requiredFields = ['firstName', 'lastName', 'loginEmail', 'mobile', 'password'];
      const hasErrors = requiredFields.some(field => !formData[field]);

      if (hasErrors) return;

      onSubmit(formData);
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className="grid grid-cols-12 gap-5 py-4">
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="First Name"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={(val) => handleInputChange('firstName', val)}
            error={submited && !formData.firstName}
            errormsg="First Name is required"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Last Name"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={(val) => handleInputChange('lastName', val)}
            error={submited && !formData.lastName}
            errormsg="Last Name is required"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Login Email Address"
            placeholder="john.doe@example.com"
            required
            value={formData.loginEmail}
            onChange={(val) => handleInputChange('loginEmail', val)}
            error={submited && !formData.loginEmail}
            errormsg="Email is required"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Mobile Number"
            placeholder="Mobile Number"
            required
            value={formData.mobile}
            onChange={(val) => handleInputChange('mobile', val)}
            error={submited && !formData.mobile}
            errormsg="Mobile is required"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Personal Email"
            placeholder="personal@example.com"
            value={formData.personalEmail}
            onChange={(val) => handleInputChange('personalEmail', val)}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Personal Mobile"
            placeholder="Personal Mobile"
            value={formData.personalMobile}
            onChange={(val) => handleInputChange('personalMobile', val)}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormSelect
            label="Role"
            value={formData.role}
            onValueChange={(val) => handleInputChange('role', val || 'Staff')}
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Staff', value: 'Staff' },
              { label: 'Manager', value: 'Manager' },
            ]}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Password"
            placeholder="Password"
            type="password"
            required
            value={formData.password}
            onChange={(val) => handleInputChange('password', val)}
            error={submited && !formData.password}
            errormsg="Password is required"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormSelect
            label="Status"
            value={formData.status}
            onValueChange={(val) => handleInputChange('status', val || 'Active')}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
          />
        </div>

        <div className="col-span-12 my-4 border-t" />
        <div className="col-span-12">
          <PermissionTreeView title="Role Management" />
        </div>
      </form>
    );
  }
);
