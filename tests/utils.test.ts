import { describe, it, expect } from "vitest";
import { formatEuros, formatDate, genererNumeroDocument } from "@/lib/utils";

describe("formatEuros", () => {
  it("formate un montant en euros français", () => {
    // espace insécable + symbole € : on vérifie les éléments clés.
    const out = formatEuros(1234.5);
    expect(out).toMatch(/1\s?234,50/);
    expect(out).toContain("€");
  });

  it("gère zéro", () => {
    expect(formatEuros(0)).toContain("0,00");
  });
});

describe("formatDate", () => {
  it("formate une date ISO au format français jj/mm/aaaa", () => {
    expect(formatDate("2026-06-09")).toBe("09/06/2026");
  });
});

describe("genererNumeroDocument", () => {
  it("génère un numéro avec préfixe, année et séquence sur 4 chiffres", () => {
    const annee = new Date().getFullYear();
    expect(genererNumeroDocument("FAC", 7)).toBe(`FAC-${annee}-0007`);
    expect(genererNumeroDocument("DEV", 1234)).toBe(`DEV-${annee}-1234`);
  });
});
