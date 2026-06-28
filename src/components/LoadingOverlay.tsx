import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  text?: string;
};

export default function LoadingOverlay({
  open,
  text = "Loading...",
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-900 px-8 py-6 shadow-2xl border border-white/10">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        <p className="text-white font-medium">{text}</p>
      </div>
    </div>
  );
}
