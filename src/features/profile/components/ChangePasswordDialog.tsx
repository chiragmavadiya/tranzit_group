import { useState, useRef } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { Lock, Eye, EyeOff } from 'lucide-react';
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
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
          label="Current Password"
          placeholder="••••••••"
          type={showCurrent ? "text" : "password"}
          value={formData.currentPassword}
          onChange={(val) => handleInputChange('currentPassword', val)}
          required
          icon={Lock}
          error={submitted && !formData.currentPassword}
          errormsg="Current password is required"
          rightElement={
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-slate-400 hover:text-slate-600 transition-colors px-2 h-full flex items-center"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <FormInput
          label="New Password"
          placeholder="••••••••"
          type={showNew ? "text" : "password"}
          value={formData.newPassword}
          onChange={(val) => handleInputChange('newPassword', val)}
          required
          icon={Lock}
          error={submitted && !formData.newPassword}
          errormsg="New password is required"
          rightElement={
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-slate-400 hover:text-slate-600 transition-colors px-2 h-full flex items-center"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <FormInput
          label="Confirm New Password"
          placeholder="••••••••"
          type={showConfirm ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={(val) => handleInputChange('confirmPassword', val)}
          required
          icon={Lock}
          error={submitted && (!formData.confirmPassword || passwordMismatch)}
          errormsg={passwordMismatch ? "Passwords do not match" : "Confirmation is required"}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-slate-400 hover:text-slate-600 transition-colors px-2 h-full flex items-center"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
      </form>
    </CustomModel>
  );
}
