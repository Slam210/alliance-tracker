import type { PointRule } from "../../../../types/derived/eos";

function getRule(rules: PointRule[], system: string, type: string) {
  return rules.find((rule) => rule.system === system && rule.type === type);
}

function getRankRulePoints(
  rules: PointRule[],
  system: "daily" | "weekly",
  rank: number,
  metRequirement: boolean,
  exception: boolean,
) {
  if (exception && !metRequirement) {
    return 0;
  }

  if (!metRequirement) {
    const rule = rules.find(
      (r) => r.system === system && r.type === "below_req",
    );

    if (!rule) {
      const participation = rules.find(
        (r) => r.system === system && r.type === "participation",
      );

      console.log(participation, rank)

      if (!participation) return null;

      return Number(participation.points);
    }

    return Number(rule.points);
  }

  const rule = rules.find(
    (rule) =>
      rule.system === system &&
      rule.type === "rank" &&
      rank >= (rule.minRank ?? 0) &&
      (rule.maxRank == null || rank <= rule.maxRank),
  );

  if (!rule) return null;

  return Number(rule.points);
}

export function getDailyPoints(
  rank: number | null,
  metRequirement: boolean,
  rules: PointRule[],
  exception: boolean,
) {
  if (rank === null) {
    return null;
  }
  return getRankRulePoints(rules, "daily", rank, metRequirement, exception);
}

export function getWeeklyPoints(
  rank: number | null,
  metRequirement: boolean,
  rules: PointRule[],
  exception: boolean,
) {
  if (rank === null) {
    return null;
  }
  return getRankRulePoints(rules, "weekly", rank, metRequirement, exception);
}

export function getStateRulerRulePoints(
  rules: PointRule[],
  type: "progress" | "clash" | "participation",
  rank?: number,
) {
  if (type === "participation") {
    return Number(
      getRule(rules, "stateruler", "participation")?.points ?? 0,
    );
  }

  if (rank == null) {
    return 0;
  }

  const rule = rules.find(
    (rule) =>
      rule.system === "stateruler" &&
      rule.type === type &&
      rank >= (rule.minRank ?? 0) &&
      (rule.maxRank == null || rank <= rule.maxRank),
  );

  return Number(rule?.points ?? 0);
}

export function getGroupLeaderPoints(
  rules: PointRule[],
): number | null {
  const rule = rules.find(
    (rule) =>
      rule.system === "eos" &&
      rule.type === "group_leader",
  );

  return rule?.points ?? null;
}
