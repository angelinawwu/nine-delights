"use client";

import { useState, useCallback } from "react";
import { DelightEntry } from "./types";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth } from "date-fns";

export function useDelights() {
  const [entries, setEntries] = useState<DelightEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/delights?start=${start}&end=${end}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching delights:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDelight = useCallback(
    async (entry: { date: string; delight: string; description: string; wildcardName?: string }) => {
      try {
        const res = await fetch("/api/delights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error("Failed to add");
        return true;
      } catch (error) {
        console.error("Error adding delight:", error);
        return false;
      }
    },
    []
  );

  const updateDelight = useCallback(
    async (entry: {
      rowIndex: number;
      date: string;
      delight: string;
      description: string;
      wildcardName?: string;
    }) => {
      try {
        const res = await fetch("/api/delights", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error("Failed to update");
        return true;
      } catch (error) {
        console.error("Error updating delight:", error);
        return false;
      }
    },
    []
  );

  const deleteDelight = useCallback(async (rowIndex: number) => {
    try {
      const res = await fetch("/api/delights", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      return true;
    } catch (error) {
      console.error("Error deleting delight:", error);
      return false;
    }
  }, []);

  return { entries, loading, fetchEntries, addDelight, updateDelight, deleteDelight };
}

export function useWeekNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToPrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return {
    currentDate,
    setCurrentDate,
    weekStart,
    weekEnd,
    startStr: format(weekStart, "yyyy-MM-dd"),
    endStr: format(weekEnd, "yyyy-MM-dd"),
    goToNextWeek,
    goToPrevWeek,
    goToToday,
  };
}

export function useMonthNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const goToNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const goToPrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const goToToday = () => setCurrentDate(new Date());

  return {
    currentDate,
    setCurrentDate,
    monthStart,
    monthEnd,
    startStr: format(monthStart, "yyyy-MM-dd"),
    endStr: format(monthEnd, "yyyy-MM-dd"),
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  };
}
