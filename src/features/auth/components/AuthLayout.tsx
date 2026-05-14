import { useEffect, useState, type ReactNode } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

// Module-level variable to track if the animation has played once in the current project session
let hasPlayedAuthAnimation = false;

export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation();
  const [shouldAnimate] = useState(!hasPlayedAuthAnimation);

  useEffect(() => {
    // Mark as played after the first mount
    hasPlayedAuthAnimation = true;
  }, []);
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-zinc-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,#0a2540_0%,#215090_40%,#1e3a5f_100%)] opacity-95" />

        {/* Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-300/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Floating Sparkles */}
        <Sparkles className="absolute top-[15%] left-[10%] w-8 h-8 text-white/20 animate-bounce" style={{ animationDuration: '3s' }} />
        <Sparkles className="absolute bottom-[15%] right-[10%] w-12 h-12 text-white/20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <Sparkles className="absolute top-[60%] right-[15%] w-6 h-6 text-white/20 animate-spin" style={{ animationDuration: '5s' }} />

        {/* Subtle SVG Wave */}
        <div className="absolute bottom-0 left-0 w-full opacity-10">
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Auth Card */}
      <div className={cn(
        "relative z-10 w-full lg:w-[70vw] max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl shadow-2xl transition-all duration-500 ease-in-out",
        shouldAnimate && "animate-in zoom-in-95 duration-700"
      )}>
        {/* Brand Info Section (Integrated) */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-linear-to-br from-primary/10 to-purple-500/10 border-b lg:border-b-0 lg:border-r border-white/20">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Shipping automation that <span className="text-primary italic">just works</span>
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Print labels, compare couriers, and track deliveries - all from one platform. No per-label fees • Bring your own rates*
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-3">
              {[
                "No credit card required",
                "5-star",
                "Local support",
                "Free onboarding",
                "Save up to 50% handling time",
                "See online orders reach customers faster"
              ].map((feature, i) => (
                <li key={i} className="flex items-center space-x-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-3 w-3" strokeWidth={4} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">PRO TIP</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join 5,000+ retailers using Tranzit Group to automate their fulfilment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-7 flex flex-col justify-center p-8 lg:p-16 relative">
          <div className="mx-auto w-full max-w-[400px]">
            <div
              key={location.pathname}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
