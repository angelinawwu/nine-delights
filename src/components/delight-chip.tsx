"use client";

import { DelightType } from "@/lib/types";
import { getDelightConfig, getDelightDisplayName } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DelightChipProps {
  delight: DelightType;
  wildcardName?: string;
  size?: "sm" | "md";
  className?: string;
  onRemove?: () => void;
}

export function DelightChip({
  delight,
  wildcardName,
  size = "sm",
  className,
  onRemove,
}: DelightChipProps) {
  const config = getDelightConfig(delight);
  const displayName = getDelightDisplayName({ delight, wildcardName });

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium transition-colors duration-200 ease",
        size === "sm" && "px-2 py-0.5 text-[11px]",
        size === "md" && "px-2.5 py-1 text-xs",
        className
      )}
      style={{
        backgroundColor: `${config.color}18`,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {displayName}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 transition-colors duration-200 ease hover:bg-black/10"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

export function DelightDot({ delight }: { delight: DelightType }) {
  const config = getDelightConfig(delight);
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: config.color }}
      title={config.label}
    />
  );
}
