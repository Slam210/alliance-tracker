import type { Member } from "../../../types/member";

type Props = {
  member: Member;
  points: number | null;
  onClick: () => void;
};

export default function MemberCard({ member, points, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex justify-between items-center p-3 rounded border bg-gray-700 border-gray-600 hover:bg-gray-600 text-left"
    >
      <div>
        <div className="font-bold text-white">{member.name}</div>

        <div className="text-sm text-gray-300">
          {member.nickname || "No nickname"}
        </div>
      </div>

      <div className="text-right">
        {points != null ? (
          <div className="text-green-400 font-bold">
            {points.toLocaleString()}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">—</div>
        )}
      </div>
    </button>
  );
}
