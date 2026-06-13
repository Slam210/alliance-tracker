type Props = {
  displayNameFilter: string[];
  timezoneFilter: string[];
  offsetFilter: string[];

  displayNames: (string | undefined)[];
  timezones: (string | undefined)[];
  offsets: string[];

  setDisplayNameFilter: React.Dispatch<React.SetStateAction<string[]>>;
  setTimezoneFilter: React.Dispatch<React.SetStateAction<string[]>>;
  setOffsetFilter: React.Dispatch<React.SetStateAction<string[]>>;

  clearFilters: () => void;
};

export default function GroupFilters({
  displayNameFilter,
  timezoneFilter,
  displayNames,
  timezones,
  setDisplayNameFilter,
  setTimezoneFilter,
  clearFilters,
  offsetFilter,
  setOffsetFilter,
  offsets,
}: Props) {
  const toggleDisplayName = (name: string) => {
    setDisplayNameFilter((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name],
    );
  };

  const toggleTimezone = (timezone: string) => {
    setTimezoneFilter((current) =>
      current.includes(timezone)
        ? current.filter((tz) => tz !== timezone)
        : [...current, timezone],
    );
  };

  const toggleOffset = (offset: string) => {
    setOffsetFilter((current) =>
      current.includes(offset)
        ? current.filter((o) => o !== offset)
        : [...current, offset],
    );
  };

  const hasFilters =
    displayNameFilter.length > 0 ||
    timezoneFilter.length > 0 ||
    offsetFilter.length > 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-linear-to-br from-slate-800/80 to-slate-950/90 p-6 shadow-xl shadow-black/40 backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold uppercase tracking-widest text-slate-300">
          Filters
        </h2>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-slate-400 transition hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* UTC Offsets */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Universal Coordinated Time (UTC) Offsets
          </div>

          <div className="flex flex-wrap gap-2">
            {offsets
              .sort((a, b) => a.localeCompare(b))
              .slice(1, offsets.length)
              .map((offset) => {
                const label = offset;
                const selected = offsetFilter.includes(label);

                return (
                  <button
                    key={offset}
                    type="button"
                    onClick={() => toggleOffset(label)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition
              ${
                selected
                  ? "border-blue-500/40 bg-blue-500/20 text-blue-200"
                  : "border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
                  >
                    {label}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Display Names */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Timezone Group Names
          </div>

          <div className="flex flex-wrap gap-2">
            {displayNames
              .filter((name): name is string => !!name)
              .map((name) => {
                const selected = displayNameFilter.includes(name);

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleDisplayName(name)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition
                      ${
                        selected
                          ? "border-blue-500/40 bg-blue-500/20 text-blue-200"
                          : "border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                  >
                    {name}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Timezones */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Individual Timezones
          </div>

          <div className="flex flex-wrap gap-2">
            {timezones
              .filter((tz): tz is string => !!tz)
              .map((timezone) => {
                const selected = timezoneFilter.includes(timezone);

                return (
                  <button
                    key={timezone}
                    type="button"
                    onClick={() => toggleTimezone(timezone)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition
                      ${
                        selected
                          ? "border-blue-500/40 bg-blue-500/20 text-blue-200"
                          : "border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                  >
                    {timezone}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
