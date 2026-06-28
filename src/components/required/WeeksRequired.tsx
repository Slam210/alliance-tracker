import { ReactNode } from "react";
import { Week } from "../../types/week";

type Props = {
  weeks: Week[];
  children: ReactNode;
};

export default function WeeksRequired({
  weeks,
  children,
}: Props) {
  if (weeks.length === 0) {
    return (
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="text-xl font-semibold text-amber-300">
          No Weeks Found
        </h2>
        <p className="mt-2 text-slate-300">
          Create a week before continuing.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
