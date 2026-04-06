import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Step {
  title: string
  icon: LucideIcon
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep: number
  activeColor?: string
  inactiveColor?: string
  accentColor?: string
}

export function Stepper({
  steps,
  currentStep,
  activeColor = "bg-blue-600",
  inactiveColor = "bg-slate-100",
  accentColor = "border-blue-600",
  className,
  ...props
}: StepperProps) {
  return (
    <div className={cn("px-10 py-4 border-b border-slate-50 dark:border-zinc-900", className)} {...props}>
      <div className="flex items-center justify-between relative max-w-lg mx-auto">
        {/* Progress Line */}
        <div className={cn("absolute top-5 left-5 right-5 h-0.5 -z-0 rounded-full", inactiveColor, "dark:bg-zinc-800")}>
          <div
            className={cn("h-full transition-all duration-500 ease-out rounded-full", activeColor)}
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((s, idx) => {
          const Icon = s.icon
          const isPassed = idx < currentStep
          const isCurrent = idx === currentStep

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                  isCurrent
                    ? `${activeColor} ${accentColor} text-white shadow-[0_0_15px_rgba(37,99,235,0.25)] scale-110`
                    : isPassed
                      ? `bg-white dark:bg-zinc-900 ${accentColor} text-blue-600 dark:text-blue-400`
                      : "bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 text-slate-300 dark:text-zinc-600"
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold tracking-widest uppercase mb-[-4px]",
                  isCurrent ? "text-slate-900 dark:text-zinc-100" : "text-slate-400 dark:text-zinc-500"
                )}
              >
                {s.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
