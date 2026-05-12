import SignupClient from "./signup-client";

export default function SignupPage() {
  return (
    <SignupClient
      priceIdEssentiel={process.env.STRIPE_PRICE_ESSENTIEL || ""}
      priceIdPro={process.env.STRIPE_PRICE_PRO || ""}
    />
  );
}
