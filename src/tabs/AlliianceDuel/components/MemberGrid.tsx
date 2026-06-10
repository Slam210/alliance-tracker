import type { Member } from "../../../types/member";
import MemberCard from "./MemberCard";

type Props = {
  members: Member[];
  getMemberDayPoints: (memberId: string) => number | null;
  getExemptStatus: (memberId: string) => boolean;
  onSelectMember: (member: Member) => void;
  requirement: number | null;
};

export default function MemberGrid({
  members,
  getMemberDayPoints,
  getExemptStatus,
  onSelectMember,
  requirement,
}: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        gap-4
      "
    >
      {members.map((member) => {
        const dayPoints = getMemberDayPoints(member.id);
        const exemptStatus = getExemptStatus(member.id);

        return (
          <MemberCard
            key={member.id}
            member={member}
            points={dayPoints}
            exemptStatus={exemptStatus}
            onClick={() => onSelectMember(member)}
            requirement={requirement}
          />
        );
      })}
    </div>
  );
}
