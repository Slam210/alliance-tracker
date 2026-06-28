export const DAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Weekly: 6,
};

export function didMemberJoinDuringWeek(
  memberJoined: string | Date,
  week: string,
  ALLIANCE_DUEL_START_DATE: Date,
) {
  const joined_date = new Date(memberJoined);
  joined_date.setHours(0, 0, 0, 0);

  const weekNum = Number(week.replace("W", ""));

  const weekStart = new Date(ALLIANCE_DUEL_START_DATE);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return joined_date >= weekStart && joined_date <= weekEnd;
}

export function getCurrentUnlockedDayIndex() {
  const now = new Date();

  const shifted = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const day = shifted.getUTCDay();

  switch (day) {
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 2;
    case 4:
      return 3;
    case 5:
      return 4;
    case 6:
      return 5;
    case 0:
      return 6;
    default:
      return -1;
  }
}

export function isUnlockedForLatestWeek(
  weekName: string,
  latestWeekName: string,
  day: string,
) {
  if (weekName !== latestWeekName) return true;

  const dayIndex = DAY_INDEX[day];
  return dayIndex <= getCurrentUnlockedDayIndex();
}

export function didMemberJoinBeforeEvent(params: {
  memberJoined: string | Date;
  week: string;
  day: string;
  ALLIANCE_DUEL_START_DATE: Date;
}) {
  const { memberJoined, week, day, ALLIANCE_DUEL_START_DATE } = params;

  const joined_date = new Date(memberJoined);
  joined_date.setHours(0, 0, 0, 0);

  const weekNum = parseInt(week.replace("W", ""), 10);
  const dayIndex = DAY_INDEX[day] ?? 0;

  const eventDate = new Date(ALLIANCE_DUEL_START_DATE);
  eventDate.setHours(0, 0, 0, 0);

  // move forward by weeks
  eventDate.setDate(eventDate.getDate() + (weekNum - 1) * 7);

  // move forward by day
  eventDate.setDate(eventDate.getDate() + dayIndex);

  return joined_date <= eventDate;
}
