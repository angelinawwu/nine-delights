"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { DelightType } from "@/lib/types";
import { DELIGHTS, getDelightConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DelightSelectorProps {
  onSelect: (delight: DelightType) => void;
  excludeDelights?: DelightType[];
  className?: string;
}

export function DelightSelector({ onSelect, excludeDelights = [], className }: DelightSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = DELIGHTS.filter(
    (d) =>
      !excludeDelights.includes(d.type) &&
      d.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs transition-colors duration-200 ease hover:border-foreground/20 cursor-text"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <MagnifyingGlass size={14} className="text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Add a delight..."
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60 text-xs"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No delights found
              </div>
            ) : (
              <div className="p-1">
                {filtered.map((d, i) => {
                  const config = getDelightConfig(d.type);
                  return (
                    <motion.button
                      key={d.type}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => {
                        onSelect(d.type);
                        setSearch("");
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors duration-200 ease hover:bg-foreground/[0.04]"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="font-medium">{d.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
