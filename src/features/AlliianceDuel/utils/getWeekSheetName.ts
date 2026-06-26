export function getWeekSheetName(date: Date, startDate: Date) {
  startDate.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const adjustedDate = new Date(d);

  if (d.getDay() === 0) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }

  const diffDays = Math.floor(
    (adjustedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return null;

  return `W${Math.floor(diffDays / 7) + 1}`;
}
