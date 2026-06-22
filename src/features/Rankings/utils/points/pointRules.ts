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
    return Number(0);
  }

  if (!metRequirement) {
    return Number(
      rules.find((rule) => rule.system === system && rule.type === "below_req")
        ?.points ?? 1,
    );
  }

  const rule = rules.find(
    (rule) =>
      rule.system === system &&
      rule.type === "rank" &&
      rank >= (rule.minRank ?? 0) &&
      (rule.maxRank == null || rank <= rule.maxRank),
  );

  return Number(rule?.points ?? 0);
}

export function getDailyPoints(
  rank: number,
  metRequirement: boolean,
  rules: PointRule[],
  exception: boolean,
) {
  return getRankRulePoints(rules, "daily", rank, metRequirement, exception);
}

export function getWeeklyPoints(
  rank: number,
  metRequirement: boolean,
  rules: PointRule[],
  exception: boolean,
) {
  return getRankRulePoints(rules, "weekly", rank, metRequirement, exception);
}

export function getStateRulerRulePoints(
  rules: PointRule[],
  type: "progress" | "clash",
) {
  return getRule(rules, "stateruler", type)?.points ?? 0;
}

export function getGroupLeaderPoints(rules: PointRule[]) {
  return getRule(rules, "eos", "group_leader")?.points ?? 0;
}
