import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { CalendarIcon, CircleX } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { format, parse, isValid } from 'date-fns';
import { memo, useState } from 'react'
import { CustomLabel } from '@/features/orders/components/OrderFormUI'

const DatePicker = memo(({ date, setDate, label, className, placeholder = 'DD/MM/YYYY', disabled, showClear = false }: { date: Date | string | undefined, setDate: (date: Date | undefined) => void, label?: string, className?: string, placeholder?: string, disabled?: { after?: Date | undefined, before?: Date | undefined }, showClear?: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);

  // const parsedDate = date ? (typeof date === 'string' ? new Date(date) : date) : undefined;
  const parsedDate = (() => {
    if (!date) return undefined;

    if (date instanceof Date) return date;
    const formats = [
      "dd/MM/yy",
      "dd/MM/yyyy",
      "dd/MM/yy HH:mm",
      "dd/MM/yyyy HH:mm",
      "yyyy-MM-dd",
      "yyyy-MM-dd HH:mm",
      "yyyy-MM-dd HH:mm:ss",
    ];

    for (const formatString of formats) {
      const parsed = parse(date, formatString, new Date());

      if (isValid(parsed)) {
        return parsed;
      }
    }
  })();

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    setOpen(false);
  };

  return (
    <div className='flex flex-col'>
      {/* {label && <label className="text-[13px] font-semibold text-gray-700 dark:text-zinc-400 ml-0.5">{label}</label>} */}
      {label && <CustomLabel label={label} />}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger className="w-full">
          <Button
            variant="outline"
            className={cn(
              "group/calendar relative w-full h-8 justify-between text-left font-normal border-gray-200 dark:border-zinc-800 px-3",
              !parsedDate && "text-muted-foreground", className
            )}
          >
            {parsedDate ? format(parsedDate, "dd/MM/yyyy") : <span>{placeholder}</span>}
            <div className="h-4 w-4 relative flex items-center justify-center">
              {showClear && parsedDate ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 text-gray-500 hover:text-red-400 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-transparent absolute inset-0 hidden group-hover/calendar:flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDate(undefined);
                      setOpen(false);
                    }}
                    title="Clear"
                  >
                    <CircleX className="h-3.5 w-3.5" />
                  </Button>
                  <CalendarIcon className="h-4 w-4 opacity-50 absolute inset-0 group-hover/calendar:hidden" />
                </>
              ) : (
                <CalendarIcon className="h-4 w-4 opacity-50" />
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-9999" align="start">
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleDateChange}
            disabled={disabled as any}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
})

export default DatePicker;