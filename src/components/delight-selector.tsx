"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const filtered = DELIGHTS.filter(
    (d) =>
      !excludeDelights.includes(d.type) &&
      d.label.toLowerCase().includes(search.toLowerCase())
  );

  // Reset highlight to 0 whenever the filtered list changes
  useEffect(() => {
    setHighlightIndex(0);
  }, [search]);

  const selectItem = useCallback(
    (index: number) => {
      if (filtered[index]) {
        onSelect(filtered[index].type);
        setSearch("");
        setOpen(false);
        setHighlightIndex(0);
      }
    },
    [filtered, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || filtered.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((prev) => {
            const next = prev < filtered.length - 1 ? prev + 1 : 0;
            itemRefs.current.get(next)?.scrollIntoView({ block: "nearest" });
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filtered.length - 1;
            itemRefs.current.get(next)?.scrollIntoView({ block: "nearest" });
            return next;
          });
          break;
        case "Enter":
          e.preventDefault();
          selectItem(highlightIndex);
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          setSearch("");
          break;
      }
    },
    [open, filtered, highlightIndex, selectItem]
  );

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

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
          onKeyDown={handleKeyDown}
          placeholder="Add a delight..."
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60 text-xs"
        />
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && position && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="fixed z-50 max-h-48 overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
                style={{
                  top: position.top + position.height + 4,
                  left: position.left,
                  width: position.width,
                }}
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
                        <button
                          key={d.type}
                          ref={(el) => {
                            if (el) itemRefs.current.set(i, el);
                            else itemRefs.current.delete(i);
                          }}
                          onClick={() => selectItem(i)}
                          onMouseEnter={() => setHighlightIndex(i)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors duration-200 ease",
                            i === highlightIndex
                              ? "bg-foreground/[0.06]"
                              : "hover:bg-foreground/[0.04]"
                          )}
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: config.color }}
                          />
                          <span className="font-medium">{d.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
