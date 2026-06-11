import type { Member } from "../../../types/member";
import { useGroupFilters } from "../hooks/useGroupedFilters";
import { useGroupedMembers } from "../hooks/useGroupedMembers";
import { formatOffsetHours } from "../utils/Offset";
import { useGroupOptions } from "../hooks/useGroupOptions";
import { useFilteredMembers } from "../hooks/useFilteredMembers";
import GroupFilters from "../components/GroupFilters";

type Props = {
  members: Member[];
};

export default function ViewGroups({ members }: Props) {
  const {
    displayNameFilter,
    timezoneFilter,
    groupByDisplayName,
    groupByTimezone,
    offsetFilter,
    setDisplayNameFilter,
    setTimezoneFilter,
    setGroupByDisplayName,
    setGroupByTimezone,
    clearFilters,
    setOffsetFilter,
  } = useGroupFilters();

  const activeMembers = members.filter((m) => m.status === "Active");

  const filteredMembers = useFilteredMembers(
    activeMembers,
    displayNameFilter,
    timezoneFilter,
    offsetFilter,
  );

  const offsetGroups = useGroupedMembers(filteredMembers);

  const { displayNames, timezones, offsets } = useGroupOptions(activeMembers);

  return (
    <div className="space-y-8 p-3 md:p-6  text-xs sm:text-sm lg:text-base xl:text-lg">
      {/* FILTERS */}
      <GroupFilters
        displayNameFilter={displayNameFilter}
        timezoneFilter={timezoneFilter}
        displayNames={displayNames}
        timezones={timezones}
        setDisplayNameFilter={setDisplayNameFilter}
        setTimezoneFilter={setTimezoneFilter}
        clearFilters={clearFilters}
        offsetFilter={offsetFilter}
        setOffsetFilter={setOffsetFilter}
        offsets={offsets}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setGroupByDisplayName((v) => !v)}
          className={`rounded-lg px-3 py-1  transition border
      ${
        groupByDisplayName
          ? "bg-blue-500/20 text-blue-200 border-blue-500/40"
          : "bg-slate-900/40 text-slate-400 border-white/10"
      }`}
        >
          Group by Display Name
        </button>

        <button
          onClick={() => setGroupByTimezone((v) => !v)}
          className={`rounded-lg px-3 py-1  transition border
      ${
        groupByTimezone
          ? "bg-blue-500/20 text-blue-200 border-blue-500/40"
          : "bg-slate-900/40 text-slate-400 border-white/10"
      }`}
        >
          Group by Timezone
        </button>
      </div>
      {/* OFFSET GROUPS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {offsetGroups.map((offsetGroup) => {
          const totalMembers = offsetGroup.displayNames.reduce(
            (acc, g) =>
              acc +
              g.timezones.reduce((tAcc, tz) => tAcc + tz.members.length, 0),
            0,
          );

          return (
            <section
              key={offsetGroup.offsetMinutes}
              className="relative rounded-2xl border border-white/10 bg-linear-to-br from-slate-900/70 via-slate-950/70 to-slate-900/40 p-5 shadow-lg"
            >
              {/* HEADER */}
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3 pl-2">
                <h2 className=" font-semibold text-slate-200">
                  {formatOffsetHours(offsetGroup.offsetMinutes)}
                </h2>

                <div className="text-right text-slate-400">
                  {groupByDisplayName && (
                    <div>{offsetGroup.displayNames.length} Groups</div>
                  )}
                  <div>{totalMembers} Total</div>
                </div>
              </div>
              {groupByDisplayName && groupByTimezone && (
                <div className="space-y-6 pl-2">
                  {offsetGroup.displayNames.map((displayGroup) => {
                    return (
                      <div
                        key={displayGroup.displayName}
                        className=" rounded-xl border border-white/5 bg-linear-to-br from-slate-800/50 to-slate-900/40 p-4 shadow-inner shadow-black/30 transition-all hover:border-white/10 hover:shadow-lg relative "
                      >
                        {/* LEFT ACCENT */}
                        <div className=" absolute left-0 top-4 bottom-4 w-2 rounded-r-full bg-linear-to-b from-blue-500/60 via-indigo-500/40 to-purple-500/30 opacity-70 group-hover:opacity-100 transition " />
                        {/* DISPLAY NAME HEADER */}
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className=" font-medium text-slate-100">
                            {displayGroup.displayName}
                          </h3>
                          <div className=" text-slate-400">
                            {displayGroup.timezones.length} Timezones
                          </div>
                        </div>
                        {/* TIMEZONE GROUPS */}
                        <div className="space-y-3">
                          {displayGroup.timezones.map((tzGroup) => (
                            <div
                              key={tzGroup.timezone}
                              className=" rounded-lg border border-white/5 bg-slate-900/40 p-3 "
                            >
                              {/* timezone label */}
                              <div className="mb-2 text-slate-400">
                                {tzGroup.timezone}
                              </div>
                              {/* members */}
                              <div className="flex flex-wrap gap-2">
                                {tzGroup.members.map((member) => (
                                  <div
                                    key={member.id}
                                    className=" rounded-full bg-slate-800/70 px-3 py-1 text-slate-200 border border-white/5 shadow-sm shadow-black/20 transition hover:border-blue-500/40 hover:bg-slate-800 "
                                  >
                                    {member.nickname || member.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {groupByDisplayName && !groupByTimezone && (
                <div className="space-y-3 pl-2">
                  {offsetGroup.displayNames.map((displayGroup) => {
                    const members = displayGroup.timezones.flatMap(
                      (t) => t.members,
                    );

                    return (
                      <div
                        key={displayGroup.displayName}
                        className=" rounded-xl border border-white/5 bg-linear-to-br from-slate-800/50 to-slate-900/40 p-4 shadow-inner shadow-black/30 transition-all hover:border-white/10 hover:shadow-lg relative "
                      >
                        {/* LEFT ACCENT */}
                        <div className=" absolute left-0 top-4 bottom-4 w-2 rounded-r-full bg-linear-to-b from-blue-500/60 via-indigo-500/40 to-purple-500/30 opacity-70 group-hover:opacity-100 transition " />
                        {/* DISPLAY NAME HEADER */}
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className=" font-medium text-slate-100">
                            {displayGroup.displayName}
                          </h3>
                          <div className=" text-slate-400">
                            {displayGroup.timezones.length} Timezones
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {members.map((member) => (
                            <div
                              key={member.id}
                              className="
                            rounded-full
                            bg-slate-800/70
                            px-3 py-1
                            text-slate-200
                            border border-white/5
                            shadow-sm shadow-black/20
                            transition
                            hover:border-blue-500/40
                            hover:bg-slate-800
                        "
                            >
                              {member.nickname || member.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {!groupByDisplayName && groupByTimezone && (
                <div className="space-y-4 pl-2">
                  {Object.values(
                    offsetGroup.displayNames
                      .flatMap((d) => d.timezones)
                      .reduce(
                        (acc, tz) => {
                          acc[tz.timezone] ??= {
                            timezone: tz.timezone,
                            members: [],
                          };
                          acc[tz.timezone].members.push(...tz.members);
                          return acc;
                        },
                        {} as Record<
                          string,
                          { timezone: string; members: Member[] }
                        >,
                      ),
                  ).map((tzGroup) => (
                    <div
                      key={tzGroup.timezone}
                      className=" rounded-xl border border-white/5 bg-linear-to-br from-slate-800/50 to-slate-900/40 p-4 shadow-inner shadow-black/30 transition-all hover:border-white/10 hover:shadow-lg relative "
                    >
                      <div className=" text-slate-400 mb-2">
                        {tzGroup.timezone}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tzGroup.members.map((member) => (
                          <div
                            key={member.id}
                            className="
                            rounded-full
                            bg-slate-800/70
                            px-3 py-1
                            text-slate-200
                            border border-white/5
                            shadow-sm shadow-black/20
                            transition
                            hover:border-blue-500/40
                            hover:bg-slate-800
                        "
                          >
                            {member.nickname || member.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!groupByDisplayName && !groupByTimezone && (
                <div className="flex flex-wrap gap-2 pl-2">
                  {offsetGroup.displayNames
                    .flatMap((d) => d.timezones)
                    .flatMap((t) => t.members)
                    .map((member) => (
                      <div
                        key={member.id}
                        className="
                            rounded-full
                            bg-slate-800/70
                            px-3 py-1
                            text-slate-200
                            border border-white/5
                            shadow-sm shadow-black/20
                            transition
                            hover:border-blue-500/40
                            hover:bg-slate-800
                        "
                      >
                        {member.nickname || member.name}
                      </div>
                    ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
