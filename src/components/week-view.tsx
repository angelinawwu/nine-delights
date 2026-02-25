"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";
import { DelightEntry, DelightType } from "@/lib/types";
import { useDelights } from "@/lib/hooks";
import { DayCard } from "./day-card";

const DAY_COUNT = 14;

export function WeekView() {
  const { entries, loading, fetchEntries, addDelight, updateDelight, deleteDelight } = useDelights();

  const scrollRef = useRef<HTMLDivElement>(null);
  const didScroll = useRef(false);

  const today = useMemo(() => new Date(), []);

  const days = useMemo(
    () =>
      Array.from({ length: DAY_COUNT }, (_, i) =>
        subDays(today, DAY_COUNT - 1 - i)
      ),
    [today]
  );

  const startStr = format(days[0], "yyyy-MM-dd");
  const endStr = format(today, "yyyy-MM-dd");

  useEffect(() => {
    fetchEntries(startStr, endStr);
  }, [startStr, endStr, fetchEntries]);

  // Auto-scroll to the right (today) on mount / after loading
  useEffect(() => {
    if (!loading && scrollRef.current && !didScroll.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      didScroll.current = true;
    }
  }, [loading]);

  const getEntriesForDate = useCallback(
    (date: Date): DelightEntry[] => {
      const dateStr = format(date, "yyyy-MM-dd");
      return entries.filter((e) => e.date === dateStr);
    },
    [entries]
  );

  const handleRefresh = () => fetchEntries(startStr, endStr);

  const handleAdd = async (entry: {
    date: string;
    delight: DelightType;
    description: string;
    wildcardName?: string;
    imageUrl?: string;
  }) => {
    return addDelight(entry);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Horizontal scroll day strip */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex flex-1 gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
      >
        {loading ? (
          Array.from({ length: DAY_COUNT }).map((_, i) => (
            <div
              key={i}
              className="h-[420px] w-[280px] shrink-0 animate-pulse rounded-2xl border border-border bg-secondary/30 snap-center sm:w-[220px]"
            />
          ))
        ) : (
          days.map((day, i) => (
            <motion.div
              key={format(day, "yyyy-MM-dd")}
              className="w-[280px] shrink-0 snap-center sm:w-[220px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: i * 0.03,
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
