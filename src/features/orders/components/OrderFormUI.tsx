import React, { useMemo, useCallback } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
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
import type {
  HeaderIconProps,
  FormInputProps,
  FormTextareaProps,
  FormSelectProps,
  SummaryCardProps,
  SummaryMetricProps,
  DropdownUIProps
} from "./types/OrderFormUI.types";


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
  className, disabled = false,
  error,
  errormsg
}: FormInputProps) {
  const isHorizontal = useMemo(() => layout === 'horizontal', [layout]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={cn(
      isHorizontal ? "grid grid-cols-[110px_1fr] items-center gap-4" : "space-y-0",
      isFullWidth ? "col-span-12" : isHalf ? "col-span-6" : isCompact ? "col-span-3" : "col-span-12 md:col-span-6",
      className
    )}>
      {label && (
        <Label className={cn(
          "text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider gap-0 mb-1",
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
          onChange={handleChange}
          className={cn(
            "h-8 rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus-visible:ring-0 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-700 text-sm",
            Icon ? "pl-9" : "px-3"
          )}
          disabled={disabled}
        />
      </div>
      {error ? <div className="text-red-500 text-[11px] w-full text-right">{errormsg}</div> : null}
    </div>
  );
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
  const isHorizontal = useMemo(() => layout === 'horizontal', [layout]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

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
        onChange={handleChange}
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
  const isHorizontal = useMemo(() => layout === 'horizontal', [layout]);
  const memoizedData = useMemo(() => [...options], [options]);

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
        data={memoizedData}
        // defaultValue="default"
        onValueChange={onValueChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
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


export function SummaryMetric({ label, value }: SummaryMetricProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-tight">{value}</span>
    </div>
  );
}


export function DropdownUI({ icon = 'ChevronDown', label, onClick, options }: DropdownUIProps) {
  const IconComponent = useMemo(() => LucideIcons[icon] as React.ComponentType<React.SVGProps<SVGSVGElement>>, [icon]);
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