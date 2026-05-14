import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type LucideIcon, MoveRight, Box, Sparkles } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

interface WelcomeBannerProps {
  userName: string;
  description: string;
  buttons?: { label: string; onClick?: () => void; variant?: "default" | "outline" }[];
  imageSrc?: string;
  className?: string;
  variant?: "blue" | "purple" | "primary";
  stats?: Stat[];
}

export function WelcomeBanner({ userName, description, buttons, imageSrc, className, variant = "blue", stats }: WelcomeBannerProps) {
  const bgColors = (variant === "blue" || variant === "primary")
    ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-cyan-900/5 border-blue-100/50 dark:border-blue-900/20"
    : "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/10 dark:via-pink-900/5 dark:to-rose-900/5 border-purple-100/50 dark:border-purple-900/20";

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border p-6 shadow-xl", bgColors, className)}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-4 w-20 h-20 bg-blue-200/30 dark:bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-16 w-12 h-12 bg-indigo-200/40 dark:bg-indigo-500/15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-1/4 w-16 h-16 bg-cyan-200/30 dark:bg-cyan-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 right-8 w-8 h-8 bg-purple-200/40 dark:bg-purple-500/15 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <Sparkles className="absolute top-6 right-6 w-6 h-6 text-yellow-400/50 animate-spin" style={{ animationDuration: '3s' }} />
        <Sparkles className="absolute bottom-2 left-2 w-4 h-4 text-pink-400/50 animate-spin" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        {/* Additional Creative Elements */}
        <div className="absolute top-10 left-125 w-4 h-4 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        {/* <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div> */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 Q100,50 200,100 T400,100 V200 H0 Z" fill="currentColor" className="text-blue-300 dark:text-blue-700 animate-pulse" style={{ animationDuration: '5s' }} />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2 animate-in slide-in-from-left-4 duration-1000">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-zinc-100 dark:to-zinc-200 bg-clip-text text-transparent tracking-tight leading-tight drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
              {userName.split(',')[0]}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 animate-in slide-in-from-left-4 duration-1000 delay-200">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider animate-pulse">Welcome Back</span>
              <div className="animate-bounce hover:animate-spin transition-all duration-300">🚀</div>
            </div>
          </div>
          <p className="max-w-[550px] text-[15px] mb-3 md:text-[16px] leading-relaxed font-medium text-slate-600 dark:text-zinc-300 italic animate-in fade-in slide-in-from-bottom-4 duration-500">
            {description}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            {buttons && buttons.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 animate-in slide-in-from-bottom-4 duration-1000 delay-700">
                {buttons.map((btn, idx) => (
                  <Button
                    key={idx}
                    variant={btn.variant || "default"}
                    onClick={btn.onClick}
                    className={cn(
                      "h-10 px-6 text-[13px] font-bold transition-all active:scale-95 hover:scale-105 hover:shadow-lg group animate-in fade-in slide-in-from-bottom-4 duration-500",
                      btn.variant === "default"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-200 dark:shadow-none relative overflow-hidden"
                        : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:shadow-md relative overflow-hidden"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {btn.label}
                      {btn.variant === "default" && <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </span>
                    {btn.variant === "default" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center md:items-end gap-6">
          {imageSrc ? (
            <div className="shrink-0 animate-in fade-in slide-in-from-right-8 duration-1000">
              <img src={imageSrc} alt="Dashboard Illustration" className="w-[180px] md:w-[220px] drop-shadow-2xl" />
            </div>
          ) : (
            <div className="shrink-0 relative animate-in zoom-in duration-1000 delay-300">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-indigo-100 to-cyan-100 dark:from-blue-800/50 dark:via-indigo-800/50 dark:to-cyan-800/50 border border-slate-200/50 dark:border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-inner group hover:shadow-lg transition-all duration-300 hover:rotate-3 hover:scale-105">
                <Box className={cn(
                  "w-12 h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                  variant === "blue" || variant === "primary" ? "text-blue-500/60" : "text-purple-500/60"
                )} />
              </div>
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-end gap-3 animate-in slide-in-from-right-4 duration-1000 delay-500">
              {stats.map((stat, idx) => (
                <div key={idx} className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform", stat.color || "bg-primary text-white")}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider line-clamp-1">{stat.label}</span>
                    <span className="text-[14px] font-black text-slate-800 dark:text-zinc-100 whitespace-nowrap">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}