"use client";

import { useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from "date-fns";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight, CalendarBlank } from "@phosphor-icons/react";
import { DelightEntry } from "@/lib/types";
import { useMonthNavigation, useDelights } from "@/lib/hooks";
import { DelightDot } from "./delight-chip";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  onDateSelect: (date: Date) => void;
}

export function MonthView({ onDateSelect }: MonthViewProps) {
  const {
    currentDate,
    monthStart,
    monthEnd,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  } = useMonthNavigation();

  const { entries, loading, fetchEntries } = useDelights();

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const fetchStartStr = format(calendarStart, "yyyy-MM-dd");
  const fetchEndStr = format(calendarEnd, "yyyy-MM-dd");

  useEffect(() => {
    fetchEntries(fetchStartStr, fetchEndStr);
  }, [fetchStartStr, fetchEndStr, fetchEntries]);

  const weeks: Date[][] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const getEntriesForDate = (date: Date): DelightEntry[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.filter((e) => e.date === dateStr);
  };

  const monthLabel = format(currentDate, "MMMM yyyy");
  const hasToday = isSameMonth(new Date(), currentDate);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <h2
            className="text-lg font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {monthLabel}
          </h2>
          <button
            onClick={goToNextMonth}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>

        {!hasToday && (
          <button
            onClick={goToToday}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 ease hover:border-foreground/20 hover:text-foreground"
          >
            <CalendarBlank size={14} />
            Today
          </button>
        )}
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 space-y-1">
        {loading ? (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-secondary/30"
              />
            ))}
          </div>
        ) : (
          weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((d, di) => {
                const dayEntries = getEntriesForDate(d);
                const inMonth = isSameMonth(d, currentDate);
                const today = isToday(d);

                return (
                  <motion.button
                    key={format(d, "yyyy-MM-dd")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.01 }}
                    onClick={() => onDateSelect(d)}
                    className={cn(
                      "group flex flex-col items-start rounded-xl p-2 text-left transition-all duration-200 ease",
                      inMonth ? "hover:bg-foreground/[0.03]" : "opacity-30",
                      today && "bg-foreground/[0.03] ring-1 ring-foreground/10"
                    )}
                    style={{ minHeight: "5rem" }}
                  >
                    <span
                      className={cn(
                        "mb-1 text-xs tabular-nums",
                        today ? "font-semibold text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {format(d, "d")}
                    </span>
                    {dayEntries.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dayEntries.map((entry) => (
                          <DelightDot key={entry.rowIndex} delight={entry.delight} />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
