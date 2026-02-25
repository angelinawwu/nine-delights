import { DelightType } from "./types";

export const DELIGHTS: { type: DelightType; label: string; cssVar: string; color: string }[] = [
  { type: "walking around", label: "Walking Around", cssVar: "--delight-walking", color: "#7EC8A0" },
  { type: "fellowship", label: "Fellowship", cssVar: "--delight-fellowship", color: "#F4A261" },
  { type: "deliciousness", label: "Deliciousness", cssVar: "--delight-deliciousness", color: "#E76F51" },
  { type: "transcendence", label: "Transcendence", cssVar: "--delight-transcendence", color: "#A78BFA" },
  { type: "goofing", label: "Goofing", cssVar: "--delight-goofing", color: "#FBBF24" },
  { type: "amelioration", label: "Amelioration", cssVar: "--delight-amelioration", color: "#60A5FA" },
  { type: "decadence", label: "Decadence", cssVar: "--delight-decadence", color: "#F472B6" },
  { type: "enthrallment", label: "Enthrallment", cssVar: "--delight-enthrallment", color: "#34D399" },
  { type: "wildcard", label: "Wildcard", cssVar: "--delight-wildcard", color: "#818CF8" },
];

export function getDelightConfig(type: DelightType) {
  return DELIGHTS.find((d) => d.type === type)!;
}

export function getDelightDisplayName(entry: { delight: DelightType; wildcardName?: string }) {
  if (entry.delight === "wildcard" && entry.wildcardName) {
    return `Wildcard: ${entry.wildcardName}`;
  }
  return getDelightConfig(entry.delight).label;
}
