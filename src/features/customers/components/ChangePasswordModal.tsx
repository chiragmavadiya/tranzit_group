import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { showToast } from '@/components/ui/custom-toast';
import { useChangeCustomerPassword } from '../hooks/useCustomers';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string | number | null;
}

export default function ChangePasswordModal({ open, onOpenChange, customerId }: ChangePasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submited, setSubmited] = useState(false);

  const { mutate: changePassword, isPending } = useChangeCustomerPassword();

  const handleSubmit = () => {
    setSubmited(true);

    if (!password) {
      showToast('Password is required', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (customerId) {
      changePassword({
        id: customerId,
        data: {
          new_password: password,
          new_password_confirmation: confirmPassword
        }
      }, {
        onSuccess: (res) => {
          showToast(res?.message || 'Password updated successfully', 'success');
          handleClose();
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to update password', 'error');
        }
      });
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setSubmited(false);
    onOpenChange(false);
  };

  const passwordError = submited && (!password || password.length < 6);
  const confirmPasswordError = submited && (!confirmPassword || password !== confirmPassword);

  return (
    <CustomModel
      title="Change Password"
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          handleClose();
        } else {
          onOpenChange(true);
        }
      }}
      onSubmit={handleSubmit}
      submitText="Update Password"
      contentClass="sm:max-w-[450px]"
      isLoading={isPending}
    >
      <div className="p-4 space-y-4">
        <FormInput
          label="New Password"
          type="password"
          icon={Lock}
          placeholder="Enter new password"
          value={password}
          onChange={(val) => setPassword(val)}
          required
          isFullWidth
          error={passwordError}
          errormsg={!password ? "Password is required" : "Password must be at least 6 characters"}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          icon={ShieldCheck}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(val) => setConfirmPassword(val)}
          required
          isFullWidth
          error={confirmPasswordError}
          errormsg={!confirmPassword ? "Confirm password is required" : "Passwords do not match"}
        />
      </div>
    </CustomModel>
  );
}
