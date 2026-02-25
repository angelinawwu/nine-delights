"use client";

import { useEffect, useRef } from "react";
import { format, addDays, isToday } from "date-fns";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight, CalendarBlank } from "@phosphor-icons/react";
import { DelightEntry, DelightType } from "@/lib/types";
import { useWeekNavigation, useDelights } from "@/lib/hooks";
import { DayCard } from "./day-card";

export function WeekView() {
  const {
    weekStart,
    startStr,
    endStr,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
  } = useWeekNavigation();

  const { entries, loading, fetchEntries, addDelight, updateDelight, deleteDelight } = useDelights();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEntries(startStr, endStr);
  }, [startStr, endStr, fetchEntries]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEntriesForDate = (date: Date): DelightEntry[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.filter((e) => e.date === dateStr);
  };

  const handleRefresh = () => fetchEntries(startStr, endStr);

  const handleAdd = async (entry: {
    date: string;
    delight: DelightType;
    description: string;
    wildcardName?: string;
  }) => {
    return addDelight(entry);
  };

  const weekLabel = `${format(weekStart, "MMM d")} – ${format(addDays(weekStart, 6), "MMM d, yyyy")}`;

  const hasToday = days.some((d) => isToday(d));

  return (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevWeek}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <h2
            className="text-lg font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {weekLabel}
          </h2>
          <button
            onClick={goToNextWeek}
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

      {/* Week grid — 7 cols on desktop, 2 cols on mobile, horizontally scrollable */}
      <div
        ref={scrollRef}
        className="grid flex-1 gap-3 overflow-x-auto pb-2 grid-cols-2 sm:grid-cols-[repeat(7,minmax(180px,1fr))]"
      >
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-[420px] animate-pulse rounded-2xl border border-border bg-secondary/30"
            />
          ))
        ) : (
          days.map((day, i) => (
            <motion.div
              key={format(day, "yyyy-MM-dd")}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: i * 0.04,
              }}
            >
              <DayCard
                date={day}
                entries={getEntriesForDate(day)}
                onAdd={handleAdd}
                onUpdate={updateDelight}
                onDelete={deleteDelight}
                onRefresh={handleRefresh}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
