import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { normalizeName, sanitizeDisplayName } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";

  const { allowed, remaining } = rateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Chill for a minute and try again." },
      { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" } }
    );
  }

  try {
    const body = await req.json();
    const { name, rsvp_status, interests, other_interest } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!["yes", "maybe", "no"].includes(rsvp_status)) {
      return NextResponse.json({ error: "Invalid RSVP status" }, { status: 400 });
    }

    const displayName = sanitizeDisplayName(name);
    const normalizedName = normalizeName(name);

    if (displayName.length < 1 || displayName.length > 50) {
      return NextResponse.json({ error: "Name must be 1-50 characters" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check if user already exists
    const { data: existing } = await supabase
      .from("attendees")
      .select("id")
      .eq("normalized_name", normalizedName)
      .single();

    const headers = { "X-RateLimit-Remaining": String(remaining) };

    if (existing) {
      const updateData: Record<string, unknown> = {
        name: displayName,
        rsvp_status,
      };
      if (interests) updateData.interests = interests;
      if (other_interest !== undefined) updateData.other_interest = other_interest;

      const { data, error } = await supabase
        .from("attendees")
        .update(updateData)
        .eq("normalized_name", normalizedName)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ attendee: data, updated: true }, { headers });
    }

    const { data, error } = await supabase
      .from("attendees")
      .insert({
        name: displayName,
        normalized_name: normalizedName,
        rsvp_status,
        interests: interests || [],
        other_interest: other_interest || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ attendee: data, updated: false }, { headers });
  } catch (error: unknown) {
    console.error("RSVP error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
