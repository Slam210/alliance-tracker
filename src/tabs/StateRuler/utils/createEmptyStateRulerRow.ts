import type { Member } from "../../../types/member";

export function createEmptyStateRulerRow(member: Member) {
  return {
    id: member.id,
    name: member.name,
    progressRank: null,
    progressScore: null,
    clashRank: null,
    clashScore: null,
    lastUpdated: null,
  };
}
