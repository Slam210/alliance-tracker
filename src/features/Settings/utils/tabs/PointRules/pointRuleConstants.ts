export type SortField =
  | "system"
  | "type"
  | "minRank"
  | "maxRank"
  | "requiresRequirement"
  | "points";

export const RANK_REQUIRED_TYPES = new Set([
  "rank",
  "progress",
  "clash",
]);

/**
 * Core system definitions
 */
export const SYSTEMS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "stateruler", label: "State Ruler" },
  { value: "eos", label: "End of Season" },
] as const;

export type SystemType = (typeof SYSTEMS)[number]["value"];

/**
 * Rule types per system
 */
export const TYPES = {
  daily: [
    { value: "rank", label: "Rank" },
    { value: "participation", label: "Participation" },
    { value: "below_req", label: "Below Requirement" },
  ],
  weekly: [
    { value: "rank", label: "Rank" },
    { value: "participation", label: "Participation" },
    { value: "below_req", label: "Below Requirement" },
  ],
  stateruler: [
    { value: "progress", label: "Progress" },
    { value: "clash", label: "Clash" },
    { value: "participation", label: "Participation" },
  ],
  eos: [
    { value: "group_leader", label: "Group Leader" },
  ],
} as const satisfies Record<SystemType, readonly { value: string; label: string }[]>;

/**
 * Derived union of all valid rule types
 */
export type RuleType =
  (typeof TYPES)[SystemType][number]["value"];

/**
 * Shared input styles
 */
export const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

export const numberClass = inputClass;
