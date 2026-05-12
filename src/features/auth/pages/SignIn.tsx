"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordInput from "@/components/common/password-input";
import { Link, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useLogin } from "@/features/auth/hooks/useAuth";
import type { LoginRequest } from "@/features/auth/auth.types";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { showToast } from "@/components/ui/custom-toast";

export default function SignIn({ role = "customer" }: { role?: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin(role);
  const [submited, setSubmited] = useState(false);
  const [data, setData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  // const [loading, setLoading] = useState(false);

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

    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response?.status && response.user) {
          const role = response.user.roles[0]?.name;
          dispatch(setCredentials({
            userID: response.user.id,
            token: response.token,
            role: role,
            next_step: response.next_step
          }));
          if (response.next_step === 'onboarding') {
            navigate("/on-board");
            return;
          }
          if (role === 'admin') {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        }
      },
      onError: (error) => {
        showToast("Invalid credentials", 'error')
        console.error('Login error:', error);
      }
    });
  };
  // const languages = [
  //   { value: "next.js", label: "Next.js" },
  //   { value: "sveltekit", label: "SvelteKit" },
  //   { value: "nuxt.js", label: "Nuxt.js" },
  // ];

  return (
    <AuthLayout>
      {/* Logo representation */}
      <div className="flex flex-col items-center text-center space-y-2 max-w-sm m-auto">
        <div className="flex items-center space-x-2 pb-4">
          <img src={brandlogo} alt="Logo" className="h-25" />
        </div>

        <h2 className="my-0 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to Tranzit Group.
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Get started with your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-sm m-auto ">
        <div className="space-y-1">
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
            error={submited && (!data.email)}
            errormsg="Please enter your email address (e.g., name@example.com)"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-slate-600 dark:text-slate-400 font-medium">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
            value={data.password}
            onChange={updateValue}
            error={submited && (!data.password)}
            errormsg="Please enter your password"
          />
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

        <Button type="submit" disabled={loginMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 text-sm rounded-md transition-all shadow-md hover:shadow-lg">
          {loginMutation.isPending && <Spinner data-icon="inline-start" />}
          Login
        </Button>
        {/* {loginMutation.isError && <p className="text-red-500 text-sm text-end">{loginMutation.error?.message}</p>} */}

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          New on our platform?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
