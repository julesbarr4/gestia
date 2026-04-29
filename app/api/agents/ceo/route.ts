import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 120;

export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  return NextResponse.json({ erreur: "Mode production non configuré" }, { status: 501 });
}
