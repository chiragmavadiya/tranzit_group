import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
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
    <>
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="flex items-center space-x-2 pb-2">
          <img src={brandlogo} alt="Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Reset Password
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          We'll send you instructions to reset your password
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ml-1">Email ID</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              required
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 focus:border-primary transition-all h-11"
            />
          </div>
          {isError && (
            <p className="text-center text-sm font-bold text-red-600">
              {error?.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-white font-bold h-11 text-[13px] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>

          <p className="text-center text-[13px] font-medium text-slate-500 dark:text-slate-400">
            <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">
              Back to Sign In
            </Link>
          </p>
        </form>
      ) : (
        <div className="space-y-4 text-center w-full mt-4">
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm font-medium text-green-800 my-0">
              {data?.message}
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
