import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/common/password-input";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/features/auth/hooks/useAuth";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { showToast } from "@/components/ui/custom-toast";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [isSuccess, setIsSuccess] = useState(false);

  const validations = [
    { text: "At least 8 characters", isValid: password.length >= 8 },
    { text: "One uppercase letter", isValid: /[A-Z]/.test(password) },
    { text: "One lowercase letter", isValid: /[a-z]/.test(password) },
    { text: "One number", isValid: /[0-9]/.test(password) },
    { text: "One special character ($, #, or @)", isValid: /[$#@]/.test(password) },
  ];

  const isPasswordValid = password.length > 0 ? validations.every(v => v.isValid) : false;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!isPasswordValid) {
      showToast("Please ensure your password is valid", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (!token || !email) {
      showToast("Invalid reset link. Token or email is missing.", "error");
      return;
    }

    resetPassword({
      email,
      token,
      password,
      password_confirmation: confirmPassword
    }, {
      onSuccess: (response) => {
        if (response.status) {
          setIsSuccess(true);
          showToast("Password reset successfully", "success");
        } else {
          showToast(response.message || "Failed to reset password", "error");
        }
      },
      onError: (err: any) => {
        const errMsg = err.message || "An error occurred while resetting your password";
        showToast(errMsg, "error");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="flex items-center space-x-2 pb-2">
          <img src={brandlogo} alt="Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Set a new password
        </h2>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm m-auto">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center px-4">
            Your new password must be different from previously used passwords.
          </p>

          <div className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-slate-600 dark:text-slate-400 font-medium">New password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 h-11 rounded-xl"
              />
              <div className="space-y-2 pt-2 px-1 text-left">
                {validations.map((v, i) => (
                  <div
                    key={i}
                    className={`flex items-center space-x-3 text-[13px] transition-all duration-300 ${v.isValid
                      ? 'text-emerald-500 font-medium'
                      : 'text-slate-500 dark:text-slate-400'
                      }`}
                  >
                    <div className={`flex items-center justify-center w-4 h-4 rounded-full ${v.isValid ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' : ''
                      }`}>
                      {v.isValid ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      )}
                    </div>
                    <span>{v.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="confirmPassword" className="text-slate-600 dark:text-slate-400 font-medium">Confirm password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                required
                className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 h-11 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-white font-bold h-11 text-[13px] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            {isPending ? "Setting password..." : "Set new password"}
          </Button>

          <p className="text-center text-[13px] font-medium">
            <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </form>
      ) : (
        <div className="space-y-6 text-center w-full max-w-sm m-auto">
          <div className="rounded-xl bg-green-50 p-4 border border-green-200">
            <p className="text-sm font-medium text-green-800">
              Password updated successfully.
            </p>
          </div>
          <p className="text-center text-sm font-medium">
            <Link to="/login" className="text-primary hover:underline transition-colors">
              Back to sign in
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
