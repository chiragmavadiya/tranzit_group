import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Column (Brand/Info) */}
      <div className="relative hidden flex-col justify-between bg-[linear-gradient(165deg,#1e3a5f_0%,#2563eb_50%,#0ea5e9_100%)] p-10 text-white lg:flex lg:p-16">
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

        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-md shadow-lg shadow-black/10">
          <span className="text-sm font-medium text-indigo-50">
            Join retailers using Tranzit Group to save time on every order.
          </span>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
