export function getSuccessRepeatColor(count: number) {
  if (count >= 7)
    return "border-emerald-400/70 bg-emerald-500/15 text-emerald-200";
  if (count >= 6) return "border-green-400/70 bg-green-500/15 text-green-200";
  if (count >= 5) return "border-lime-400/70 bg-lime-500/15 text-lime-200";
  if (count >= 4) return "border-cyan-400/70 bg-cyan-500/15 text-cyan-200";
  if (count >= 3) return "border-blue-400/70 bg-blue-500/15 text-blue-200";
  if (count >= 2)
    return "border-indigo-400/70 bg-indigo-500/15 text-indigo-200";

  return "border-gray-700 bg-gray-900 text-gray-300";
}

export function getFailureRepeatColor(count: number) {
  if (count >= 7) return "border-red-500/70 bg-red-500/15 text-red-200";
  if (count >= 6)
    return "border-orange-500/70 bg-orange-500/15 text-orange-200";
  if (count >= 5) return "border-amber-500/70 bg-amber-500/15 text-amber-200";
  if (count >= 4)
    return "border-yellow-500/70 bg-yellow-500/15 text-yellow-200";
  if (count >= 3)
    return "border-fuchsia-500/70 bg-fuchsia-500/15 text-fuchsia-200";
  if (count >= 2) return "border-pink-500/70 bg-pink-500/15 text-pink-200";

  return "border-gray-700 bg-gray-900 text-gray-300";
}
