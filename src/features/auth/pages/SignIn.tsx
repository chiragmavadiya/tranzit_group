"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordInput from "@/components/common/password-input";
import { Link, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
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
            navigate("/admin/orders");
          } else {
            navigate("/orders");
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
    <>
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="flex items-center space-x-2 pb-2">
          <img src={brandlogo} alt="Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Sign in to Tranzit Group
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ml-1">Email ID</Label>
          <Input
            id="email"
            name="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus:border-primary transition-all h-11"
            value={data.email}
            onChange={updateValue}
            error={submited && (!data.email)}
            errormsg="Please enter your email address"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ml-1">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus:border-primary transition-all h-11"
            value={data.password}
            onChange={updateValue}
            error={submited && (!data.password)}
            errormsg="Please enter your password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" name="remember" className="h-4 w-4 rounded-sm border-slate-300 text-primary data-[state=checked]:bg-primary" />
            <Label
              htmlFor="remember"
              className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Remember Me
            </Label>
          </div>
          <Link to="/forgot-password" id="forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" disabled={loginMutation.isPending} className="w-full text-white font-bold h-11 text-[13px] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
          {loginMutation.isPending && <Spinner data-icon="inline-start" />}
          Login
        </Button>

        <div className="pt-2">
          <p className="text-center text-[13px] font-medium text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline underline-offset-4">
              Get Started
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
