import { ReactNode } from "react";
import { Member } from "../../types/member";

type Props = {
  members: Member[];
  children: ReactNode;
};

export default function MembersRequired({
  members,
  children,
}: Props) {
  if (members.filter((member) => member.status === "Active").length === 0) {
    return (
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="text-xl font-semibold text-amber-300">
          No Active Members Found
        </h2>
        <p className="mt-2 text-slate-300">
          Add members before continuing.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
