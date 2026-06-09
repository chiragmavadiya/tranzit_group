import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  errormsg?: string;
}

function Input({ className, type, error, errormsg, ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full">
      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          "h-8 w-full min-w-0 rounded-sm font-normal border border-gray-200 bg-white dark:bg-zinc-900 dark:border-slate-800 px-2.5 py-1 text-base md:text-sm transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:disabled:bg-input/80",
          "focus-visible:ring-1 focus-visible:ring-primary/30 dark:focus-visible:ring-primary/30 focus-visible:border-primary dark:focus-visible:border-primary",
          className,
          error ? "border-red-500 dark:border-red-500 focus-visible:border-red-500 dark:focus-visible:border-red-500 focus-visible:ring-red-500/30 dark:focus-visible:ring-red-500/30" : ""
        )}
        {...props}
      />
      {error ? <span className="text-red-500 text-[11px]">{errormsg}</span> : null}
    </div>
  )
}

export { Input }
