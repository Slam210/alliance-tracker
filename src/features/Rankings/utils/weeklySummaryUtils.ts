import type { SpecialNoteEntry } from "../../../types/derived/specialNotes";

export type MemberSummary = {
  id: string;
  name: string;

  top10Count?: number;
  failureCount?: number;

  firstTime: boolean;

  streak?: number;
  totalAppearances?: number;

  reappearanceCount?: number;
};

export function applyCommonNoteFields(
  entry: MemberSummary,
  note: SpecialNoteEntry,
): MemberSummary {
  const updated = { ...entry };

  if (note.type === "first_time") {
    updated.firstTime = true;
  }

  if (note.type === "recurring") {
    updated.streak = Math.max(updated.streak ?? 0, note.streak ?? 0);
    updated.totalAppearances = Math.max(
      updated.totalAppearances ?? 0,
      note.totalAppearances ?? 0,
    );
  }

  if (note.type === "reappearance") {
    updated.reappearanceCount = Math.max(
      updated.reappearanceCount ?? 0,
      note.totalAppearances ?? 0,
    );
  }

  return updated;
}
