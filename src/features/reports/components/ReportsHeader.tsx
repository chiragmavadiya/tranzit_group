import { useCallback } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ReportsHeaderProps {
  onApply: (startDate: Date | undefined, endDate: Date | undefined) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
}

export function ReportsHeader({ onApply, startDate, endDate, setStartDate, setEndDate }: ReportsHeaderProps) {
  // const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  // const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const handleApply = useCallback(() => {
    onApply(startDate, endDate);
  }, [startDate, endDate, onApply]);

  return (
    <div className="flex justify-between gap-6 p-6 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-t-lg">
      <div className="flex flex-col items-start justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
        {startDate && endDate && (
          <div className="mb-4 text-[13px] text-gray-500 dark:text-zinc-400">
            Parcels generated from <span className="font-semibold text-gray-900 dark:text-zinc-200">{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span> to <span className="font-semibold text-gray-900 dark:text-zinc-200">{endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <label className="text-[13px] font-semibold text-gray-500 dark:text-zinc-400 ml-0.5">Start Date</label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] h-8 justify-between text-left font-normal border-gray-200 dark:border-zinc-800",
                  !startDate && "text-muted-foreground"
                )}
              >
                {startDate ? format(startDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date instanceof Date && setStartDate(date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col">
          <label className="text-[13px] font-semibold text-gray-500 dark:text-zinc-400 ml-0.5">End Date</label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] h-8 justify-between text-left font-normal border-gray-200 dark:border-zinc-800",
                  !endDate && "text-muted-foreground"
                )}
              >
                {endDate ? format(endDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date instanceof Date && setEndDate(date)}
                className='z-50'
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={handleApply}
          variant="default"
          size="sm"
          className="h-8 p-3"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
