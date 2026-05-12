import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan") || "essentiel";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gestia-beta.vercel.app";

  try {
    const supabase = await createClient();

    await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL(`/login?message=paiement-confirme&plan=${plan}`, baseUrl)
      );
    }

    return NextResponse.redirect(
      new URL(`/upgrade?success=true&plan=${plan}`, baseUrl)
    );
  } catch {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }
}
