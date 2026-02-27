"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableText({ text, maxLines = 2, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
        const maxHeight = lineHeight * maxLines;
        setIsTruncated(textRef.current.scrollHeight > maxHeight + 1);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [text, maxLines]);

  if (!text) return null;

  if (!isTruncated) {
    return (
      <p
        ref={textRef}
        className={cn("text-xs leading-relaxed text-muted-foreground", className)}
      >
        {text}
      </p>
    );
  }

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
            ref={textRef}
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
