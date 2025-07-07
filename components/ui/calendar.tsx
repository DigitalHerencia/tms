"use client"

import * as React from "react"
import  DayPicker from "react-datepicker"

import { cn } from "@/lib/utils/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-3", className)}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
