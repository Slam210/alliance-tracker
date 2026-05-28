import type { DayKey } from "../week";

export type SpecialNoteBucket = "top" | "bottom";

export type SpecialNoteType =
  | "first_time"
  | "reappearance"
  | "recurring"
  | "riser"
  | "faller";

export interface SpecialNoteEntry {
  id: string;
  name: string;

  type: SpecialNoteType;

  bucket: SpecialNoteBucket;

  currentScore: number;

  previousScore: number | null;
  previousWeek: string | null;

  streak?: number;
  totalAppearances: number;
}

export type SpecialNotesByDay = Record<DayKey, SpecialNoteEntry[]>;

export const typeStyles: Record<
  SpecialNoteType,
  Record<
    SpecialNoteBucket,
    {
      text: string;
      badge: string;
      detail: string;
    }
  >
> = {
  first_time: {
    top: {
      text: "text-sky-300",
      badge: "bg-sky-500/15 text-sky-200 border-sky-400/30",
      detail: "text-sky-300/80",
    },
    bottom: {
      text: "text-orange-300",
      badge: "bg-orange-500/10 text-orange-200 border-orange-400/25",
      detail: "text-orange-300/70",
    },
  },

  reappearance: {
    top: {
      text: "text-amber-300",
      badge: "bg-amber-500/15 text-amber-200 border-amber-400/30",
      detail: "text-amber-300/80",
    },
    bottom: {
      text: "text-yellow-400",
      badge: "bg-yellow-500/10 text-yellow-300 border-yellow-400/30",
      detail: "text-yellow-300/70",
    },
  },

  recurring: {
    top: {
      text: "text-emerald-300",
      badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
      detail: "text-emerald-300/80",
    },
    bottom: {
      text: "text-red-500",
      badge: "bg-red-600/15 text-red-300 border-red-500/40",
      detail: "text-red-300/70",
    },
  },
  riser: {
    top: {
      text: "text-cyan-300",
      badge: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
      detail: "text-cyan-300/80",
    },
    bottom: {
      text: "text-cyan-300",
      badge: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
      detail: "text-cyan-300/80",
    },
  },

  faller: {
    top: {
      text: "text-rose-300",
      badge: "bg-rose-500/10 text-rose-200 border-rose-400/30",
      detail: "text-rose-300/70",
    },
    bottom: {
      text: "text-rose-300",
      badge: "bg-rose-500/10 text-rose-200 border-rose-400/30",
      detail: "text-rose-300/70",
    },
  },
};

export const toneStyles = {
  top: {
    border: "border-emerald-500/30",
    glow: "from-emerald-500/25 via-cyan-500/10 to-transparent",
  },
  bottom: {
    border: "border-red-500/30",
    glow: "from-red-500/25 via-orange-500/10 to-transparent",
  },
};
