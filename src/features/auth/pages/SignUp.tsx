"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordInput from "@/components/common/password-input";
import { Link, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg'
import { useRegister } from "@/features/auth/hooks/useAuth";
import type { RegisterRequest } from "../auth.types";
import { useState, useMemo } from "react";
import { showToast } from "@/components/ui/custom-toast";
import { PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from "@/constants";

export default function SignUp() {
  const navigate = useNavigate();

  const registerMutation = useRegister();

  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<Record<string, string>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });



  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) newErrors.firstName = "Please enter your first name";
    if (!data.lastName.trim()) newErrors.lastName = "Please enter your last name";

    if (!data.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address (e.g., name@example.com)";
    }

    if (!data.password) {
      newErrors.password = "Please enter your password";
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please re-enter your password";
    } else if (data.confirmPassword !== data.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  }, [data]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  console.log(errors)
  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(true);
    if (!isValid) {
      return;
    }

    if (!data?.terms) {
      showToast("Please accept the Privacy Policy and Terms to continue", "error")
      return;
    }

    const payload: RegisterRequest = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      terms: data.terms === 'true',
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        showToast("Account created successfully!", 'success');
        navigate("/verify-email", { state: { email: data.email } });
      },
      onError: (error) => {
        showToast(error.message || "Registration failed", 'error');
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
          Create an account
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Get started with your 30-day trial today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
              First name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First name"
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 focus:border-primary transition-all h-11 shadow-sm"
              value={data.firstName}
              onChange={updateValue}
              error={submitted && (!data.firstName || !!errors.firstName)}
              errormsg={errors.firstName}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
              Last name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last name"
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 focus:border-primary transition-all h-11 shadow-sm"
              value={data.lastName}
              onChange={updateValue}
              error={submitted && (!data.lastName || !!errors.lastName)}
              errormsg={errors.lastName}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
            Email address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 focus:border-primary transition-all h-11 shadow-sm"
            value={data.email}
            onChange={updateValue}
            error={submitted && (!data.email || !!errors.email)}
            errormsg={errors.email}
          />
        </div>

        {/* <div className="space-y-1">
          <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
            Phone number <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <span className="absolute top-[10px] left-3 text-slate-500 font-medium text-sm z-10 pointer-events-none">
              {phonePrefix}
            </span>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0  h-10 shadow-sm pl-10"
              value={data.phone}
              onChange={updateValue}
              error={submitted && (!data.phone || !!errors.phone)}
              errormsg={errors.phone}
            />
          </div>
        </div> */}

        <div className="space-y-1">
          <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
            Password <span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 focus:border-primary transition-all h-11 shadow-sm"
            value={data.password}
            onChange={updateValue}
            error={submitted && (!data.password || !!errors.password)}
            errormsg={errors.password}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
            Confirm your password <span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 focus:border-primary transition-all h-11 shadow-sm"
            value={data.confirmPassword}
            onChange={updateValue}
            error={submitted && (!data.confirmPassword || !!errors.confirmPassword)}
            errormsg={errors.confirmPassword}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              name="terms"
              value="true"
              checked={data.terms === 'true'}
              onCheckedChange={(checked) => setData(prev => ({ ...prev, terms: checked ? 'true' : '' }))}
              className="mt-1 border-slate-300 text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
            >
              I agree to the <a href={PRIVACY_POLICY_URL} target="_blank" className="font-semibold text-primary hover:underline transition-colors">Privacy Policy</a> and <a href={TERMS_CONDITIONS_URL} target="_blank" className="font-semibold text-primary hover:underline transition-colors">Terms</a>
            </Label>
          </div>
          {/* {submitted && errors.terms && <p className="text-red-500 text-[11px] mt-1 mb-0">{errors.terms}</p>} */}
        </div>

        <Button type="submit" disabled={registerMutation.isPending} className="w-full text-white font-bold h-11 text-[13px] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
          {registerMutation.isPending ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-3">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline transition-colors">
            Sign in instead
          </Link>
        </p>
      </form>
    </>
  );
}
