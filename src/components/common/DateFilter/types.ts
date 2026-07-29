export type DateFilterType =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
  | "custom";

export interface DateFilterValue {
  type: DateFilterType;
  from: string | undefined;
  to: string | undefined;
  label: string;
}

export interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
  className?: string;
  fromDashboard?: boolean;
}
