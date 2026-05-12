import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import * as LucideIcons from "lucide-react";

export interface HeaderIconProps {
  icon: LucideIcon;
  title: string;
  color: 'blue' | 'green';
}

export interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: ReactNode;
  value: string | number | undefined;
  onChange: (val: string, name?: string) => void;
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
  error?: boolean;
  errormsg?: string;
  inputClassName?: string;
}

export interface FormTextareaProps extends Omit<FormInputProps, 'type'> {
  rows?: number;
}

export interface FormSelectProps extends Omit<FormInputProps, 'value' | 'onChange'> {
  label?: string;
  value: string;
  onValueChange: (val: string | null) => void;
  options: readonly { label: string; value: string | number }[];
  placeholder?: string;
  className?: string;
  isHalf?: boolean;
  isCompact?: boolean;
  layout?: 'vertical' | 'horizontal';
  required?: boolean;
  error?: boolean;
  errormsg?: string;
  name?: string;
}

export interface SummaryCardProps {
  title: string;
  name: string;
  address: string;
  phone: string;
  isRight?: boolean;
}

export interface DropdownUIProps {
  icon?: keyof typeof LucideIcons;
  label: string;
  onClick: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }> | Array<{ value: string; label: string }>;
}

export interface FormRadioProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
  activeColor?: string;
}

export interface FormCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  price?: number;
  className?: string;
}
