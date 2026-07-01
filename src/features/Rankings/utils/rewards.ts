import type { eos_rewardGroup } from "../../../types/derived/eos";
import type { Member } from "../../../types/member";

export function getRewardGroup(member: Member): eos_rewardGroup {
  switch (member.eos_reward) {
    case "key_player":
      return member.eos_reward;
    case "backbone":
      return member.eos_reward;
    case "alliance_leader":
      return member.eos_reward;
    default:
      return "contribution";
  }
}
