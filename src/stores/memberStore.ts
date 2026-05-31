import type { Member } from "../types/member";

let memberMap = new Map<string, string | null>();

export function setMemberNicknames(members: Member[]) {
  memberMap = new Map(members.map((m) => [m.id, m.nickname ?? null]));
}

export function getMemberNickname(id: string): string | null {
  return memberMap.get(id) ?? null;
}
