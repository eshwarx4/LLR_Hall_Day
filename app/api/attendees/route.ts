import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0; // no cache

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: attendees, error } = await supabase
      .from("attendees")
      .select("name, rsvp_status, interests")
      .in("rsvp_status", ["yes", "maybe"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    const coming = attendees?.filter((a) => a.rsvp_status === "yes").length || 0;
    const maybe = attendees?.filter((a) => a.rsvp_status === "maybe").length || 0;

    return NextResponse.json({
      attendees: attendees || [],
      stats: {
        total: coming + maybe,
        coming,
        maybe,
      },
    });
  } catch (error: unknown) {
    console.error("Attendees fetch error:", error);
    return NextResponse.json(
      { attendees: [], stats: { total: 0, coming: 0, maybe: 0 } },
      { status: 500 }
    );
  }
}
