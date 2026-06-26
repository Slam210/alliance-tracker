import { supabase } from "../lib/supabase";

export const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export async function createMemberIdMap() {
  const { data, error } = await supabase.from("members").select("id, name");

  if (error) throw error;

  return new Map(data.map((member) => [normalize(member.name), member.id]));
}
