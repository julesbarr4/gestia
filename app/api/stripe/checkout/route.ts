import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { planFromPriceId } from "@/lib/plans/plan-mapping";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { priceId } = await req.json();
  if (!priceId) return NextResponse.json({ erreur: "Prix manquant" }, { status: 400 });

  // Le plan est dérivé du prix côté serveur — jamais de la requête client —
  // pour empêcher un utilisateur de payer le prix starter en réclamant "pro".
  const plan = planFromPriceId(priceId);
  if (plan === "starter") {
    return NextResponse.json({ erreur: "Prix inconnu" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, stripe_subscription_id, nom_entreprise, plan")
    .eq("id", user.id)
    .single();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gestia-beta.vercel.app";

  if (profile?.stripe_subscription_id) {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        profile.stripe_subscription_id
      );

      if (subscription.status === "active" || subscription.status === "trialing") {
        const updatedSubscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          {
            items: [{
              id: subscription.items.data[0].id,
              price: priceId,
            }],
            proration_behavior: "always_invoice",
            metadata: {
              supabase_user_id: user.id,
              plan,
            },
          }
        );

        const finPeriode = updatedSubscription.current_period_end
          ? new Date(updatedSubscription.current_period_end * 1000).toISOString()
          : null;

        await supabase.from("profiles").update({
          plan,
          stripe_price_id: priceId,
          abonnement_actif: true,
          abonnement_fin_periode: finPeriode,
        }).eq("id", user.id);

        return NextResponse.json({
          url: `${baseUrl}/upgrade?success=true&plan=${plan}`,
          updated: true,
        });
      }
    } catch (err) {
      console.error("Erreur mise à jour abonnement:", err);
    }
  }

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || "",
      name: profile?.nom_entreprise || "",
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  if (customerId) {
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (existingSubscriptions.data.length > 0) {
      const existingSub = existingSubscriptions.data[0];
      const existingPriceId = existingSub.items.data[0]?.price.id;

      if (existingPriceId === priceId) {
        return NextResponse.json({
          url: `${baseUrl}/upgrade?success=true&plan=${plan}`,
          updated: true,
        });
      }

      const updated = await stripe.subscriptions.update(existingSub.id, {
        items: [{ id: existingSub.items.data[0].id, price: priceId }],
        proration_behavior: "always_invoice",
        metadata: { supabase_user_id: user.id, plan },
      });

      const finPeriode = updated.current_period_end
        ? new Date(updated.current_period_end * 1000).toISOString()
        : null;

      await supabase.from("profiles").update({
        plan,
        stripe_price_id: priceId,
        stripe_subscription_id: updated.id,
        abonnement_actif: true,
        abonnement_fin_periode: finPeriode,
      }).eq("id", user.id);

      return NextResponse.json({
        url: `${baseUrl}/upgrade?success=true&plan=${plan}`,
        updated: true,
      });
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/auth/stripe-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/upgrade?canceled=true`,
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    },
    locale: "fr",
    allow_promotion_codes: true,
    billing_address_collection: "required",
  });

  return NextResponse.json({ url: session.url });
}
