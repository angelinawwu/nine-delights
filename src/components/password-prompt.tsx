"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Key } from "@phosphor-icons/react";
import { useAuth } from "./auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordPromptProps {
  onClose: () => void;
}

export function PasswordPrompt({ onClose }: PasswordPromptProps) {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(password);
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setError("Wrong password");
      setPassword("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={20} weight="regular" className="text-muted-foreground" />
            <h3 className="text-lg font-medium">Unlock Editing</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="h-10"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}
          <Button
            type="submit"
            disabled={!password || loading}
            className="w-full"
          >
            {loading ? "Checking..." : "Unlock"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
