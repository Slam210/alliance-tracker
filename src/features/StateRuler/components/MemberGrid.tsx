import type { Member } from "../../../types/member";
import type { StateRulerWeek } from "../../../types/stateRuler";

import MemberCard from "./MemberCard";

type Props = {
  members: Member[];
  currentWeek: StateRulerWeek;
  onSelect: (member: Member) => void;
  onDelete: (member: Member | null) => void;
};

export default function MemberGrid({ members, currentWeek, onSelect, onDelete }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
      {members.map((member) => {
        const row = currentWeek.rows.find((r) => r.id === member.id);

        return (
          <MemberCard
            key={member.id}
            member={member}
            row={row}
            onClick={() => onSelect(member)}
            onDelete={() => onDelete(member)}
          />
        );
      })}
    </div>
  );
}
