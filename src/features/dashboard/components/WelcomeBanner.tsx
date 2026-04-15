import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoveRight, Box } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
  description: string;
  buttons?: { label: string; onClick?: () => void; variant?: "default" | "outline" }[];
  imageSrc?: string;
  className?: string;
  variant?: "blue" | "purple";
}

export function WelcomeBanner({ userName, description, buttons, imageSrc, className, variant = "blue" }: WelcomeBannerProps) {
  const bgColors = variant === "blue"
    ? "bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/10 dark:to-transparent border-blue-100/50 dark:border-blue-900/20"
    : "bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-purple-900/10 dark:to-transparent border-purple-100/50 dark:border-purple-900/20";

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border p-8", bgColors, className)}>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            {userName} 🥳
          </h1>
          <p className="max-w-[500px] text-[14px] md:text-[15px] leading-relaxed font-medium text-slate-500 dark:text-zinc-400">
            {description}
          </p>
          {buttons && buttons.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant={btn.variant || "default"}
                  onClick={btn.onClick}
                  className={cn(
                    "h-10 px-6 text-[13px] font-bold transition-all active:scale-95",
                    btn.variant === "default"
                      ? "bg-[#F35555] hover:bg-[#E54848] text-white shadow-lg shadow-red-200 dark:shadow-none"
                      : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                  )}
                >
                  {btn.label}
                  {btn.variant === "default" && <MoveRight className="w-4 h-4 ml-2" />}
                </Button>
              ))}
            </div>
          )}
        </div>

        {imageSrc ? (
          <div className="shrink-0 animate-in fade-in slide-in-from-right-8 duration-1000">
            <img src={imageSrc} alt="Dashboard Illustration" className="w-[180px] md:w-[220px] drop-shadow-2xl" />
          </div>
        ) : (
          // <div className="hidden md:flex shrink-0 w-32 h-32 bg-white/60 dark:bg-zinc-800/60 border border-slate-200/50 dark:border-zinc-700/50 rounded-2xl items-center justify-center shadow-inner group">
          <Box className={cn(
            "w-16 h-16 transition-transform duration-500 group-hover:scale-110",
            variant === "blue" ? "text-blue-500/20" : "text-purple-500/20"
          )} />
          // </div>
        )}
      </div>
    </div>
  );
}
