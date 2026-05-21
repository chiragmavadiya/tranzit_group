import { type ReactNode } from "react";
import { CheckCircle2, Star, Headphones, Zap, Rocket } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

function CreditCardOff(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 2l20 20" />
      <path d="M5 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" />
      <path d="M23 17V7a2 2 0 0 0-2-2h-7" />
      <path d="M1 10h18" />
    </svg>
  );
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const features = [
    {
      icon: <CheckCircle2 className="h-6 w-6 text-[#f59e0b]" />,
      label: "Onboarding",
      title: "Free onboarding",
    },
    {
      icon: <Zap className="h-6 w-6 text-[#f59e0b] fill-[#f59e0b]/20" />,
      label: "Efficiency",
      title: "Save up to 50% handling time",
    },
    {
      icon: <Star className="h-6 w-6 text-[#f59e0b] fill-[#f59e0b]/20" />,
      label: "Reliability",
      title: "5-star rating",
    },
    {
      icon: <Rocket className="h-6 w-6 text-[#f59e0b] fill-[#f59e0b]/20" />,
      label: "Growth",
      title: "Reach customers faster",
    },
    {
      icon: <Headphones className="h-6 w-6 text-[#f59e0b]" />,
      label: "Assistance",
      title: "Local support",
    },
    {
      icon: <CreditCardOff className="h-6 w-6 text-[#f59e0b]" />,
      label: "Easy Access",
      title: "No credit card required",
    },
  ];

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-10">
      {/* Left Column (Brand/Info) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 text-white overflow-hidden lg:col-span-6">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8D4ZA_EG_GW9ylnj1k_YOXHHWXIiubUR4IEq1cA8mhwXeDkcjVhKoFQr4K_SF_L24bjr-e0lLbVJE5gGKHTjMFNyvJ8ALY5a_n5lhpjE1e_pmz9XMbuX3-E_0ClknJUPaocWsChkDfcrBnU-4y5PRrSxZr9IinVkRmM58SKxX1nCox0efm9264-TBVl7fN1nAkjB9-bS1Sepq6mFwhHPH0h6oaMLuTp9W0DAVomzLin3jyQqY_UrGasgf3HI7E1Ww3QSZOazNMRM")`,
          }}
        />
        {/* Deep blue/navy-tint overlay */}
        <div className="absolute inset-0 bg-[#0a2342]/90 mix-blend-multiply" />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl leading-tight max-w-xl">
              Shipping automation that just works
            </h1>
            {/* Description */}
            <p className="mt-6 text-base text-slate-300 leading-relaxed max-w-xl">
              Print labels, compare couriers, and track deliveries - all from one platform. No per-label fees • Bring your own rates*
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 mt-16 max-w-xl">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                      {feature.label}
                    </span>
                    <span className="text-sm font-bold text-white mt-1">
                      {feature.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="relative mt-12 rounded-lg border-l-4 border-[#f59e0b] bg-white/5 p-6 backdrop-blur-sm max-w-xl border border-white/5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#f59e0b]">
              Pro Tip
            </span>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              Join <strong className="font-bold text-white">5,000+ retailers</strong> using Tranzit Group to automate their fulfilment.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-zinc-950 lg:col-span-4">
        <div className="mx-auto flex w-full flex-col justify-center items-center space-y-8 max-w-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

