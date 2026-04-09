import { RefreshCw, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SelectComponent from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

const Required = () => {
  return (
    <span className="text-destructive ml-[2px] mt-[-4px]">*</span>
  )
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
  layout?: 'vertical' | 'horizontal';
  required?: boolean;
  className?: string;
  disabled?: boolean;
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
  icon: Icon,
  layout = 'vertical',
  required = false,
  className, disabled = false
}: FormInputProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={cn(
      isHorizontal ? "grid grid-cols-[110px_1fr] items-center gap-4" : "space-y-1",
      isFullWidth ? "col-span-12" : isHalf ? "col-span-6" : isCompact ? "col-span-3" : "col-span-12 md:col-span-6",
      className
    )}>
      {label && (
        <Label className={cn(
          "text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider gap-0",
          isHorizontal ? "h-fit leading-none" : "ml-0.5"
        )}>
          {label}
          {required && <Required />}
        </Label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            "h-8 rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus-visible:ring-0 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-700 text-sm",
            Icon ? "pl-9" : "px-3"
          )}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

interface FormTextareaProps extends Omit<FormInputProps, 'type'> {
  rows?: number;
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  isFullWidth = false,
  rows = 4,
  layout = 'vertical',
  required = false
}: FormTextareaProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={cn(
      isHorizontal ? "grid grid-cols-[110px_1fr] items-start gap-4" : "space-y-1",
      isFullWidth ? "col-span-12" : "col-span-12 md:col-span-6"
    )}>
      <Label className={cn(
        "text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider leading-none",
        isHorizontal ? "pt-2.5" : "ml-0.5"
      )}>
        {label}
        {required && <Required />}
      </Label>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 text-sm resize-none px-3 py-2"
      />
    </div>
  );
}

export function ValidAddressBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 border border-emerald-600 rounded-md text-[10px] font-bold text-emerald-600 uppercase tracking-wider w-fit shadow-sm">
      <CheckCircle2 className="w-3 h-3" />
      Valid Address
      <RefreshCw className="w-3 h-3 ml-1 cursor-pointer hover:rotate-180 transition-transform duration-500" />
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onValueChange: (val: string | null) => void;
  // options: ReadonlyArray<{ value: string; key: string }> | Array<{ value: string; key: string }>;
  options: readonly { key: string; value: string }[]; // Change to readonly
  placeholder?: string;
  className?: string;
  isHalf?: boolean;
  isCompact?: boolean;
  layout?: 'vertical' | 'horizontal';
  required?: boolean;
}

export function FormSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  isHalf = false,
  isCompact = false,
  layout = 'vertical',
  required = false
}: FormSelectProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={cn(
      isHorizontal ? "grid grid-cols-[110px_1fr] items-center gap-4" : "space-y-1",
      isHalf ? "col-span-6" : isCompact ? "col-span-3" : "col-span-12 md:col-span-6",
      className
    )}>
      <Label className={cn(
        "text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider leading-none gap-0",
        !isHorizontal && "ml-0.5"
      )}>
        {label}
        {required && <Required />}
      </Label>
      <SelectComponent
        className='w-full h-8 text-[13px] data-[size=default]:h-8 border-slate-200 rounded-md dark:border-zinc-800 font-medium bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 focus:ring-blue-600 transition-all text-sm px-3 '
        data={[...options]}
        // defaultValue="default"
        onValueChange={onValueChange}
        value={value}
        placeholder={placeholder}
      />
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

interface DropdownUIProps {
  icon?: keyof typeof LucideIcons;
  label: string;
  onClick: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }> | Array<{ value: string; label: string }>;
}

export function DropdownUI({ icon = 'ChevronDown', label, onClick, options }: DropdownUIProps) {
  const IconComponent = LucideIcons[icon] as React.ComponentType<any>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 h-10 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer outline-none text-sm font-medium">
        {label}
        <IconComponent className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {options.map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => onClick(opt.value)}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}