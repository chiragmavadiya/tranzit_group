import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "warning" | "error" | "default";

interface CustomToastProps {
  message: string;
  type?: ToastType;
  t: string | number; // Sonner's toast ID
}

// eslint-disable-next-line react-refresh/only-export-components
const CustomToast = ({ message, type = "default", t }: CustomToastProps) => {
  const styles = {
    success: {
      bg: "bg-[#F0FDF4] dark:bg-emerald-950/20",
      border: "border-[#10B981]",
      icon: <CheckCircle2 className="w-5 h-5 text-[#10B981]" />,
      iconBg: "bg-[#10B981]",
      titleColor: "text-[#065F46] dark:text-emerald-400",
      defaultTitle: "Congratulations!",
    },
    warning: {
      bg: "bg-[#FFFBEB] dark:bg-amber-950/20",
      border: "border-[#F59E0B]",
      icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
      iconBg: "bg-[#F59E0B]/10",
      titleColor: "text-[#92400E] dark:text-amber-400",
      defaultTitle: "Warning!",
    },
    error: {
      bg: "bg-[#FEF2F2] dark:bg-red-950/20",
      border: "border-[#EF4444]",
      icon: <XCircle className="w-5 h-5 text-[#EF4444]" />,
      iconBg: "bg-[#EF4444]",
      titleColor: "text-[#991B1B] dark:text-red-400",
      defaultTitle: "Something went wrong!",
    },
    default: {
      bg: "bg-primary/5 dark:bg-primary/10",
      border: "border-primary",
      icon: <Lightbulb className="w-5 h-5 text-primary" />,
      iconBg: "bg-primary",
      titleColor: "text-primary",
      defaultTitle: "Did you know?",
    },
  };

  const style = styles[type];

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 w-fit max-w-[450px] p-2 rounded-md border shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-300",
        style.bg,
        style.border
      )}
    >
      {/* Icon Circle */}
      <div className={cn("flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center")}>
        {style.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* <h4 className={cn("text-base font-bold leading-tight mb-1", style.titleColor)}>
          {title || style.defaultTitle}
        </h4> */}
        <p className="text-[14px]  line-clamp-4 font-medium text-slate-700 leading-tight dark:text-slate-400  mb-0">
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => toast.dismiss(t)}
        className=" p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
      >
        <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-300" />
      </button>
    </div>
  );
};

/**
 * Custom Toast Utility
 * @param message The message to display
 * @param type success | warning | error | default
 * @param title Optional title
 */
export const showToast = (message: string, type: ToastType = "default") => {
  toast.dismiss();
  toast.custom((t) => (
    <CustomToast
      message={message}
      type={type}
      t={t}
    />
  ), {
    duration: 4000,
    position: 'top-center'
  });
};

