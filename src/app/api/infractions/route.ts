import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/requireAuth";
import { supabase } from "../../../lib/supabase";
import { Infraction, InfractionPayload } from "../../../types/derived/infractions";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { data, error } = await supabase
      .from("infractions")
      .select("*")
      .eq("alliance_id", user.allianceId)
      .order("infraction");

    if (error) {
      throw error;
    }
    const result: Infraction[] = (data ?? []).map((row) => ({
      id: row.id,
      allianceID: row.alliance_id,
      infraction: row.infraction,
      points: row.points,
      notes: row.notes,
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch infractions: ${err}` },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const payload: InfractionPayload = await req.json();

    const { added, updated, deleted } = payload;

    // DELETE
    if (deleted.length) {
      const { error: deleteError } = await supabase
        .from("infractions")
        .delete()
        .in("id", deleted);

      if (deleteError) throw deleteError;
    }

    // UPSERT (added + updated)
    const upsertRows = [...added, ...updated];

    if (upsertRows.length) {
      const { error: upsertError } = await supabase
        .from("infractions")
        .upsert(
          upsertRows.map((row) => ({
            id: row.id,
            alliance_id: user.allianceId,
            infraction: row.infraction,
            points: row.points,
            notes: row.notes,
          })),
          { onConflict: "id" }
        );

      if (upsertError) throw upsertError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to save infractions: ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { error } = await supabase
      .from("infractions")
      .delete()
      .eq("alliance_id", user.allianceId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to delete infractions: ${err}` },
      { status: 500 }
    );
  }
}
