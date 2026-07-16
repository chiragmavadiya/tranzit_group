import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  format,
} from "date-fns";
import type { DateFilterType } from "./types";

export const QUICK_FILTER_OPTIONS: { type: DateFilterType; label: string }[] = [
  { type: "today", label: "Today" },
  { type: "yesterday", label: "Yesterday" },
  { type: "thisWeek", label: "This Week" },
  { type: "lastWeek", label: "Last Week" },
  { type: "thisMonth", label: "This Month" },
  { type: "lastMonth", label: "Last Month" },
  { type: "thisYear", label: "This Year" },
  { type: "lastYear", label: "Last Year" },
  { type: "custom", label: "Custom Range" },
];

export const calculateDateRange = (
  type: DateFilterType,
  customFrom?: Date,
  customTo?: Date
): { from: Date; to: Date; label: string } => {
  const now = new Date();
  const weekOptions = { weekStartsOn: 1 as const };

  let from: Date;
  let to: Date;
  let label: string;

  switch (type) {
    case "today":
      from = startOfDay(now);
      to = endOfDay(now);
      label = "Today";
      break;
    case "yesterday": {
      const yesterday = subDays(now, 1);
      from = startOfDay(yesterday);
      to = endOfDay(yesterday);
      label = "Yesterday";
      break;
    }
    case "thisWeek":
      from = startOfWeek(now, weekOptions);
      to = endOfWeek(now, weekOptions);
      label = "This Week";
      break;
    case "lastWeek": {
      const lastWeek = subWeeks(now, 1);
      from = startOfWeek(lastWeek, weekOptions);
      to = endOfWeek(lastWeek, weekOptions);
      label = "Last Week";
      break;
    }
    case "thisMonth":
      from = startOfMonth(now);
      to = endOfMonth(now);
      label = "This Month";
      break;
    case "lastMonth": {
      const lastMonth = subMonths(now, 1);
      from = startOfMonth(lastMonth);
      to = endOfMonth(lastMonth);
      label = "Last Month";
      break;
    }
    case "thisYear":
      from = startOfYear(now);
      to = endOfYear(now);
      label = "This Year";
      break;
    case "lastYear": {
      const lastYear = subYears(now, 1);
      from = startOfYear(lastYear);
      to = endOfYear(lastYear);
      label = "Last Year";
      break;
    }
    case "custom":
      from = customFrom ? startOfDay(customFrom) : startOfDay(now);
      to = customTo ? endOfDay(customTo) : endOfDay(now);
      label = `${format(from, "dd MMM yyyy")} - ${format(to, "dd MMM yyyy")}`;
      break;
    default:
      from = startOfDay(now);
      to = endOfDay(now);
      label = "Today";
  }

  return { from, to, label };
};

export const getQuickFilterLabel = (type: DateFilterType): string => {
  const option = QUICK_FILTER_OPTIONS.find((opt) => opt.type === type);
  return option ? option.label : "Today";
};
