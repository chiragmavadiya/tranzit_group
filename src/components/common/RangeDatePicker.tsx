import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { memo, useState } from 'react'
import { CustomLabel } from '@/features/orders/components/OrderFormUI'
import type { DateRange } from 'react-day-picker';

const RangeDatePicker = memo(({ date, setDate, label, className, placeholder = 'DD/MM/YY' }: { date: DateRange | undefined, setDate: (date: DateRange | undefined) => void, label?: string, className?: string, placeholder?: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
    setOpen(false);
  };

  return (
    <div className='flex flex-col'>
      {/* {label && <label className="text-[13px] font-semibold text-gray-700 dark:text-zinc-400 ml-0.5">{label}</label>} */}
      {label && <CustomLabel label={label} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            variant="outline"
            className={cn(
              "w-full h-8 justify-between text-left font-normal border-gray-200 dark:border-zinc-800 px-3",
              !date && "text-muted-foreground", className
            )}
          >
            {date ? `${format(date.from!, "dd/MM/yy")} - ${format(date.to!, "dd/MM/yy")}` : <span>{placeholder}</span>}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
})

export default RangeDatePicker;