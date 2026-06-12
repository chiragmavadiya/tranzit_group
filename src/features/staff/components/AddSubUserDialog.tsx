import { useState, useMemo, useRef, forwardRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import PermissionTreeView from '@/components/common/treeview';
import { useStaffFormOptions } from '../hooks/useStaff';

interface AddSubUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
  createLoading: boolean;
}

export function AddSubUserDialog({ open, onOpenChange, onSubmit, initialData, isLoading = false, createLoading }: AddSubUserDialogProps) {
  const initialValues = useMemo(() => ({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    personal_email: '',
    personal_mobile: '',
    role: 'Staff',
    password: '',
    status: '1',
    permissions: []
  }), []);

  const formDataToLoad = useMemo(() => {
    if (initialData) {
      return {
        id: initialData.id,
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        mobile: initialData.office_number || '',
        personal_email: initialData.personal_email || '',
        personal_mobile: initialData.personal_mobile || '',
        role: initialData.role.toLowerCase() || 'staff',
        password: '',
        status: initialData.status_code.toString() || '1',
        permissions: initialData.permissions || []
      };
    }
    return initialValues;
  }, [initialData, initialValues]);

  const formKey = initialData
    ? `edit-${initialData.id}-${initialData.permissions ? 'loaded' : 'loading'}`
    : 'new';
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
      isLoading={createLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <SubUserForm
          key={formKey}
          ref={formRef}
          initialValues={formDataToLoad}
          onSubmit={onSubmit}
        />
      )}
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

    const { data: formOptionsData } = useStaffFormOptions();

    const roleOptions = useMemo(() => {
      // const apiRoles = formOptionsData?.data?.roles;
      // if (Array.isArray(apiRoles)) {
      //   return apiRoles.map((r: string) => ({ label: r, value: r }));
      // }
      return [
        { label: 'It Manager', value: 'It Manager' },
        { label: 'Operation Manager', value: 'Operation Manager' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Super Admin', value: 'Super Admin' },
      ];
    }, []);

    const handleInputChange = useCallback((field: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmited(true);

      const requiredFields = ['first_name', 'last_name', 'email', 'password', 'confirm_password'];
      if (!formData.id) {
        requiredFields.push('password');
      }

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
            value={formData.first_name}
            onChange={(val) => handleInputChange('first_name', val)}
            error={submited && !formData.first_name}
            errormsg="Please enter First Name"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Last Name"
            placeholder="Last Name"
            required
            value={formData.last_name}
            onChange={(val) => handleInputChange('last_name', val)}
            error={submited && !formData.last_name}
            errormsg="Please enter Last Name"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Login Email Address"
            placeholder="john.doe@example.com"
            required
            value={formData.email}
            onChange={(val) => handleInputChange('email', val)}
            error={submited && !formData.email}
            errormsg="Please enter Email Address"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Mobile Number"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={(val) => handleInputChange('mobile', val)}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Personal Email"
            placeholder="personal@example.com"
            value={formData.personal_email}
            onChange={(val) => handleInputChange('personal_email', val)}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Personal Mobile"
            placeholder="Personal Mobile"
            value={formData.personal_mobile}
            onChange={(val) => handleInputChange('personal_mobile', val)}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormSelect
            label="Role"
            value={formData.role}
            onValueChange={(val) => handleInputChange('role', val || 'Staff')}
            options={roleOptions}
            allowClear={false}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <FormSelect
            label="Status"
            value={formData.status}
            onValueChange={(val) => handleInputChange('status', val || '1')}
            options={[
              { label: 'Active', value: '1' },
              { label: 'Inactive', value: '0' },
            ]}
            allowClear={false}

          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Password"
            placeholder={formData.id ? "Leave empty to keep current" : "Password"}
            type="password"
            required={!formData.id}
            value={formData.password}
            onChange={(val) => handleInputChange('password', val)}
            error={submited && !formData.id && !formData.password}
            errormsg="Please enter Password"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormInput
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            required={!formData.id}
            value={formData.confirm_password}
            onChange={(val) => handleInputChange('confirm_password', val)}
            error={submited && (!formData.confirm_password || formData.confirm_password !== formData.password)}
            errormsg={!formData.confirm_password ? "Please enter Password" : "Password does not match"}
          />
        </div>

        <div className="col-span-12 my-4 border-t" />
        <div className="col-span-12">
          <PermissionTreeView
            title="Role Management"
            initialSelected={formData.permissions}
            onChange={(ids) => handleInputChange('permissions', ids)}
            permissionsData={formOptionsData?.data?.modules || []}
          />
        </div>
      </form>
    );
  }
);

