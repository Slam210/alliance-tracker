import type { PointRule } from "../types/derived/eos";
import type { AdjustmentLog, adjustmentType } from "../types/log";
import type { Member } from "../types/member";
import type { StateRulerResponse } from "../types/stateRuler";
import type { EntryType, Week } from "../types/week";

export type MemberUpdate = Partial<{
  status: string;
  name: string;
  nickname: string;
  timezone: string;
  display_name: string;
  eos_reward: string;
}>;

export function getWeekNumber(date: Date) {
  const start = new Date("2026-04-20");
  start.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d.getDay() === 0) {
    d.setDate(d.getDate() - 1);
  }

  const diffDays = Math.floor(
    (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return Math.floor(diffDays / 7) + 1;
}

export async function getMembers() {
  const res = await fetch("/api/members", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load members");
  }

  return res.json();
}

export async function addMember(name: string, nickname = "") {
  const res = await fetch("/api/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      nickname,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to add member");
  }

  return data;
}

export async function updateMember(id: string, updates: MemberUpdate) {
  const res = await fetch(`/api/members/${id}/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to update member");
  }

  return data;
}

export async function assignGroup(members: Member[]) {
  const res = await fetch("/api/members/groups", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(
      members.map((m) => ({
        id: m.id,
        group_number: m.group_number,
        group_leader: m.group_leader,
      })),
    ),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to assign groups");
  }

  return data;
}

export async function getAllAllianceDuelWeeks(): Promise<{
  weeks: Week[];
}> {
  const res = await fetch("/api/alliance-duel/weeks", {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to load alliance duel weeks");
  }

  return data;
}

export async function submitAllianceDuel(payload: {
  id: string;
  name: string;
  entryType: EntryType;
  date: Date;
  points: number;
  exception: boolean;
}) {
  const res = await fetch("/api/alliance-duel/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
}

export async function submitAllianceDuelBatch(
  entries: {
    id: string;
    name: string;
    entryType: EntryType;
    date: Date;
    points: number;
    exception: boolean;
  }[],
) {
  const res = await fetch("/api/alliance-duel/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(entries),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
}

export async function getAllStateRulers(): Promise<{
  data: StateRulerResponse;
}> {
  const res = await fetch("/api/state-ruler", {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}

export async function submitStateRuler({
  id,
  sr_week,
  type,
  progressRank,
  progressScore,
  clashRank,
  clashScore,
}: {
  id: string;
  srWeek: number;
  type: "progress" | "clash" | "both";
  progressRank?: number;
  progressScore?: number;
  clashRank?: number;
  clashScore?: number;
}) {
  const response = await fetch("/api/state-ruler/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      sr_week,
      type,
      progressRank,
      progressScore,
      clashRank,
      clashScore,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function getPointRules(): Promise<PointRule[]> {
  const res = await fetch("/api/point-rules", {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch point rules");
  }

  return data;
}

export async function cancelRewardData(id: string) {
  const res = await fetch("/api/members/reward/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to cancel reward data");
  }

  return data;
}

export async function getLogs(): Promise<AdjustmentLog[]> {
  const res = await fetch("/api/logs", {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch logs");
  }

  return data;
}

export async function addAdjustmentLog(
  memberID: string,
  adjustmentType: adjustmentType,
  count: number,
  points: number,
  reason: string,
) {
  const res = await fetch("/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      memberID,
      adjustmentType,
      count,
      points,
      reason,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}

export async function deleteAdjustmentLog(logID: string) {
  const res = await fetch("/api/logs", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      logID,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}
