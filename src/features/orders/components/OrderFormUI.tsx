import React, { useMemo, useCallback, type ReactNode, memo } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SelectComponent from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type {
  FormInputProps,
  FormTextareaProps,
  FormSelectProps,
  SummaryCardProps,
  DropdownUIProps,
  FormRadioProps,
  FormCheckboxProps
} from "./types/OrderFormUI.types";

export const Required = () => {
  return (
    <span className="text-destructive ml-[2px] mt-[-4px]">*</span>
  )
}

export const CustomLabel = ({ label, isHorizontal = false, required = false, className }: { label: ReactNode, isHorizontal?: boolean, required?: boolean, className?: string }) => {
  if (!label) return null;
  return (<Label className={cn(
    "text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider gap-0 mb-1",
    isHorizontal ? "h-fit leading-none" : "ml-0.5",
    className
  )}>
    {label}
    {required && <Required />}
  </Label>)
}

export const FormInput = memo(React.forwardRef<HTMLInputElement, FormInputProps>(({
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
  errormsg,
  // rightElement
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isHorizontal = useMemo(() => layout === 'horizontal', [layout]);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, e.target.name || '');
  }, [onChange]);

  return (
    <div className={cn(
      isHorizontal ? "grid grid-cols-[110px_1fr] items-center gap-4" : "space-y-0",
      isFullWidth ? "col-span-12" : isHalf ? "col-span-12 md:col-span-6" : isCompact ? "col-span-6 md:col-span-3" : "col-span-12 md:col-span-6",
      className
    )}>
      {label && (
        <CustomLabel
          label={label}
          isHorizontal={isHorizontal}
          required={required}
        />
      )}
      <div className="relative group">
        {Icon && (
          <div className={cn("absolute left-3", error ? 'top-2' : 'top-1/2 -translate-y-1/2', "text-gray-400 group-focus-within:text-blue-600 transition-colors")}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <Input
          ref={ref}
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete="off"
          className={cn(
            "h-8 rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus-visible:ring-0 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all placeholder:text-muted-foreground placeholder:font-normal dark:placeholder:text-zinc-700 text-sm",
            Icon ? "pl-9" : "px-3",
            type === 'password' ? "pr-10" : "",
            error ? "border-red-500 focus-visible:border-red-500" : ""
          )}
          disabled={disabled}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? (
              <LucideIcons.Eye className="h-4 w-4" />
            ) : (
              <LucideIcons.EyeOff className="h-4 w-4" />
            )}
          </button>
        )}
        {error ? <div className="text-red-500 text-[11px] w-full">{errormsg}</div> : null}
      </div>
    </div>
  );
}));

FormInput.displayName = "FormInput";



export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  isFullWidth = false,
  rows = 4,
  layout = 'vertical',
  required = false,
  error,
  errormsg
}: FormTextareaProps) {
  const isHorizontal = useMemo(() => layout === 'horizontal', [layout]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value, e.target.name || '');
  }, [onChange]);

  return (
    <div className={cn(
      isHorizontal ? "grid grid-cols-[110px_1fr] items-start gap-4" : "space-y-2",
      isFullWidth ? "col-span-12" : "col-span-12 md:col-span-6"
    )}>
      {/* <Label className={cn(
        "text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider leading-none ",
        isHorizontal ? "h-fit leading-none" : "ml-0.5"
      )}>
        {label}
        {required && <Required />}
      </Label> */}
      <CustomLabel
        label={label}
        isHorizontal={isHorizontal}
        required={required}
      />
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        rows={rows}
        className={cn(
          "rounded-md shadow-none border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus-visible:ring-0 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all placeholder:text-muted-foreground placeholder:font-normal dark:placeholder:text-zinc-700 text-sm resize-none px-3 py-2",
          error ? "border-red-500 focus-visible:border-red-500" : ""
        )}
      />
      {error ? <div className="text-red-500 text-[11px] w-full">{errormsg}</div> : null}
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


export const FormSelect = memo(({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  isHalf = false,
  isCompact = false,
  layout = 'vertical',
  required = false,
  error,
  errormsg,
  name,
  disabled
}: FormSelectProps) => {
  const isHorizontal = useMemo(() => layout === 'horizontal', [layout]);
  const memoizedData = useMemo(() => [...options], [options]);

  return (
    <div className={cn(
      isHorizontal ? "grid grid-cols-[110px_1fr] items-center gap-4" : "space-y-1",
      isHalf ? "col-span-12 md:col-span-6" : isCompact ? "col-span-6 md:col-span-3" : "col-span-12 md:col-span-6",
      className
    )}>
      {/* <Label className={cn(
        "text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider gap-0 mb-1",
        !isHorizontal && "ml-0.5"
      )}>
        {label}
        {required && <Required />}
      </Label> */}
      <CustomLabel
        label={label}
        isHorizontal={isHorizontal}
        required={required}
      />
      <div>
        <SelectComponent
          className={cn("w-full h-8 text-[13px] data-[size=default]:h-8 border-slate-200 rounded-md dark:border-zinc-800 font-medium bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 focus:ring-blue-600 transition-all text-sm px-3 ", error ? "border-red-500 focus:border-red-500" : "")}
          data={memoizedData}
          // defaultValue="default"
          onValueChange={onValueChange}
          value={value}
          placeholder={placeholder}
          name={name}
          disabled={disabled}
        />
        {error ? <div className="text-red-500 text-[11px] w-full">{errormsg}</div> : null}
      </div>
    </div>
  );
});

FormSelect.displayName = 'FormSelect';


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
export function FormRadio({
  checked,
  onChange,
  label,
  className,
  activeColor = "bg-[#0060FE]"
}: FormRadioProps) {
  return (
    <label className={cn("flex items-center gap-2.5 cursor-pointer group", className)}>
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          className={cn(
            "peer appearance-none w-4 h-4 rounded-full border-2 border-gray-300 dark:border-zinc-700 transition-all",
            checked && (activeColor === "bg-[#0060FE]" ? "border-[#0060FE]" : `border-${activeColor.replace('bg-[', '').replace(']', '')}`)
          )}
          checked={checked}
          onChange={onChange}
        />
        <div className={cn(
          "absolute w-2 h-2 rounded-full opacity-0 peer-checked:opacity-100 transition-all scale-0 peer-checked:scale-100",
          activeColor
        )} />
      </div>
      {label && <span className="text-[13px] font-medium text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">{label}</span>}
    </label>
  );
}

export function FormCheckbox({
  checked,
  onCheckedChange,
  label,
  description,
  price,
  className
}: FormCheckboxProps) {
  return (
    <div className={cn("flex items-start gap-4 p-4 transition-all", className)}>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-[14px] font-bold text-slate-800 dark:text-zinc-100 leading-none">
            {label}
          </Label>
          {price !== undefined && (
            <span className="text-[14px] font-bold text-slate-800 dark:text-zinc-100">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[12px] text-slate-500 dark:text-zinc-400 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
