export const ALLIANCE_DUEL_START_DATE = new Date("2026-04-20T00:00:00-00:00");

export function getWeekStartDate(weekName: string) {
  const match = weekName.match(/^W(\d+)$/);
  if (!match) return new Date();

  const weekNumber = Number(match[1]);
  const start = new Date(ALLIANCE_DUEL_START_DATE);

  start.setDate(start.getDate() + (weekNumber - 1) * 7);
  return start;
}

export function getWeekIndex(weekName: string) {
  const match = weekName.match(/^W(\d+)$/);
  return match ? Number(match[1]) : 0;
}

export function getNextWeek(week: string): string {
  const match = week.match(/^W(\d+)$/);

  if (!match) return week;

  const num = Number(match[1]);
  return `W${num + 1}`;
}

export const isExcluded = (member: { exception?: boolean }) =>
  member.exception === false;
