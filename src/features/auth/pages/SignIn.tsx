"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/common";
import { Link, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useLogin } from "@/features/auth/hooks/useAuth";
import type { LoginRequest } from "@/features/auth/auth.types";
// import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { useState } from "react";
import AutoComplete from "@/components/common/AutoComplate";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();
  const [submited, setSubmited] = useState(false);
  const [data, setData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

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
    const fakeUser = {
      "id": 1,
      "username": "emilys",
      "email": "emily.johnson@x.dummyjson.com",
      "firstName": "Emily",
      "lastName": "Johnson",
      "gender": "female",
      "image": "https://dummyjson.com/icon/emilys/128",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    localStorage.setItem('auth_token', JSON.stringify(fakeUser))
    dispatch(setCredentials({ user: fakeUser, token: fakeUser.accessToken, role: 'admin' }));
    navigate("/orders");

    // loginMutation.mutate(data, {
    //   onSuccess: (response) => {
    //     console.log(typeof response, 'response')
    //     if (response?.status) {
    //       console.log(response.status, "::::STATUS")
    //       navigate("/orders");
    //       // Sync with Redux store
    //       if (response.data) {
    //       }
    //       // Redirect to home/dashboard
    //     }
    //   },
    //   onError: (error) => {
    //     console.error('Login error:', error);
    //   }
    // });
  };
  // const languages = [
  //   { value: "next.js", label: "Next.js" },
  //   { value: "sveltekit", label: "SvelteKit" },
  //   { value: "nuxt.js", label: "Nuxt.js" },
  // ];

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

      <AutoComplete
        options={[
          { value: "next.js", label: "Next.js" },
          { value: "sveltekit", label: "SvelteKit" },
          { value: "nuxt.js", label: "Nuxt.js" },
          { value: "remix", label: "Remix" },
          { value: "astro", label: "Astro" },
        ]}
        placeholder="Search frameworks..."
        className="mb-8"
      />

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
              error={submited && (!data.email)}
              errormsg="Email is required"
            />
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
              error={submited && (!data.password)}
              errormsg="Password is required"
            />
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

        <Button type="submit" disabled={loginMutation.isPending || loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-md rounded-md transition-all shadow-md hover:shadow-lg">
          {/* {loginMutation.isPending && <Spinner data-icon="inline-start" />} */}
          {loginMutation.isPending || loading ? "Login..." : "Login"}
        </Button>
        {/* invalid credential message */}
        {loginMutation.isError && <p className="text-red-500 text-sm text-end">{loginMutation.error?.message}</p>}

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
