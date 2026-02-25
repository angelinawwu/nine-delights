export type DelightType =
  | "walking around"
  | "fellowship"
  | "deliciousness"
  | "transcendence"
  | "goofing"
  | "amelioration"
  | "decadence"
  | "enthrallment"
  | "wildcard";

export interface DelightEntry {
  rowIndex: number;
  date: string;
  delight: DelightType;
  description: string;
  wildcardName?: string;
  createdAt: string;
}

export interface DayData {
  date: string;
  entries: DelightEntry[];
}
