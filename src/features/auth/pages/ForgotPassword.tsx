import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useForgotPassword } from "../hooks/useAuth";

export default function ForgotPassword() {

  const { mutate: forgotPassword, isPending, isError, error, isSuccess, data } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    forgotPassword({ email });
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center space-x-2 pb-4">
          <img src={brandlogo} alt="Logo" className="" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Forgot your password?
        </h2>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-4">
            Enter your email and we'll send you instructions to reset your password.
          </p>
          <div className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-slate-600 dark:text-slate-400 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                required
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
              />
            </div>
          </div>
          {isError && (
            <p className="text-center text-sm font-medium text-red-600">
              {error?.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-md rounded-md transition-all shadow-md hover:shadow-lg"
          >
            {isPending ? "Sending..." : "Send reset link"}
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
              {data?.message}
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
