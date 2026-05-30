import type { DayKey } from "../../../types/week";
import { EVENT_MAP } from "./eventMap";

export type EventDay = keyof typeof EVENT_MAP;

export const DAYS: DayKey[] = [...Object.keys(EVENT_MAP), "Weekly"] as DayKey[];

export const DAY_STYLES: Record<
  DayKey,
  { bg: string; text: string; ring: string }
> = {
  Mon: {
    bg: "bg-blue-500/10",
    text: "text-blue-200",
    ring: "ring-blue-500/20",
  },
  Tue: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
    ring: "ring-cyan-500/20",
  },
  Wed: {
    bg: "bg-teal-500/10",
    text: "text-teal-200",
    ring: "ring-teal-500/20",
  },
  Thu: {
    bg: "bg-green-500/10",
    text: "text-green-200",
    ring: "ring-green-500/20",
  },
  Fri: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-200",
    ring: "ring-yellow-500/20",
  },
  Sat: {
    bg: "bg-orange-500/10",
    text: "text-orange-200",
    ring: "ring-orange-500/20",
  },
  Weekly: {
    bg: "bg-purple-500/10",
    text: "text-purple-200",
    ring: "ring-purple-500/20",
  },
};
