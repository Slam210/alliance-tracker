type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function MemberSearch({ search, setSearch }: Props) {
  return (
    <div className="relative">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search member..."
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />
    </div>
  );
}
