import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "react-router-dom";

export default function SignIn() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Sign in failed");
      } else {
        console.log("Sign in successful");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Column (Brand/Info) */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-white lg:flex lg:p-16">
        <div className="flex-1">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Shipping automation that just works
          </h1>
          <p className="mb-8 text-lg text-blue-100 max-w-lg">
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
                  <Check className="h-5 w-5 text-white" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <ul className="space-y-3">
              {[
                "Save 6-10 hours per week on packing and logistics",
                "See online orders reach customers faster",
                "Save up to 50% on handling time",
              ].map((feature, i) => (
                <li key={i} className="flex items-center space-x-3 text-sm font-medium">
                  <Check className="h-5 w-5 text-white" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-sm font-medium text-blue-200">
            Join retailers using Tranzit Group to save time on every order.
          </p>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 max-w-sm">
          {/* Logo representation */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center space-x-2 pb-4">
              {/* Fake Tranzit Group Logo */}
              <div className="flex italic text-3xl font-extrabold tracking-tight drop-shadow-sm">
                <span className="text-slate-800 dark:text-slate-100">Trans</span>
                <span className="text-amber-500">zit</span>
                <span className="text-slate-500 ml-1 text-base uppercase self-end mb-1">Group</span>
              </div>
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
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-md rounded-md transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
              Login
            </Button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              New on our platform?{" "}
              <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
