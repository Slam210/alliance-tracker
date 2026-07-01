import type { Member } from "../../types/member";

let memberMap: Map<string, string | null> | null = null;

export function buildMemberIndex(members: Member[]) {
  memberMap = new Map(members.map((m) => [m.id, m.nickname ?? null]));
}

export function getMemberNickname(id: string): string | null {
  if (!memberMap) return null;
  return memberMap.get(id) ?? null;
}

export function clearMemberIndex() {
  memberMap = null;
}
