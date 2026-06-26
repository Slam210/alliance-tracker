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

  return map[date.getDay()];
}
