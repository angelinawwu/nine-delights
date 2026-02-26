"use client";

import { useState } from "react";
import { ImageSquare, X } from "@phosphor-icons/react";
import Image from "next/image";
import { ImageModal } from "./image-modal";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  className?: string;
}

export function ImagePicker({ imageUrl, onImageChange, className }: ImagePickerProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState("");

  const handleUrlSubmit = () => {
    if (inputUrl.trim()) {
      onImageChange(inputUrl.trim());
      setInputUrl("");
    }
  };

  if (imageUrl) {
    return (
      <>
        <div className={cn("relative group/img", className)}>
          <button
            onClick={() => setExpandedImage(imageUrl)}
            className="w-full h-20 rounded-lg overflow-hidden transition-transform duration-200 ease hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image
              src={imageUrl}
              alt="Delight"
              width={320}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
          <button
            type="button"
            onClick={() => onImageChange(null)}
            className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity duration-200 ease group-hover/img:opacity-100"
          >
            <X size={12} />
          </button>
        </div>
        <ImageModal
          isOpen={!!expandedImage}
          onClose={() => setExpandedImage(null)}
          imageUrl={expandedImage || ""}
          alt="Delight"
        />
      </>
    );
  }

  return (
    <div className={cn("flex gap-1.5", className)}>
      <input
        type="url"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
        placeholder="Image URL..."
        className="flex-1 rounded-md border border-border px-2 py-1 text-[11px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
      />
      <button
        type="button"
        onClick={handleUrlSubmit}
        disabled={!inputUrl.trim()}
        className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors duration-200 ease hover:border-foreground/20 hover:text-foreground disabled:opacity-40"
      >
        <ImageSquare size={12} />
        Add
      </button>
    </div>
  );
}
