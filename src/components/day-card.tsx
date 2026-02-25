"use client";

import { useState } from "react";
import { format, isToday, isFuture } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash, PencilSimple, Check, X } from "@phosphor-icons/react";
import Image from "next/image";
import { DelightEntry, DelightType } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { DelightChip } from "./delight-chip";
import { DelightSelector } from "./delight-selector";
import { ExpandableText } from "./expandable-text";
import { ImagePicker } from "./image-picker";
import { ImageModal } from "./image-modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DayCardProps {
  date: Date;
  entries: DelightEntry[];
  onAdd: (entry: { date: string; delight: DelightType; description: string; wildcardName?: string; imageUrl?: string }) => Promise<boolean>;
  onUpdate: (entry: { rowIndex: number; date: string; delight: DelightType; description: string; wildcardName?: string; imageUrl?: string }) => Promise<boolean>;
  onDelete: (rowIndex: number) => Promise<boolean>;
  onRefresh: () => void;
}

export function DayCard({ date, entries, onAdd, onUpdate, onDelete, onRefresh }: DayCardProps) {
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDelight, setNewDelight] = useState<DelightType | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newWildcardName, setNewWildcardName] = useState("");
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editWildcardName, setEditWildcardName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const dateStr = format(date, "yyyy-MM-dd");
  const today = isToday(date);
  const future = isFuture(date);
  const dayName = format(date, "EEE");
  const dayNum = format(date, "d");
  const monthName = format(date, "MMM");


  const handleAdd = async () => {
    if (!newDelight) return;
    setSubmitting(true);
    const success = await onAdd({
      date: dateStr,
      delight: newDelight,
      description: newDescription,
      wildcardName: newDelight === "wildcard" ? newWildcardName : undefined,
      imageUrl: newImageUrl || undefined,
    });
    setSubmitting(false);
    if (success) {
      resetAddForm();
      onRefresh();
    }
  };

  const handleUpdate = async (entry: DelightEntry) => {
    setSubmitting(true);
    const success = await onUpdate({
      rowIndex: entry.rowIndex,
      date: entry.date,
      delight: entry.delight,
      description: editDescription,
      wildcardName: entry.delight === "wildcard" ? editWildcardName : undefined,
      imageUrl: editImageUrl || undefined,
    });
    setSubmitting(false);
    if (success) {
      setEditingId(null);
      onRefresh();
    }
  };

  const handleDelete = async (rowIndex: number) => {
    setSubmitting(true);
    const success = await onDelete(rowIndex);
    setSubmitting(false);
    if (success) onRefresh();
  };

  const resetAddForm = () => {
    setAdding(false);
    setNewDelight(null);
    setNewDescription("");
    setNewWildcardName("");
    setNewImageUrl(null);
  };

  const startEdit = (entry: DelightEntry) => {
    setEditingId(entry.rowIndex);
    setEditDescription(entry.description);
    setEditWildcardName(entry.wildcardName || "");
    setEditImageUrl(entry.imageUrl || null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex h-full min-h-[420px] flex-col rounded-2xl border bg-card p-4 transition-shadow duration-200 ease",
        today
          ? "border-foreground/15 shadow-[0_0_0_1px_hsl(var(--foreground)/0.05),0_4px_24px_-4px_hsl(var(--foreground)/0.08)]"
          : "border-border hover:shadow-[0_2px_12px_-4px_hsl(var(--foreground)/0.06)]",
        future && "opacity-50"
      )}
    >
      {/* Day header */}
      <div className="mb-3 flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-2xl font-medium tabular-nums",
            today ? "text-foreground" : "text-foreground/70"
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {dayNum}
        </span>
        <div className="flex flex-col">
          <span className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            today ? "text-foreground/60" : "text-muted-foreground/70"
          )}>
            {dayName}
          </span>
          <span className="text-[10px] text-muted-foreground/50">{monthName}</span>
        </div>
        {today && (
          <span className="ml-auto rounded-full bg-foreground px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground">
            Today
          </span>
        )}
      </div>

      {/* Delight entries */}
      <div className="flex-1 space-y-2.5 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.rowIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: i * 0.03 }}
              className="group relative"
            >
              {editingId === entry.rowIndex ? (
                <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-2.5">
                  <DelightChip delight={entry.delight} wildcardName={entry.wildcardName} size="sm" />
                  {entry.delight === "wildcard" && (
                    <Input
                      value={editWildcardName}
                      onChange={(e) => setEditWildcardName(e.target.value)}
                      placeholder="Wildcard name..."
                      className="h-7 text-xs"
                    />
                  )}
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="How did you indulge?"
                    className="min-h-[60px] resize-none text-xs"
                    autoFocus
                  />
                  <ImagePicker imageUrl={editImageUrl} onImageChange={setEditImageUrl} />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleUpdate(entry)}
                      disabled={submitting}
                      className="flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-primary-foreground transition-opacity duration-200 ease hover:opacity-80 disabled:opacity-40"
                    >
                      <Check size={12} /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
                    >
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <DelightChip delight={entry.delight} wildcardName={entry.wildcardName} size="sm" />
                    {isAuthenticated && (
                      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-200 ease group-hover:opacity-100">
                        <button
                          onClick={() => startEdit(entry)}
                          className="rounded-md p-1 text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
                        >
                          <PencilSimple size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.rowIndex)}
                          disabled={submitting}
                          className="rounded-md p-1 text-muted-foreground transition-colors duration-200 ease hover:text-destructive"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  {entry.imageUrl && (
                    <button
                      onClick={() => setExpandedImage(entry.imageUrl!)}
                      className="group relative w-full rounded-lg overflow-hidden transition-transform duration-200 ease hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Image
                        src={entry.imageUrl}
                        alt="Delight"
                        width={400}
                        height={112}
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 opacity-0 transition-all duration-200 ease group-hover:bg-black/10 group-hover:opacity-100 flex items-center justify-center">
                        <div className="rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity duration-200 ease group-hover:opacity-100">
                          <X size={12} className="rotate-45" />
                        </div>
                      </div>
                    </button>
                  )}
                  {entry.description && (
                    <ExpandableText text={entry.description} maxLines={2} />
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length === 0 && !adding && (
          <div className="flex h-24 items-center justify-center">
            <p className="text-[11px] text-muted-foreground/40">No delights yet</p>
          </div>
        )}
      </div>

      {/* Add new delight */}
      {isAuthenticated && !future && (
        <div className="mt-3 border-t border-border/60 pt-3">
          <AnimatePresence mode="wait">
            {adding ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="space-y-2"
              >
                {!newDelight ? (
                  <DelightSelector
                    onSelect={setNewDelight}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <DelightChip delight={newDelight} size="sm" />
                      <button
                        onClick={() => setNewDelight(null)}
                        className="text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    {newDelight === "wildcard" && (
                      <Input
                        value={newWildcardName}
                        onChange={(e) => setNewWildcardName(e.target.value)}
                        placeholder="Wildcard name..."
                        className="h-7 text-xs"
                      />
                    )}
                    <Textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="How did you indulge?"
                      className="min-h-[60px] resize-none text-xs"
                      autoFocus
                    />
                    <ImagePicker imageUrl={newImageUrl} onImageChange={setNewImageUrl} />
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleAdd}
                        disabled={submitting || (newDelight === "wildcard" && !newWildcardName)}
                        className="flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-primary-foreground transition-opacity duration-200 ease hover:opacity-80 disabled:opacity-40"
                      >
                        <Check size={12} /> Add
                      </button>
                      <button
                        onClick={resetAddForm}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors duration-200 ease hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border py-1.5 text-[11px] text-muted-foreground transition-colors duration-200 ease hover:border-foreground/20 hover:text-foreground"
              >
                <Plus size={14} weight="bold" /> Add delight
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Image Modal */}
      <ImageModal
        isOpen={!!expandedImage}
        onClose={() => setExpandedImage(null)}
        imageUrl={expandedImage || ""}
        alt="Delight"
      />
    </motion.div>
  );
}
