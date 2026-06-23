import { getDayKey } from "../features/AlliianceDuel/utils/getDayKey";
import { supabase } from "../lib/supabase";
import type { eos_rewardGroup, PointRule } from "../types/derived/eos";
import type { AdjustmentLog, adjustmentType } from "../types/log";
import type { Member } from "../types/member";
import type { StateRulerResponse } from "../types/stateRuler";
import type { EntryType, Week } from "../types/week";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function post<T>(body: unknown): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", text);
    throw new Error("Server returned invalid JSON");
  }
}

function getWeekNumber(date: Date) {
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
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}

export async function addMember(name: string, nickname = "") {
  const member = {
    id: crypto.randomUUID(),
    name,
    nickname,
    status: "Active",
    joined_date: new Date().toISOString(),
    reason: "",
    timezone: "",
    display_name: "",
    group_number: null,
    group_leader: false,
    eos_reward: "",
  };

  const { data, error } = await supabase
    .from("members")
    .upsert(member)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("members")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    status: "updated",
    member: data,
  };
}

export async function renameMember(
  id: string,
  name: string,
  nickname: string,
  timezone: string,
  display_name: string,
) {
  const updates: {
    name?: string;
    nickname?: string;
    timezone?: string;
    display_name?: string;
  } = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (nickname !== undefined) {
    updates.nickname = nickname;
  }

  if (timezone !== undefined) {
    updates.timezone = timezone;
  }

  if (display_name !== undefined) {
    updates.display_name = display_name;
  }

  const { data, error } = await supabase
    .from("members")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      error: "member not found",
    };
  }

  return {
    status: "renamed",
    member: data,
  };
}

export async function assignGroup(members: Member[]) {
  const updates = members.map((member) => ({
    id: member.id,
    name: member.name,
    nickname: member.nickname ?? null,
    status: member.status ?? "Active",

    group_number: member.group_number ?? null,
    group_leader: member.group_leader ?? false,
  }));

  const { error } = await supabase.from("members").upsert(updates, {
    onConflict: "id",
  });

  if (error) {
    throw error;
  }

  return {
    status: "Group information assigned",
    updated: updates.length,
  };
}

export async function getAllAllianceDuelWeeks(): Promise<{ weeks: Week[] }> {
  const { data, error } = await supabase.rpc("get_all_alliance_duel_weeks");

  if (error) {
    throw error;
  }

  return data;
}

export async function submitAllianceDuel({
  id,
  entryType,
  date,
  points,
  exception,
}: {
  id: string;
  name: string;
  entryType: EntryType;
  date: Date;
  points: number;
  exception: boolean;
}) {
  const weekNumber = getWeekNumber(date);
  const day = getDayKey(date);

  const { data, error } = await supabase.rpc("submit_alliance_duel", {
    p_member_id: id,
    p_entry_type: entryType,
    p_week_number: weekNumber,
    p_day: day,
    p_points: points,
    p_exception: exception,
  });

  if (error) {
    throw error;
  }

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
  const payload = entries.map((entry) => ({
    member_id: entry.id,
    entry_type: entry.entryType,
    week_number: getWeekNumber(entry.date),
    day: getDayKey(entry.date),
    points: entry.points,
    exception: entry.exception,
  }));

  const { data, error } = await supabase.rpc("submit_alliance_duel_batch", {
    p_entries: payload,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllStateRulers(): Promise<{
  data: StateRulerResponse;
}> {
  const { data, error } = await supabase
    .from("state_rulers")
    .select(
      `
    sr_id,
    state_ruler_entries (
      member_id,
      progress_rank,
      progress_score,
      clash_rank,
      clash_score,
      last_updated,
      members (
        name,
        nickname
      )
    )
  `,
    )
    .order("sr_id");

  if (error) {
    throw error;
  }

  const result: StateRulerResponse = {};

  for (const sr of data ?? []) {
    result[`SR${sr.sr_id}`] = sr.state_ruler_entries.map((entry) => ({
      id: entry.member_id,

      progressRank: entry.progress_rank,
      progressScore: entry.progress_score,

      clashRank: entry.clash_rank,
      clashScore: entry.clash_score,

      lastUpdated: entry.last_updated,
    }));
  }

  return {
    data: result,
  };
}

export async function submitStateRuler({
  id,
  type,
  sheetName,
  progressRank,
  progressScore,
  clashRank,
  clashScore,
}: {
  id: string;
  type: string;
  sheetName: string;
  progressRank?: number;
  progressScore?: number;
  clashRank?: number;
  clashScore?: number;
}) {
  const srID = Number(sheetName.replace("SR", ""));

  const { data, error } = await supabase.rpc("submit_state_ruler", {
    p_member_id: id,
    p_type: type,
    p_sr_id: srID,
    p_progress_rank: progressRank ?? null,
    p_progress_score: progressScore ?? null,
    p_clash_rank: clashRank ?? null,
    p_clash_score: clashScore ?? null,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getPointRules(): Promise<PointRule[]> {
  const { data, error } = await supabase
    .from("point_rules")
    .select(
      `
      system,
      type,
      min_rank,
      max_rank,
      requires_requirement,
      points
    `,
    )
    .order("system")
    .order("type");

  if (error) {
    throw error;
  }

  return (data ?? []).map((rule) => ({
    system: rule.system,
    type: rule.type,
    minRank: rule.min_rank,
    maxRank: rule.max_rank,
    requiresRequirement: rule.requires_requirement,
    points: rule.points,
  }));
}

export async function submitRewardData(
  id: string,
  eos_reward: eos_rewardGroup,
) {
  const updates: {
    eos_reward?: eos_rewardGroup;
  } = {};

  console.log(updates);

  if (eos_reward !== undefined) {
    updates.eos_reward = eos_reward;
  }

  const { data, error } = await supabase
    .from("members")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      error: "member not found",
    };
  }

  return {
    status: "Reward data set",
  };
}

export async function cancelRewardData(id: string) {
  const { data, error } = await supabase
    .from("members")
    .update({
      eos_reward: null,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      error: "member not found",
    };
  }

  return {
    status: "Reward data reset",
  };
}

export async function getLogs(): Promise<AdjustmentLog[]> {
  const { data, error } = await supabase
    .from("adjustment_logs")
    .select("*")
    .order("issued_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((log) => ({
    type: "adjustment",
    logID: log.id,
    memberID: log.member_id,
    name: log.name,
    nickname: log.nickname,
    issuedAt: log.issued_at,
    adjustmentType: log.adjustment_type,
    count: log.count,
    points: log.points,
    reason: log.reason,
  }));
}

export async function addAdjustmentLog(
  memberID: string,
  name: string,
  nickname: string | null,
  adjustmentType: adjustmentType,
  count: number,
  points: number,
  reason: string,
) {
  const { error } = await supabase.from("adjustment_logs").insert({
    member_id: memberID,
    name,
    nickname,
    adjustment_type: adjustmentType,
    count,
    points,
    reason,
  });

  if (error) {
    throw error;
  }

  return {
    status: "Added log",
  };
}

export async function deleteAdjustmentLog(logID: string) {
  const { data, error } = await supabase
    .from("adjustment_logs")
    .delete()
    .eq("id", logID)
    .select();

  if (error) {
    throw error;
  }

  if (!data?.length) {
    return {
      error: "log not found",
    };
  }

  return {
    status: "deleted",
  };
}
