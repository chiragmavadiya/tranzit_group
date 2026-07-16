import { addDays, format } from 'date-fns';

export interface DateOption {
  label: string;
  value: string;
}

/**
 * Generates the next two available working/pickup days, skipping Saturdays, Sundays,
 * static public holidays, and dynamically configured blackout dates.
 * If the current local time is at or after 11:00 AM, today is skipped and options start from tomorrow.
 * 
 * @param blackoutDates Array of blackout dates (string formats: yyyy-MM-dd, dd-MM-yyyy, etc.)
 * @param baseDate The start date (defaults to today)
 */
export function getPickupDateOptions(
  blackoutDates: string[] = [],
  baseDate: Date = new Date()
): DateOption[] {
  // Normalize blackout dates to 'yyyy-MM-dd' for quick lookup
  const normalizedBlackouts = new Set(
    blackoutDates
      .map((d) => {
        if (!d) return '';
        if (typeof d === 'string') {
          // Check if it's already yyyy-MM-dd
          if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
            return d;
          }
          // Check if it's dd-MM-yyyy
          if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
            const [day, month, year] = d.split('-');
            return `${year}-${month}-${day}`;
          }
          // Check if it's dd/MM/yyyy
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
            const [day, month, year] = d.split('/');
            return `${year}-${month}-${day}`;
          }
        }
        try {
          return format(new Date(d), 'yyyy-MM-dd');
        } catch {
          return '';
        }
      })
      .filter(Boolean)
  );

  const options: DateOption[] = [];

  // Rule: If current time is at or after 11:00 AM, do not display today's date. Start from Tomorrow.
  const currentHour = baseDate.getHours();
  let daysAdded = currentHour >= 11 ? 1 : 0;

  const todayStr = format(baseDate, 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(baseDate, 1), 'yyyy-MM-dd');
  const dayAfterTomorrowStr = format(addDays(baseDate, 2), 'yyyy-MM-dd');

  while (options.length < 2) {
    const candidateDate = addDays(baseDate, daysAdded);

    // Rule: Do not display Saturday (6) and Sunday (0) dates
    const dayOfWeek = candidateDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const candidateStr = format(candidateDate, 'yyyy-MM-dd');
    const isBlackout = normalizedBlackouts.has(candidateStr);

    if (!isWeekend && !isBlackout) {
      const formatted = format(candidateDate, 'dd-MM-yyyy');
      let label = '';
      if (candidateStr === todayStr) {
        label = `Today(${formatted})`;
      } else if (candidateStr === tomorrowStr) {
        label = `Tomorrow(${formatted})`;
      } else if (candidateStr === dayAfterTomorrowStr) {
        label = `Day After Tomorrow(${formatted})`;
      } else {
        label = formatted;
      }
      options.push({ label, value: candidateStr });
    }
    daysAdded++;

    // Safety break to prevent infinite loops
    if (daysAdded > 365) {
      break;
    }
  }

  return options;
}
