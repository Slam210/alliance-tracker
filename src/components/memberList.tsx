import type { Member } from "../types/member";

interface Props {
  members: Member[];
  onUpdateStatus: (id: string, status: Member["status"]) => void;
}

export default function MemberList({ members, onUpdateStatus }: Props) {
  const activeMembers = members.filter((m) => m.status === "Active");

  const inactiveMembers = members.filter((m) => m.status === "Inactive");

  const renderMember = (member: Member) => (
    <div
      key={member.id}
      className="flex items-center justify-between p-3 rounded bg-gray-800 text-white"
    >
      {/* LEFT */}
      <div className="flex flex-col">
        <div className="font-semibold">
          {member.name}
          {member.nickname && (
            <span className="text-gray-400 font-normal">
              {" "}
              ({member.nickname})
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400 mt-1">
          Joined: {new Date(member.joinDate).toLocaleDateString()}
        </div>

        <span
          className={`text-sm mt-1 inline-block w-fit px-2 py-0.5 rounded ${
            member.status === "Active" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {member.status}
        </span>
      </div>

      {/* RIGHT: only opposite action */}
      {member.status === "Active" ? (
        <button
          onClick={() => onUpdateStatus(member.id, "Inactive")}
          className="px-3 py-1 rounded text-sm text-red-400 hover:bg-red-500 hover:text-black transition"
        >
          Remove
        </button>
      ) : (
        <button
          onClick={() => onUpdateStatus(member.id, "Active")}
          className="px-3 py-1 rounded text-sm text-green-400 hover:bg-green-500 hover:text-black transition"
        >
          Rejoin
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ACTIVE */}
      <div className="space-y-3">{activeMembers.map(renderMember)}</div>

      {/* INACTIVE */}
      {inactiveMembers.length > 0 && (
        <div className="pt-6 border-t border-gray-700 space-y-3 opacity-70">
          <div className="text-center text-gray-400 text-sm">
            Inactive Members
          </div>

          {inactiveMembers.map(renderMember)}
        </div>
      )}
    </div>
  );
}
