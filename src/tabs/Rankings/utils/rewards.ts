import type { EosRewardGroup } from "../../../types/derived/eos";
import type { Member } from "../../../types/member";

export function getRewardGroup(member: Member): EosRewardGroup {
  switch (member.eosReward) {
    case "key_player":
      return member.eosReward;
    case "backbone":
      return member.eosReward;
    case "alliance_leader":
      return member.eosReward;
    default:
      return "contribution";
  }
}
