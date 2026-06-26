import type { Member } from "../../../types/member";
import MemberCard from "./MemberCard";

type Props = {
  members: Member[];
  getMemberEventPoints: (memberId: string) => number | null;
  getExemptStatus: (memberId: string) => boolean;
  selectedDate: Date | null;
  onSelectMember: (member: Member) => void;
  requirement: number | null;
  startDate: Date
};

export default function MemberGrid({
  members,
  getMemberEventPoints,
  getExemptStatus,
  selectedDate,
  onSelectMember,
  requirement,
  startDate,
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
        const eventPoints = getMemberEventPoints(member.id);
        const exemptStatus = getExemptStatus(member.id);

        return (
          <MemberCard
            key={member.id}
            member={member}
            points={eventPoints}
            exemptStatus={exemptStatus}
            onClick={() => onSelectMember(member)}
            requirement={requirement}
            selectedDate={selectedDate}
            startDate={startDate}
          />
        );
      })}
    </div>
  );
}
