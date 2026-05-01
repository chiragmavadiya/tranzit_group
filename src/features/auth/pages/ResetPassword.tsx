import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/common";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { AuthLayout } from "@/features/auth/components/AuthLayout";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!isPasswordValid) {
      setError("Please ensure your password .");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link. Token or email is missing.");
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
          toast.success("Password reset successfully");
        } else {
          setError(response.message || "Failed to reset password");
          toast.error(response.message || "Failed to reset password");
        }
      },
      onError: (err: any) => {
        const errMsg = err.message || "An error occurred while resetting your password";
        setError(errMsg);
        toast.error(errMsg);
      }
    });
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center space-x-2 pb-4">
          <img src={brandlogo} alt="Logo" className="" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Set a new password.
        </h2>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-4">
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
                className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
              />
            </div>

            {/* Password Validation Rules */}
            <div className="space-y-2 py-3 px-1 text-left">
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

            <div className="space-y-2 text-left">
              <Label htmlFor="confirmPassword" className="text-slate-600 dark:text-slate-400 font-medium">Confirm password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                required
                className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500 text-center">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-md rounded-md transition-all shadow-md hover:shadow-lg"
          >
            {isPending ? "Setting password..." : "Set new password"}
          </Button>

          <p className="text-center text-sm font-medium">
            <Link to="/signin" className="text-blue-600 hover:text-blue-500 hover:underline transition-colors">
              Back to sign in
            </Link>
          </p>
        </form>
      ) : (
        <div className="space-y-6 text-center w-full">
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm font-medium text-green-800">
              Password updated successfully.
            </p>
          </div>
          <p className="text-center text-sm font-medium">
            <Link to="/signin" className="text-blue-600 hover:text-blue-500 hover:underline transition-colors">
              Back to sign in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
