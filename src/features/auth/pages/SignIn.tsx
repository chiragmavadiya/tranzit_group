import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/common/password-input";
import { Link, Navigate, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useLogin } from "@/features/auth/hooks/useAuth";
import type { LoginRequest } from "@/features/auth/auth.types";
import { Spinner } from "@/components/ui/spinner";
// import { useAppDispatch } from "@/hooks/store.hooks";
// import { setCredentials } from "@/features/auth/authSlice";
import { useState } from "react";

export default function SignIn() {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const loginMutation = useLogin();
  const [submited, setSubmited] = useState(false);
  const [data, setData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const userAuthString = localStorage.getItem('userAuth');
  if (userAuthString) {
    try {
      const userAuth = JSON.parse(userAuthString);
      if (userAuth?.isAuthenticated) {
        return <Navigate to="/orders" replace />;
      }
    } catch {
      // ignore
    }
  }

  console.log(loginMutation.isPending, 'is pending...')
  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmited(true);
    if (!data.email || !data.password) {
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    localStorage.setItem('userAuth', JSON.stringify({ isAuthenticated: true }))
    navigate("/orders");


    // loginMutation.mutate(data, {
    //   onSuccess: (response) => {
    //     console.log(response, 'response')
    //     if (response.status) {
    //       // Sync with Redux store
    //       dispatch(setCredentials({ user: response.data, token: response.data.accessToken }));
    //       // Redirect to home/dashboard
    //     }
    //   }
    // });
  };

  return (
    <AuthLayout>
      {/* Logo representation */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center space-x-2 pb-4">
          <img src={brandlogo} alt="Logo" className="" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to Tranzit Group.
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Get started with your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-600 dark:text-slate-400 font-medium">Email ID</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
              value={data.email}
              onChange={updateValue}
            />
            {submited && !data.email && <p className="text-red-500 text-sm text-end">Email is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-600 dark:text-slate-400 font-medium">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
              value={data.password}
              onChange={updateValue}
            />
            {submited && !data.password && <p className="text-red-500 text-sm text-end">Password is required</p>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" name="remember" value="true" className="border-slate-300 text-blue-600 focus-visible:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
            >
              Remember Me
            </Label>
          </div>
          <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-md rounded-md transition-all shadow-md hover:shadow-lg">
          {loading && <Spinner data-icon="inline-start" />}
          Login
        </Button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          New on our platform?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
