"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableText({ text, maxLines = 2, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn("w-full text-left", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.p
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {text}
          </motion.p>
        ) : (
          <motion.p
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-xs leading-relaxed text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}
