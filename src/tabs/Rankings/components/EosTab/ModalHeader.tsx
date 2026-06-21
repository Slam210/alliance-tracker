import { X } from "lucide-react";
import type { MemberWithPoints } from "../../../../types/derived/eos";

type Props = {
  member: MemberWithPoints;
  onClose: () => void;
};

export default function ModalHeader({ member, onClose }: Props) {
  return (
    <div className="relative border-b border-slate-700/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {member.nickname || member.name}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Joined {new Date(member.joinDate).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={onClose}
          className="
            rounded-xl
            border border-slate-700
            bg-slate-800
            p-2
            text-slate-400
            transition
            hover:border-red-500/50
            hover:bg-slate-700
            hover:text-red-400
          "
        >
          <X size={18} />
        </button>
      </div>

      <div
        className="
          mt-4
          rounded-2xl
          border border-slate-700/60
          bg-slate-800/50
          p-4
        "
      >
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Total EOS Points
        </div>

        <div className="mt-1 text-3xl font-bold text-blue-400">
          {member.points.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
