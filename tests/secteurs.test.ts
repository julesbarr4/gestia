import { describe, it, expect } from "vitest";
import {
  SECTEURS,
  SECTEURS_LISTE,
  resoudreSecteur,
  contexteSecteurPourPrompt,
  SECTEUR_PAR_DEFAUT,
} from "@/lib/agents/secteurs";

describe("référentiel des secteurs", () => {
  it("expose exactement les 6 secteurs (1 existant + 5 nouveaux)", () => {
    expect(Object.keys(SECTEURS)).toHaveLength(6);
    expect(SECTEURS_LISTE).toHaveLength(6);
  });

  it("contient les 5 nouveaux secteurs demandés", () => {
    for (const id of [
      "artisanat_btp",
      "restauration",
      "sante_bienetre",
      "ecommerce",
      "conseil",
    ]) {
      expect(SECTEURS).toHaveProperty(id);
    }
  });

  it("chaque secteur a un libellé, des leviers et du vocabulaire non vides", () => {
    for (const s of Object.values(SECTEURS)) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.leviers.length).toBeGreaterThan(0);
      expect(s.vocabulaire.length).toBeGreaterThan(0);
    }
  });
});

describe("resoudreSecteur", () => {
  it("résout un identifiant valide", () => {
    expect(resoudreSecteur("restauration").id).toBe("restauration");
  });

  it("retombe sur le secteur par défaut pour une valeur inconnue", () => {
    expect(resoudreSecteur("aérospatiale").id).toBe(SECTEUR_PAR_DEFAUT);
  });

  it("ne lève jamais sur null/undefined/chaîne vide", () => {
    expect(resoudreSecteur(null).id).toBe(SECTEUR_PAR_DEFAUT);
    expect(resoudreSecteur(undefined).id).toBe(SECTEUR_PAR_DEFAUT);
    expect(resoudreSecteur("").id).toBe(SECTEUR_PAR_DEFAUT);
  });
});

describe("contexteSecteurPourPrompt", () => {
  it("injecte le libellé et les leviers du secteur dans le prompt", () => {
    const ctx = contexteSecteurPourPrompt("artisanat_btp");
    expect(ctx).toContain("Artisanat & BTP");
    expect(ctx).toContain("garantie décennale");
  });

  it("produit un contexte exploitable même pour un secteur inconnu", () => {
    const ctx = contexteSecteurPourPrompt("inconnu");
    expect(ctx).toContain(SECTEURS[SECTEUR_PAR_DEFAUT].label);
  });
});
