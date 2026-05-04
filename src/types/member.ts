export type MemberStatus = "Active" | "Inactive";

export interface Member {
  id: string;
  name: string;
  nickname?: string;
  status: MemberStatus;
  joinDate: string;
}
