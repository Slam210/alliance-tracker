import { supabase } from "../../lib/supabase";
import { MemberMigrate } from "../../types/migrate";

export async function migrateMembers(
  members: MemberMigrate[],
  alliance_id: string,
) {
  console.log(`Migrating ${members.length} members...`);

  const payload = members.map((member) => ({
    alliance_id,
    name: member.name,
    nickname: member.nickname || null,
    status: member.status || "Active",

    joined_date: member.joined_date || null,
    reason: member.reason || null,

    timezone: member.timezone || null,
    display_name: member.display_name || null,

    group_number:
      member.group_number === null
        ? null
        : member.group_number === ""
          ? null
          : member.group_number,
    group_leader: !!member.group_leader,

    eos_reward: member.eos_reward || null,
  }));

  const { error } = await supabase.from("members").upsert(payload, {
    onConflict: "alliance_id,name",
  });

  if (error) {
    throw error;
  }

  console.log("✓ Members migrated");
}
