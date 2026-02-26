"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LockOpen, ChartBar, CalendarDots, SignOut, Question } from "@phosphor-icons/react";
import { useAuth } from "./auth-provider";
import { PasswordPrompt } from "./password-prompt";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl tracking-tight">9 delights</h1>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease",
                pathname === "/"
                  ? "bg-foreground/[0.06] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarDots size={18} weight={pathname === "/" ? "fill" : "regular"} />
              <span className="hidden sm:inline">Calendar</span>
            </Link>

            <Link
              href="/stats"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease",
                pathname === "/stats"
                  ? "bg-foreground/[0.06] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ChartBar size={18} weight={pathname === "/stats" ? "fill" : "regular"} />
              <span className="hidden sm:inline">Stats</span>
            </Link>

            <Link
              href="/about"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease",
                pathname === "/about"
                  ? "bg-foreground/[0.06] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Question size={18} weight={pathname === "/about" ? "fill" : "regular"} />
              <span className="hidden sm:inline">About</span>
            </Link>

            <div className="mx-1.5 h-4 w-px bg-border" />

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
                    title="Sign out"
                  >
                    <LockOpen size={18} weight="regular" className="text-emerald-500" />
                    <SignOut size={16} weight="regular" className="hidden sm:block" />
                  </button>
                </motion.div>
              </div>
            ) : (
              <button
                onClick={() => setShowPasswordPrompt(true)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
                title="Unlock editing"
              >
                <Lock size={18} weight="regular" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showPasswordPrompt && (
          <PasswordPrompt onClose={() => setShowPasswordPrompt(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
