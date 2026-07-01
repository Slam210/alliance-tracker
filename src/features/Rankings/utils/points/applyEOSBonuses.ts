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
  // Group Leader
  Object.values(members).forEach((member) => {
    if (!member.group_leader) {
      return;
    }

    const points = getGroupLeaderPoints(pointRules);

    if (points == null) {
      return;
    }

    addGroupLeaderLog(member, points);
  });

  // Manual bonuses / penalties
  logs.forEach((log) => {
    const member = members[log.memberID];
    if (!member) return;

    addAdjustmentLog(member, log);
  });
}
