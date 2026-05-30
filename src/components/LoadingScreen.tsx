import { Loader2 } from "lucide-react";

type Props = {
  isVisible?: boolean;
  message?: string;
};

export default function LoadingScreen({
  isVisible = true,
  message = "Loading Alliance Duel Tracker...",
}: Props) {
  return (
    <div
      className={`
        fixed inset-0 z-9999
        flex items-center justify-center
        bg-slate-900
        transition-opacity duration-500 ease-out
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        className={`
          flex flex-col items-center gap-4
          transition-all duration-500 ease-out
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <Loader2 size={56} className="animate-spin text-blue-400" />

        <div className="text-center">
          <div className="text-lg font-medium text-white">
            Alliance Duel Tracker
          </div>

          <div className="mt-1 text-sm text-slate-400">{message}</div>
        </div>
      </div>
    </div>
  );
}
