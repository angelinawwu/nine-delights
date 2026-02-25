"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { WeekView } from "@/components/week-view";
import { MonthView } from "@/components/month-view";
import { CalendarDots, SquaresFour } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ViewMode = "week" | "month";

export default function Home() {
  const [view, setView] = useState<ViewMode>("week");

  const handleDateSelect = () => {
    setView("week");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {/* View toggle */}
        <div className="mb-4 flex items-center justify-end">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setView("week")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ease",
                view === "week"
                  ? "bg-foreground text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarDots size={14} weight={view === "week" ? "fill" : "regular"} />
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ease",
                view === "month"
                  ? "bg-foreground text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <SquaresFour size={14} weight={view === "month" ? "fill" : "regular"} />
              Month
            </button>
          </div>
        </div>

        {view === "week" ? (
          <WeekView />
        ) : (
          <MonthView onDateSelect={handleDateSelect} />
        )}
      </main>
    </div>
  );
}
