import SignupPage from "./signup-client";

export default function SignupPageWrapper() {
  return (
    <SignupPage
      priceIdEssentiel={process.env.STRIPE_PRICE_ESSENTIEL || ""}
      priceIdPro={process.env.STRIPE_PRICE_PRO || ""}
    />
  );
}
