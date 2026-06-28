import type {
  MemberWithPoints,
  PointRule,
} from "../../../../types/derived/eos";
import type { AdjustmentLog } from "../../../../types/log";
import { addGroupLeaderLog, addAdjustmentLog } from "../log";
import { getGroupLeaderPoints } from "./pointRules";

export function applyEOSBonuses(
  members: Record<string, MemberWithPoints>,
  pointRules: PointRule[],
  logs: AdjustmentLog[],
) {
  console.log(pointRules, logs)
  // Group Leader
  Object.values(members).forEach((member) => {
    if (member.group_leader) {
      const points = getGroupLeaderPoints(pointRules);
      addGroupLeaderLog(member, points);
    }
  });

  // Manual bonuses / penalties
  logs.forEach((log) => {
    const member = members[log.memberID];
    if (!member) return;
    addAdjustmentLog(member, log);
  });
}
