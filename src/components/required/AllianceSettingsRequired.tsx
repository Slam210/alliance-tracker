import { ReactNode } from "react";
import { AllianceSettings } from "../../types/settings";

type Props = {
  settings: AllianceSettings;
  children: ReactNode;
};

export default function AllianceSettingsRequired({
  settings,
  children,
}: Props) {
  if (settings.start_requirements.some((r) => r === null)) {
    return (
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="text-xl font-semibold text-amber-300">
          Alliance Settings Required
        </h2>
        <p className="mt-2 text-slate-300">
          Configure the alliance requirements before continuing.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
