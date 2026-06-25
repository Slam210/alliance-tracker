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
