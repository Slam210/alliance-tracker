import type { DayKey, EventKey } from "../../../types/week";
import { EVENT_MAP } from "./eventMap";

export type EventDay = keyof typeof EVENT_MAP;

export const EVENTS: EventKey[] = [
  "Mod Vehicle Boost",
  "Shelter Upgrade",
  "Age of Science",
  "Hero Progression",
  "Holistic Growth",
  "Enemy Buster",
  "Weekly",
];

export const DAYS: DayKey[] = [...Object.keys(EVENT_MAP)] as DayKey[];

export const EVENT_STYLES: Record<
  EventKey,
  { bg: string; text: string; ring: string }
> = {
  "Mod Vehicle Boost": {
    bg: "bg-blue-500/10",
    text: "text-blue-200",
    ring: "ring-blue-500/20",
  },
  "Shelter Upgrade": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
    ring: "ring-cyan-500/20",
  },
  "Age of Science": {
    bg: "bg-teal-500/10",
    text: "text-teal-200",
    ring: "ring-teal-500/20",
  },
  "Hero Progression": {
    bg: "bg-green-500/10",
    text: "text-green-200",
    ring: "ring-green-500/20",
  },
  "Holistic Growth": {
    bg: "bg-yellow-500/10",
    text: "text-yellow-200",
    ring: "ring-yellow-500/20",
  },
  "Enemy Buster": {
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
