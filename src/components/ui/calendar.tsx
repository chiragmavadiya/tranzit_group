"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

interface CalendarProps {
  className?: string
  selected?: Date | DateRange
  onSelect?: (date: Date | DateRange | undefined) => void
  mode?: "single" | "range"
}

export function Calendar({
  className,
  selected,
  onSelect,
  mode = "single",
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date())

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = month.getFullYear()
  const currentMonth = month.getMonth()

  const handlePrevMonth = () => setMonth(new Date(year, currentMonth - 1))
  const handleNextMonth = () => setMonth(new Date(year, currentMonth + 1))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isSelected = (date: Date) => {
    if (!selected) return false
    if (selected instanceof Date) {
      return date.getTime() === selected.getTime()
    }
    const { from, to } = selected
    if (from && date.getTime() === from.getTime()) return true
    if (to && date.getTime() === to.getTime()) return true
    if (from && to && date > from && date < to) return true
    return false
  }

  const isRange = (date: Date) => {
    if (mode !== "range" || !(selected && !(selected instanceof Date))) return false
    const { from, to } = selected
    return from && to && date > from && date < to
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, currentMonth, day)
    if (mode === "single") {
      onSelect?.(clickedDate)
    } else {
      const range = selected as DateRange || { from: undefined, to: undefined }
      if (!range.from || (range.from && range.to)) {
        onSelect?.({ from: clickedDate, to: undefined })
      } else if (clickedDate < range.from) {
        onSelect?.({ from: clickedDate, to: undefined })
      } else {
        onSelect?.({ from: range.from, to: clickedDate })
      }
    }
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const days = []
  const totalDays = daysInMonth(year, currentMonth)
  const firstDay = firstDayOfMonth(year, currentMonth)

  // Previous month days for padding
  const prevMonthDays = daysInMonth(year, currentMonth - 1)
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, current: false, month: currentMonth - 1 })
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, current: true, month: currentMonth })
  }

  // Next month days for padding
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false, month: currentMonth + 1 })
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {monthNames[currentMonth]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekdays.map(d => (
          <div key={d} className="text-[11px] font-medium text-zinc-400 py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          const date = new Date(year, d.month, d.day)
          const isSel = isSelected(date)
          const isInRange = isRange(date)
          const isToday = date.getTime() === today.getTime()

          return (
            <button
              key={i}
              onClick={() => d.current && handleDateClick(d.day)}
              disabled={!d.current}
              className={cn(
                "h-8 w-8 text-xs font-medium rounded-lg flex items-center justify-center transition-all relative group",
                !d.current && "text-zinc-300 dark:text-zinc-700 pointer-events-none",
                d.current && "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-zinc-700 dark:text-zinc-300",
                isToday && "text-blue-600 dark:text-blue-400 font-bold",
                isSel && "bg-blue-600 text-white dark:bg-blue-600 dark:text-white hover:bg-blue-700 dark:hover:bg-blue-700",
                isInRange && "bg-blue-50 dark:bg-blue-900/20 rounded-none first:rounded-l-lg last:rounded-r-lg"
              )}
            >
              {d.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
