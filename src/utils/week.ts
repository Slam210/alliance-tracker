export function getWeekNumber(date: Date, startDate: Date) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d.getDay() === 0) {
    d.setDate(d.getDate() - 1);
  }

  const diffDays = Math.floor(
    (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return Math.floor(diffDays / 7) + 1;
}
