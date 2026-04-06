import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HeaderIconProps {
  icon: LucideIcon;
  title: string;
  color: 'blue' | 'green';
}

export function HeaderIcon({ icon: Icon, title, color }: HeaderIconProps) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <div className={cn(
        "w-12 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:rotate-3",
        color === 'blue' ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-emerald-600 text-white shadow-emerald-500/20"
      )}>
        <Icon className="w-6 h-6" strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">{title}</h3>
    </div>
  );
}

interface FormInputProps {
  label: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  isHalf?: boolean;
  isFullWidth?: boolean;
  isCompact?: boolean;
  icon?: LucideIcon;
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isHalf = false,
  isFullWidth = false,
  isCompact = false,
  icon: Icon
}: FormInputProps) {
  return (
    <div className={cn(
      "space-y-2",
      isFullWidth ? "col-span-6" : isHalf ? "col-span-3" : isCompact ? "col-span-1" : "col-span-2"
    )}>
      <Label className="text-sm font-bold text-slate-800 dark:text-zinc-200 ml-1 tracking-tight">{label}</Label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
            <Icon className="w-4.5 h-4.5" strokeWidth={2.2} />
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            "h-10 rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-slate-900 dark:text-zinc-100",
            Icon ? "pl-11" : "px-4"
          )}
        />
      </div>
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onValueChange: (val: string | null) => void;
  options: ReadonlyArray<{ value: string; label: string }> | Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  isHalf?: boolean;
  isCompact?: boolean;
}

export function FormSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  isHalf = false,
  isCompact = false
}: FormSelectProps) {
  return (
    <div className={cn("space-y-2", isHalf ? "col-span-3" : isCompact ? "col-span-1" : "col-span-2", className)}>
      <Label className="text-sm font-bold text-slate-800 dark:text-zinc-200 ml-1 tracking-tight">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 w-full rounded-md border-slate-200 dark:border-zinc-800 font-medium bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:ring-blue-600/10 focus:border-blue-600 transition-all data-[size=default]:h-10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="font-medium">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  name: string;
  address: string;
  phone: string;
  isRight?: boolean;
}

export function SummaryCard({ title, name, address, phone, isRight = false }: SummaryCardProps) {
  return (
    <div className={cn("space-y-2", isRight && "pl-8")}>
      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">{title}</span>
      <p className="text-lg font-bold text-slate-900 dark:text-zinc-100 leading-none">{name || '—'}</p>
      <p className="border-l-2 border-slate-100 dark:border-zinc-800 pl-4 py-1 text-sm text-slate-500 dark:text-zinc-400 italic mt-3 leading-relaxed">{address || 'No address provided'}</p>
      <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 mt-3 tabular-nums">{phone || 'No phone provided'}</p>
    </div>
  );
}

interface SummaryMetricProps {
  label: string;
  value: string;
}

export function SummaryMetric({ label, value }: SummaryMetricProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-tight">{value}</span>
    </div>
  );
}

interface SuccessScreenProps {
  title: string;
  message: string;
  orderId: string;
  onClose: () => void;
  type?: 'order' | 'return';
}

import { CheckCircle2, ShoppingBag, RotateCcw } from "lucide-react";

export function SuccessScreen({ title, message, orderId, onClose, type = 'order' }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in zoom-in-95 fade-in duration-500">
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce",
        type === 'order' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10" : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-amber-500/10"
      )}>
        <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 mb-2 tracking-tight">{title}</h2>
      <p className="text-slate-500 dark:text-zinc-400 max-w-[320px] mb-8 leading-relaxed">{message}</p>
      
      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 mb-8 w-full max-w-sm flex items-center justify-between">
        <div className="flex items-center gap-4 text-left">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            type === 'order' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          )}>
            {type === 'order' ? <ShoppingBag className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">ID Ref</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 tabular-nums">{orderId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">Status</p>
          <div className="flex items-center gap-1.5 justify-end">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase">Confirmed</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onClose}
        className={cn(
          "w-full max-w-[200px] h-12 rounded-xl text-white font-bold shadow-lg transition-all active:scale-[0.98]",
          type === 'order' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" : "bg-orange-600 hover:bg-orange-700 shadow-orange-500/20"
        )}
      >
        Done
      </Button>
    </div>
  );
}
