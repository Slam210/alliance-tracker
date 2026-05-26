import type { Member } from "../../../types/member";
import MemberCard from "./MemberCard";

type Props = {
  members: Member[];
  getMemberDayPoints: (memberId: string) => number | null;
  onSelectMember: (member: Member) => void;
};

export default function MemberGrid({
  members,
  getMemberDayPoints,
  onSelectMember,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {members.map((member) => {
        const dayPoints = getMemberDayPoints(member.id);

        return (
          <MemberCard
            key={member.id}
            member={member}
            points={dayPoints}
            onClick={() => onSelectMember(member)}
          />
        );
      })}
    </div>
  );
}
