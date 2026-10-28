import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { session_id, event_type, metadata } = await request.json();
    if (!session_id || !event_type) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }
    await supabase.from("events").insert([{ session_id, event_type, metadata }]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
