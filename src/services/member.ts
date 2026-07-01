import { Member, MemberUpdate } from "../types/member";
import { apiJson, apiRequest } from "./client";

export function getMembers() {
  return apiRequest<Member[]>("/api/members");
}

export function addMember(name: string, nickname = "") {
  return apiJson("/api/members", "POST", {
    name,
    nickname,
  });
}

export function deleteMember(memberId?: string) {
  return apiJson("/api/members", "DELETE", {
    memberId,
  });
}

export function updateMember(id: string, updates: MemberUpdate) {
  return apiJson(`/api/members/${id}/update`, "PATCH", updates);
}

export function assignGroup(members: Member[]) {
  return apiJson("/api/members/groups", "PATCH", [
    ...members.map((m) => ({
      id: m.id,
      group_number: m.group_number,
      group_leader: m.group_leader,
    })),
  ]);
}

export function cancelRewardData(id: string) {
  return apiJson("/api/members/reward/cancel", "POST", { id });
}
