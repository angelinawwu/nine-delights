"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts";
import { format, subDays, parseISO, differenceInDays } from "date-fns";
import { Fire, TrendUp, Trophy, CalendarCheck, Ranking } from "@phosphor-icons/react";
import { Navbar } from "@/components/navbar";
import { DelightChip } from "@/components/delight-chip";
import { DelightEntry, DelightType } from "@/lib/types";
import { DELIGHTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type TimeRange = "7" | "30" | "90" | "all";

export default function StatsPage() {
  const [entries, setEntries] = useState<DelightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>("30");

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await fetch("/api/delights?all=true");
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    if (range === "all") return entries;
    const cutoff = format(subDays(new Date(), parseInt(range)), "yyyy-MM-dd");
    return entries.filter((e) => e.date >= cutoff);
  }, [entries, range]);

  const stats = useMemo(() => {
    const frequencyMap: Record<string, number> = {};
    const dateSet = new Set<string>();
    const delightDates: Record<string, Set<string>> = {};

    DELIGHTS.forEach((d) => {
      frequencyMap[d.type] = 0;
      delightDates[d.type] = new Set();
    });

    filtered.forEach((entry) => {
      frequencyMap[entry.delight] = (frequencyMap[entry.delight] || 0) + 1;
      dateSet.add(entry.date);
      if (delightDates[entry.delight]) {
        delightDates[entry.delight].add(entry.date);
      }
    });

    const frequencyData = DELIGHTS.map((d) => ({
      name: d.label,
      type: d.type,
      count: frequencyMap[d.type] || 0,
      color: d.color,
    })).sort((a, b) => b.count - a.count);

    const radarData = DELIGHTS.map((d) => ({
      delight: d.label.length > 10 ? d.label.slice(0, 8) + "…" : d.label,
      count: frequencyMap[d.type] || 0,
      fullMark: Math.max(...Object.values(frequencyMap), 1),
    }));

    const totalDays = dateSet.size;
    const totalEntries = filtered.length;
    const avgPerDay = totalDays > 0 ? (totalEntries / totalDays).toFixed(1) : "0";

    const allNineDays = Array.from(dateSet).filter((date) => {
      const dayEntries = filtered.filter((e) => e.date === date);
      const uniqueDelights = new Set(dayEntries.map((e) => e.delight));
      return uniqueDelights.size >= 9;
    }).length;

    const mostPracticed = frequencyData[0];
    const leastPracticed = frequencyData.filter((d) => d.count > 0).pop() || frequencyData[frequencyData.length - 1];

    // Streak calculation for each delight
    const streaks = DELIGHTS.map((d) => {
      const dates = Array.from(delightDates[d.type]).sort();
      let currentStreak = 0;
      let maxStreak = 0;

      if (dates.length > 0) {
        const today = format(new Date(), "yyyy-MM-dd");
        let streak = 0;

        // Check current streak (from today backwards)
        let checkDate = today;
        for (let i = 0; i < 365; i++) {
          if (delightDates[d.type].has(checkDate)) {
            streak++;
            checkDate = format(subDays(parseISO(checkDate), 1), "yyyy-MM-dd");
          } else {
            break;
          }
        }
        currentStreak = streak;

        // Max streak
        let tempStreak = 1;
        for (let i = 1; i < dates.length; i++) {
          const diff = differenceInDays(parseISO(dates[i]), parseISO(dates[i - 1]));
          if (diff === 1) {
            tempStreak++;
          } else {
            maxStreak = Math.max(maxStreak, tempStreak);
            tempStreak = 1;
          }
        }
        maxStreak = Math.max(maxStreak, tempStreak);
      }

      return {
        type: d.type,
        label: d.label,
        color: d.color,
        currentStreak,
        maxStreak,
      };
    });

    return {
      frequencyData,
      radarData,
      totalDays,
      totalEntries,
      avgPerDay,
      allNineDays,
      mostPracticed,
      leastPracticed,
      streaks,
    };
  }, [filtered]);

  const ranges: { value: TimeRange; label: string }[] = [
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "90", label: "90 days" },
    { value: "all", label: "All time" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Stats
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your delight practice at a glance
            </p>
          </div>

          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ease",
                  range === r.value
                    ? "bg-foreground text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary/30" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Active Days",
                  value: stats.totalDays,
                  icon: <CalendarCheck size={20} weight="fill" />,
                  color: "#60A5FA",
                },
                {
                  label: "Total Entries",
                  value: stats.totalEntries,
                  icon: <TrendUp size={20} weight="fill" />,
                  color: "#34D399",
                },
                {
                  label: "Avg / Day",
                  value: stats.avgPerDay,
                  icon: <Fire size={20} weight="fill" />,
                  color: "#F4A261",
                },
                {
                  label: "Perfect Days (all 9)",
                  value: stats.allNineDays,
                  icon: <Trophy size={20} weight="fill" />,
                  color: "#FBBF24",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span style={{ color: card.color }}>{card.icon}</span>
                    <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                  </div>
                  <p className="text-2xl font-medium tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                    {card.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Frequency bar chart */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="mb-4 text-sm font-medium">Delight Frequency</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.frequencyData} layout="vertical" margin={{ left: 0, right: 12 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 10,
                          border: "1px solid hsl(var(--border))",
                          backgroundColor: "hsl(var(--card))",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                        {stats.frequencyData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Radar chart */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.25 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="mb-4 text-sm font-medium">Delight Balance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={stats.radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="delight"
                        tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar
                        dataKey="count"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Streaks */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h3 className="mb-4 text-sm font-medium">Streaks</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {stats.streaks.map((s, i) => (
                  <motion.div
                    key={s.type}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 + i * 0.03 }}
                    className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-xs font-medium">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs tabular-nums">
                      <span className="text-muted-foreground">
                        best <span className="font-semibold text-foreground">{s.maxStreak}d</span>
                      </span>
                      {s.currentStreak > 0 && (
                        <span className="flex items-center gap-0.5 font-semibold" style={{ color: s.color }}>
                          <Fire size={12} weight="fill" />
                          {s.currentStreak}d
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Most / Least practiced */}
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.35 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Ranking size={16} weight="fill" className="text-emerald-500" />
                  Most practiced
                </div>
                {stats.mostPracticed && (
                  <div className="flex items-center gap-2">
                    <DelightChip delight={stats.mostPracticed.type as DelightType} size="md" />
                    <span className="text-lg font-medium tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                      {stats.mostPracticed.count}×
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.4 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Ranking size={16} weight="fill" className="text-rose-400" />
                  Least practiced
                </div>
                {stats.leastPracticed && (
                  <div className="flex items-center gap-2">
                    <DelightChip delight={stats.leastPracticed.type as DelightType} size="md" />
                    <span className="text-lg font-medium tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                      {stats.leastPracticed.count}×
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
