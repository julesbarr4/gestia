import { describe, it, expect } from "vitest";
import { calculerTotauxDocument, arrondirCentimes } from "@/lib/documents/totaux";

function lignesValides(totauxResultat: ReturnType<typeof calculerTotauxDocument>) {
  if (!totauxResultat.ok) throw new Error(`Résultat inattendu : ${totauxResultat.erreur}`);
  return totauxResultat.totaux;
}

describe("arrondirCentimes", () => {
  it("arrondit au centime", () => {
    expect(arrondirCentimes(10.004)).toBe(10.0);
    expect(arrondirCentimes(10.005)).toBe(10.01);
    expect(arrondirCentimes(10.999)).toBe(11.0);
  });

  it("est stable face aux erreurs binaires des flottants", () => {
    // 0.1 + 0.2 = 0.30000000000000004 en flottant
    expect(arrondirCentimes(0.1 + 0.2)).toBe(0.3);
    // 1.005 * 100 = 100.49999... en flottant : sans EPSILON, arrondi à 1.00
    expect(arrondirCentimes(1.005)).toBe(1.01);
  });
});

describe("calculerTotauxDocument — cas nominaux", () => {
  it("recalcule les totaux à partir des lignes et du taux de TVA", () => {
    const totaux = lignesValides(
      calculerTotauxDocument(
        [
          { description: "Développement site", quantite: 5, prixUnitaireHT: 400 },
          { description: "Hébergement annuel", quantite: 1, prixUnitaireHT: 120 },
        ],
        20
      )
    );

    expect(totaux.totalHT).toBe(2120);
    expect(totaux.totalTVA).toBe(424);
    expect(totaux.totalTTC).toBe(2544);
    expect(totaux.tauxTVA).toBe(20);
  });

  it("ignore les totaux falsifiés envoyés par le client", () => {
    const totaux = lignesValides(
      calculerTotauxDocument(
        [{ description: "Prestation", quantite: 2, prixUnitaireHT: 100, totalHT: 999999 }],
        20
      )
    );

    // Le totalHT de ligne envoyé (999999) est ignoré et recalculé.
    expect(totaux.lignes[0].totalHT).toBe(200);
    expect(totaux.totalHT).toBe(200);
    expect(totaux.totalTTC).toBe(240);
  });

  it("applique le taux de TVA par défaut (20%) si absent", () => {
    const totaux = lignesValides(
      calculerTotauxDocument([{ description: "Conseil", quantite: 1, prixUnitaireHT: 100 }])
    );
    expect(totaux.tauxTVA).toBe(20);
    expect(totaux.totalTTC).toBe(120);
  });

  it("accepte les taux réduits et la TVA à 0 (franchise en base)", () => {
    const reduit = lignesValides(
      calculerTotauxDocument([{ description: "Travaux rénovation", quantite: 1, prixUnitaireHT: 1000 }], 5.5)
    );
    expect(reduit.totalTVA).toBe(55);
    expect(reduit.totalTTC).toBe(1055);

    const exonere = lignesValides(
      calculerTotauxDocument([{ description: "Micro-entreprise", quantite: 1, prixUnitaireHT: 500 }], 0)
    );
    expect(exonere.totalTVA).toBe(0);
    expect(exonere.totalTTC).toBe(500);
  });

  it("ignore les lignes placeholder vides du formulaire", () => {
    const totaux = lignesValides(
      calculerTotauxDocument(
        [
          { description: "Prestation", quantite: 1, prixUnitaireHT: 100 },
          { description: "", quantite: 0, prixUnitaireHT: 0, totalHT: 0 },
          { description: "   ", quantite: 0, prixUnitaireHT: 0 },
        ],
        20
      )
    );
    expect(totaux.lignes).toHaveLength(1);
    expect(totaux.totalHT).toBe(100);
  });
});

describe("calculerTotauxDocument — arrondis", () => {
  it("arrondit chaque ligne puis les totaux au centime", () => {
    const totaux = lignesValides(
      calculerTotauxDocument(
        [
          // 3 × 33.333 = 99.999 → 100.00 par ligne arrondie ? Non : 99.999 → 100.00
          { description: "Tiers de journée", quantite: 3, prixUnitaireHT: 33.333 },
          // 0.5 × 99.99 = 49.995 → 50.00
          { description: "Demi-journée", quantite: 0.5, prixUnitaireHT: 99.99 },
        ],
        20
      )
    );

    expect(totaux.lignes[0].totalHT).toBe(100.0);
    expect(totaux.lignes[1].totalHT).toBe(50.0);
    expect(totaux.totalHT).toBe(150.0);
    expect(totaux.totalTVA).toBe(30.0);
    expect(totaux.totalTTC).toBe(180.0);
  });

  it("la TVA est calculée sur le total HT arrondi (cohérence TTC = HT + TVA)", () => {
    const totaux = lignesValides(
      calculerTotauxDocument([{ description: "Prestation", quantite: 1, prixUnitaireHT: 10.01 }], 5.5)
    );
    // 10.01 × 5.5% = 0.55055 → 0.55
    expect(totaux.totalTVA).toBe(0.55);
    expect(totaux.totalTTC).toBe(arrondirCentimes(totaux.totalHT + totaux.totalTVA));
  });
});

describe("calculerTotauxDocument — rejets", () => {
  it("rejette les lignes absentes ou vides", () => {
    expect(calculerTotauxDocument(undefined, 20).ok).toBe(false);
    expect(calculerTotauxDocument(null, 20).ok).toBe(false);
    expect(calculerTotauxDocument([], 20).ok).toBe(false);
    expect(calculerTotauxDocument("pas un tableau", 20).ok).toBe(false);
  });

  it("rejette un document dont toutes les lignes sont vides", () => {
    const resultat = calculerTotauxDocument(
      [{ description: "", quantite: 0, prixUnitaireHT: 0 }],
      20
    );
    expect(resultat.ok).toBe(false);
  });

  it("rejette un taux de TVA invalide", () => {
    const lignes = [{ description: "Prestation", quantite: 1, prixUnitaireHT: 100 }];
    expect(calculerTotauxDocument(lignes, -5).ok).toBe(false);
    expect(calculerTotauxDocument(lignes, 150).ok).toBe(false);
    expect(calculerTotauxDocument(lignes, NaN).ok).toBe(false);
    expect(calculerTotauxDocument(lignes, Infinity).ok).toBe(false);
    expect(calculerTotauxDocument(lignes, "vingt").ok).toBe(false);
  });

  it("rejette les lignes incohérentes", () => {
    // Montant sans description
    expect(
      calculerTotauxDocument([{ description: "", quantite: 2, prixUnitaireHT: 50 }], 20).ok
    ).toBe(false);
    // Quantité négative
    expect(
      calculerTotauxDocument([{ description: "X", quantite: -1, prixUnitaireHT: 50 }], 20).ok
    ).toBe(false);
    // Prix non numérique
    expect(
      calculerTotauxDocument([{ description: "X", quantite: 1, prixUnitaireHT: "cher" }], 20).ok
    ).toBe(false);
    // Prix non fini
    expect(
      calculerTotauxDocument([{ description: "X", quantite: 1, prixUnitaireHT: Infinity }], 20).ok
    ).toBe(false);
    // Ligne qui n'est pas un objet
    expect(calculerTotauxDocument(["texte"], 20).ok).toBe(false);
  });
});
