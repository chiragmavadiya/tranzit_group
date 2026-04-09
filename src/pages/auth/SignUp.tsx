import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "react-router-dom";
import brandlogo from '../../assets/Tranzit_Logo.svg'

export default function SignUp() {
  const phonePrefix = "+61";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Sign up failed");
      } else {
        console.log("Sign up successful");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Column (Brand/Info) */}
      <div className="relative flex-col justify-between bg-[linear-gradient(165deg,_#1e3a5f_0%,_#2563eb_50%,_#0ea5e9_100%)] p-10 text-white lg:flex lg:p-16">
        <div className="flex-1">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl drop-shadow-sm">
            Shipping automation that just works
          </h1>
          <p className="mb-8 text-lg text-indigo-100 max-w-lg">
            Print labels, compare couriers, automate fulfilment and track deliveries - all from one platform. No per-label fees • Bring your own rates*
          </p>

          <div className="space-y-6">
            <ul className="space-y-3">
              {[
                "No credit card required",
                "5-star support",
                "Free onboarding",
                "Local Support",
              ].map((feature, i) => (
                <li key={i} className="flex items-center space-x-3 text-sm font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 shadow-sm">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <ul className="space-y-3 pt-2">
              {[
                "Save 6-10 hours per week on packing and logistics",
                "See online orders reach customers faster",
                "Save up to 50% on handling time",
              ].map((feature, i) => (
                <li key={i} className="flex items-center space-x-3 text-sm font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 shadow-sm">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-md shadow-lg shadow-black/10">
          <p className="text-sm font-medium text-indigo-50">
            Join retailers using Tranzit Group to save time on every order.
          </p>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-slate-50 dark:bg-zinc-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 max-w-[420px]">
          {/* Logo representation */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center space-x-2 pb-2">
              {/* Fake Tranzit Group Logo */}
              <div className="flex italic text-3xl font-extrabold tracking-tight drop-shadow-sm">
                <img src={brandlogo} alt="Logo" className="h-25" />
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign up to Tranzit Group.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 pt-1">
              Get started with your 30-day trial. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* <div className="grid grid-cols-2 gap-3 sm:gap-4"> */}
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                  First name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10 shadow-sm"
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
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10 shadow-sm"
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
                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10 shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                Phone number <span className="text-red-500">*</span>
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-500 font-medium text-sm z-10 pointer-events-none">
                  {phonePrefix}
                </span>
                <input type="hidden" name="phonePrefix" value={phonePrefix} />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10 shadow-sm pl-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10 shadow-sm"
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
                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10 shadow-sm"
              />
            </div>

            <div className="flex items-start space-x-3 pt-3">
              <Checkbox id="terms" name="terms" value="true" className="mt-1 border-slate-300 text-blue-600 focus-visible:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
              >
                I agree to the <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">Privacy Policy</a> and <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">Terms</a>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide py-6 text-md rounded-md transition-all shadow-md hover:shadow-lg mt-6">
              Continue
            </Button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-3">
              Already have an account?{" "}
              <Link to="/signin" className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Sign in instead
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
