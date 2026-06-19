type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchMember({ search, setSearch }: Props) {
  return (
    <div className="mt-4 flex items-center gap-2 w-full my-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search members..."
        className="
            w-full
            rounded-lg border border-slate-600
            bg-slate-800 px-3 py-2
            text-sm text-white
            outline-none
            focus:border-slate-400
          "
      />

      {search && (
        <button
          onClick={() => setSearch("")}
          className="
              rounded-lg px-3 py-2 text-sm
              text-slate-300 hover:text-white
              border border-slate-700 hover:border-slate-500
            "
        >
          Clear
        </button>
      )}
    </div>
  );
}
