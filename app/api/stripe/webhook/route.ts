import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

async function getSupabaseAdmin() {
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getPlanFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_ESSENTIEL) return "essentiel";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return "starter";
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ erreur: "Signature manquante" }, { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature invalide:", err);
    return NextResponse.json({ erreur: "Signature invalide" }, { status: 400 });
  }

  const supabase = await getSupabaseAdmin();

  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const userId = subscription.metadata?.supabase_user_id
        || (session.metadata as { supabase_user_id?: string })?.supabase_user_id;

      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id;
      const plan = getPlanFromPriceId(priceId);

      await supabase.from("profiles").update({
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        plan,
        abonnement_actif: true,
        abonnement_fin_periode: new Date(subscription.current_period_end * 1000).toISOString(),
      }).eq("id", userId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id;
      const plan = getPlanFromPriceId(priceId);
      const actif = subscription.status === "active" || subscription.status === "trialing";

      await supabase.from("profiles").update({
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        plan,
        abonnement_actif: actif,
        abonnement_fin_periode: new Date(subscription.current_period_end * 1000).toISOString(),
      }).eq("id", userId);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      await supabase.from("profiles").update({
        plan: "starter",
        abonnement_actif: false,
        stripe_subscription_id: null,
        stripe_price_id: null,
      }).eq("id", userId);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .limit(1);

      if (profiles?.[0]) {
        await supabase.from("profiles").update({
          abonnement_actif: false,
        }).eq("id", profiles[0].id);
      }
      break;
    }
  }

  return NextResponse.json({ recu: true });
}
