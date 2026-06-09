import { describe, it, expect } from "vitest";
import { chemininInterneSur } from "@/lib/safe-redirect";

describe("chemininInterneSur (protection contre la redirection ouverte)", () => {
  it("accepte un chemin interne simple", () => {
    expect(chemininInterneSur("/dashboard")).toBe("/dashboard");
    expect(chemininInterneSur("/factures/123")).toBe("/factures/123");
  });

  it("retombe sur le repli quand next est absent", () => {
    expect(chemininInterneSur(null)).toBe("/dashboard");
    expect(chemininInterneSur(undefined)).toBe("/dashboard");
    expect(chemininInterneSur("")).toBe("/dashboard");
  });

  it("rejette une URL absolue externe", () => {
    expect(chemininInterneSur("https://evil.com")).toBe("/dashboard");
    expect(chemininInterneSur("http://evil.com/phish")).toBe("/dashboard");
  });

  it("rejette les URL protocol-relative (//evil.com)", () => {
    expect(chemininInterneSur("//evil.com")).toBe("/dashboard");
  });

  it("rejette les backslashes trompeurs", () => {
    expect(chemininInterneSur("/\\evil.com")).toBe("/dashboard");
  });

  it("rejette un schéma glissé dans un chemin", () => {
    expect(chemininInterneSur("/javascript:alert(1)")).toBe("/dashboard");
    expect(chemininInterneSur("/https:evil.com")).toBe("/dashboard");
  });

  it("respecte un repli personnalisé", () => {
    expect(chemininInterneSur(null, "/login")).toBe("/login");
  });
});
