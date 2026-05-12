import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { priceId, plan } = await req.json();
  if (!priceId) return NextResponse.json({ erreur: "Prix manquant" }, { status: 400 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, nom_entreprise, email")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || profile?.email || "",
      name: profile?.nom_entreprise || "",
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mongestia.fr";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/auth/stripe-success?plan=${plan}`,
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
