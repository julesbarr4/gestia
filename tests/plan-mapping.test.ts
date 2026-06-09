import { describe, it, expect } from "vitest";
import { planFromPriceId } from "@/lib/plans/plan-mapping";

const env = {
  STRIPE_PRICE_ESSENTIEL: "price_essentiel_123",
  STRIPE_PRICE_PRO: "price_pro_456",
} as unknown as NodeJS.ProcessEnv;

describe("planFromPriceId (anti-contournement de facturation)", () => {
  it("mappe le prix essentiel vers le plan essentiel", () => {
    expect(planFromPriceId("price_essentiel_123", env)).toBe("essentiel");
  });

  it("mappe le prix pro vers le plan pro", () => {
    expect(planFromPriceId("price_pro_456", env)).toBe("pro");
  });

  it("retombe sur starter pour un prix inconnu", () => {
    expect(planFromPriceId("price_forge_par_attaquant", env)).toBe("starter");
  });

  it("retombe sur starter quand le prix est vide", () => {
    expect(planFromPriceId(null, env)).toBe("starter");
    expect(planFromPriceId(undefined, env)).toBe("starter");
    expect(planFromPriceId("", env)).toBe("starter");
  });
});
