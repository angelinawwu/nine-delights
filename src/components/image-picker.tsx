"use client";

import { useState, useRef } from "react";
import { Camera, ImageSquare, X, SpinnerGap } from "@phosphor-icons/react";
import Image from "next/image";
import { ImageModal } from "./image-modal";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  className?: string;
}

export function ImagePicker({ imageUrl, onImageChange, className }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onImageChange(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
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
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => galleryRef.current?.click()}
        className="flex items-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors duration-200 ease hover:border-foreground/20 hover:text-foreground disabled:opacity-40"
      >
        {uploading ? (
          <SpinnerGap size={12} className="animate-spin" />
        ) : (
          <ImageSquare size={12} />
        )}
        Gallery
      </button>
      <button
        type="button"
        disabled={uploading}
        onClick={() => cameraRef.current?.click()}
        className="flex items-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors duration-200 ease hover:border-foreground/20 hover:text-foreground disabled:opacity-40"
      >
        {uploading ? (
          <SpinnerGap size={12} className="animate-spin" />
        ) : (
          <Camera size={12} />
        )}
        Camera
      </button>
    </div>
  );
}
