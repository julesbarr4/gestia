import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
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

    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["subscription"],
        });

        if (session.payment_status === "paid" && session.subscription) {
          const subscription = session.subscription as import("stripe").Stripe.Subscription;
          const priceId = subscription.items.data[0]?.price.id;

          const planMap: Record<string, string> = {
            [process.env.STRIPE_PRICE_PRO || ""]: "pro",
            [process.env.STRIPE_PRICE_ESSENTIEL || ""]: "essentiel",
          };
          const planActif = planMap[priceId] || plan;

          const finPeriode = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;

          await supabase.from("profiles").update({
            plan: planActif,
            abonnement_actif: true,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            abonnement_fin_periode: finPeriode,
          }).eq("id", user.id);
        }
      } catch (stripeErr) {
        console.error("Stripe session verification failed:", stripeErr);
      }
    }

    return NextResponse.redirect(
      new URL(`/upgrade?success=true&plan=${plan}`, baseUrl)
    );
  } catch {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }
}
