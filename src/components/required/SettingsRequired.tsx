import { AllianceSettings } from "../../types/settings";

type Props = {
  settings: AllianceSettings;
  children: React.ReactNode;
};

export default function SettingsRequired({
  settings,
  children,
}: Props) {
  const hasMissingSettings = settings === null;

  if (hasMissingSettings) {
    return (
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="text-xl font-semibold text-amber-300">
          Alliance Settings Required
        </h2>
        <p className="mt-2 text-slate-300">
          Please configure the alliance requirements in Settings before
          beginning.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
