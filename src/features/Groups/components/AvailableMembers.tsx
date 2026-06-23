import type { Member } from "../../../types/member";
import MemberCard from "./MemberCard";

type Props = {
  members: Member[];
  nameSearch: string;
  utcGroups: number[];
  handleDrop: (memberId: string, group_number: number | null) => void;
};

export default function AvailableMembers({
  members,
  nameSearch,
  utcGroups,
  handleDrop,
}: Props) {
  return (
    <div
      className="rounded-xl border p-4"
      onDragOver={(e) => e.preventDefault()}
    >
      <h3 className="mb-4 font-semibold">Available Members</h3>

      <div
        className="flex flex-wrap gap-2 min-h-24 rounded-lg p-2"
        onDrop={(e) => {
          e.preventDefault();

          const memberId = e.dataTransfer.getData("memberId");

          handleDrop(memberId, null);
        }}
      >
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            nameSearch={nameSearch}
            utcGroups={utcGroups}
            handleDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
