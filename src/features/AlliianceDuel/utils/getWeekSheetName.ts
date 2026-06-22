const START = new Date("2026-04-20");

export function getWeekSheetName(date: Date) {
  START.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const adjustedDate = new Date(d);

  if (d.getDay() === 0) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }

  const diffDays = Math.floor(
    (adjustedDate.getTime() - START.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return null;

  return `W${Math.floor(diffDays / 7) + 1}`;
}
