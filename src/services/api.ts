import type { EosRewardGroup, PointRule } from "../types/derived/eos";
import type { AdjustmentLog, adjustmentType } from "../types/log";
import type { Member } from "../types/member";
import type { StateRulerResponse } from "../types/stateRuler";
import type { EntryType, Week } from "../types/week";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

async function post<T>(body: unknown): Promise<T> {
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

export async function getMembers(): Promise<Member[]> {
  const data = await post<{ members: Member[] }>({
    action: "getMembers",
  });

  return data.members;
}

export async function addMember(name: string, nickname?: string) {
  return post({
    action: "addMember",
    name,
    nickname,
  });
}

export async function updateStatus(id: string, status: string) {
  return post({
    action: "updateStatus",
    id,
    status,
  });
}

export async function renameMember(
  id: string,
  name?: string,
  nickname?: string,
  timezone?: string,
  displayName?: string,
) {
  return post({
    action: "renameMember",
    id,
    name,
    nickname,
    timezone,
    displayName,
  });
}

export async function assignGroup(members: Member[]) {
  return post({
    action: "assignGroup",
    members,
  });
}

export async function submitAllianceDuel({
  id,
  name,
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
  return post<{ status: string }>({
    action: "allianceDuelSubmit",
    id,
    name,
    entryType,
    date: date.toISOString(),
    points,
    exception,
  });
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
  return post<{ status: string }>({
    action: "allianceDuelBatchSubmit",
    entries,
  });
}

export async function getAllAllianceDuelWeeks(): Promise<{ weeks: Week[] }> {
  return post({
    action: "getAllAllianceDuelWeeks",
  });
}

export async function getAllStateRulers(): Promise<{
  data: StateRulerResponse;
}> {
  return post({
    action: "getAllStateRulers",
  });
}

export async function submitStateRuler({
  id,
  type,
  sheetName,
  name,
  progressRank,
  progressScore,
  clashRank,
  clashScore,
}: {
  id: string;
  name: string;
  type: string;
  sheetName: string;
  progressRank?: number;
  progressScore?: number;
  clashRank?: number;
  clashScore?: number;
}) {
  return post<{ status: string }>({
    action: "submitStateRuler",
    id,
    name,
    type,
    sheetName,
    progressRank,
    progressScore,
    clashRank,
    clashScore,
  });
}

export async function getPoints(): Promise<PointRule[]> {
  const data = await post<{ points: PointRule[] }>({
    action: "getPoints",
  });
  return data.points;
}

export async function submitRewardData(id: string, eosReward: EosRewardGroup) {
  return post({
    action: "submitRewardData",
    id,
    eosReward,
  });
}

export async function cancelRewardData(id: string) {
  return post({
    action: "cancelRewardData",
    id,
  });
}

export async function getLogs(): Promise<AdjustmentLog[]> {
  const data = await post<{ logs: AdjustmentLog[] }>({
    action: "getLogs",
  });
  return data.logs;
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
  return post({
    action: "addLog",
    memberID,
    name,
    nickname,
    adjustmentType,
    count,
    points,
    reason,
  });
}

export async function deleteAdjustmentLog(logID: string) {
  console.log(logID);
  return post({
    action: "deleteLog",
    logID,
  });
}
