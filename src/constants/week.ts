import { EventKey } from "../types/week";

export const EVENT_INDEX: Record<EventKey, number> = {
  "Mod Vehicle Boost": 0,
  "Shelter Upgrade": 1,
  "Age of Science": 2,
  "Hero Progression": 3,
  "Holistic Growth": 4,
  "Enemy Buster": 5,
  Weekly: 6,
};

export function getEventKey(date: Date): EventKey {
  const map: Record<number, EventKey> = {
    0: "Mod Vehicle Boost",
    1: "Shelter Upgrade",
    2: "Age of Science",
    3: "Hero Progression",
    4: "Holistic Growth",
    5: "Enemy Buster",
    6: "Weekly",
  };

  const idx = getAllianceEventIndex(date);

  return map[idx];
}

export function getEventIndex(date: Date): number {
  // shift JS Sunday-based index → Monday-based index
  return (date.getDay() + 6) % 7;
}

export const ALLIANCE_START_DATE = new Date(2026, 4, 4);

const MS_PER_DAY = 86_400_000;

function toLocalDayNumber(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(d.getTime() / MS_PER_DAY);
}

export function getAllianceEventIndex(date: Date): number {
  const start = toLocalDayNumber(ALLIANCE_START_DATE);
  const current = toLocalDayNumber(date);

  const diffDays = current - start;

  return ((diffDays % 7) + 7) % 7;
}

export function getEventFromDate(date: Date) {
  return EVENT_CYCLE[getAllianceEventIndex(date)];
}

const EVENT_CYCLE = [
  "Mod Vehicle Boost", // 0
  "Shelter Upgrade", // 1
  "Age of Science", // 2
  "Hero Progression", // 3
  "Holistic Growth", // 4
  "Enemy Buster", // 5
  "Weekly", // 6
] as const;