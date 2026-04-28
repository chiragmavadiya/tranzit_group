import { useState, useRef } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { Lock } from 'lucide-react';
import type { ChangePasswordData } from '../types';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ChangePasswordData) => void;
}

export function ChangePasswordDialog({ open, onOpenChange, onSubmit }: ChangePasswordDialogProps) {
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (field: keyof ChangePasswordData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) return;
    if (formData.newPassword !== formData.confirmPassword) return;

    onSubmit(formData);
    onOpenChange(false);
  };

  const passwordMismatch = submitted && formData.newPassword !== formData.confirmPassword;

  return (
    <CustomModel
      open={open}
      onOpenChange={onOpenChange}
      title="Change Password"
      onSubmit={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      submitText="Save"
      contentClass="sm:max-w-[450px]"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 py-4">
        <FormInput
          id="password"
          name="password"
          label="Current Password"
          placeholder="••••••••"
          type="password"
          value={formData.currentPassword}
          onChange={(val) => handleInputChange('currentPassword', val)}
          required
          icon={Lock}
          error={submitted && !formData.currentPassword}
          errormsg="Current password is required"
        />

        <FormInput
          label="New Password"
          placeholder="••••••••"
          type={"password"}
          value={formData.newPassword}
          onChange={(val) => handleInputChange('newPassword', val)}
          required
          icon={Lock}
          error={submitted && !formData.newPassword}
          errormsg="New password is required"
        />

        <FormInput
          label="Confirm New Password"
          placeholder="••••••••"
          type={"password"}
          value={formData.confirmPassword}
          onChange={(val) => handleInputChange('confirmPassword', val)}
          required
          icon={Lock}
          error={submitted && (!formData.confirmPassword || passwordMismatch)}
          errormsg={passwordMismatch ? "Passwords do not match" : "Confirmation is required"}
        />
      </form>
    </CustomModel>
  );
}
