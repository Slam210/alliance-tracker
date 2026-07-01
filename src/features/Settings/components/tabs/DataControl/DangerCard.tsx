type DangerCardProps = {
  title: string;
  description: string;
  loading?: boolean;
  onDelete: () => void;
};

export default function DangerCard({
  title,
  description,
  loading,
  onDelete,
}: DangerCardProps) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>

      <button
        disabled={loading}
        onClick={onDelete}
        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500 disabled:opacity-50"
      >
        Delete All
      </button>
    </div>
  );
}
