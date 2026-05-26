export default function RankingRow({
  rank,
  name,
  score,
}: {
  rank: number;
  name: string;
  score: number;
}) {
  return (
    <div className="flex justify-between text-gray-300">
      <span className="flex gap-2">
        <span className="w-5 text-gray-500 text-xs text-right">{rank}</span>
        {name}
      </span>

      <span className="tabular-nums text-gray-200">
        {score.toLocaleString()}
      </span>
    </div>
  );
}
