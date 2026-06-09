// Recalcul serveur des totaux de devis et factures.
//
// Les montants envoyés par le client (totalHT, totalTVA, totalTTC) ne sont
// JAMAIS une source de confiance : une facture est un document légal
// (Factur-X) et ses totaux doivent être dérivés côté serveur des lignes et
// du taux de TVA. Toute route qui insère ou met à jour un devis/une facture
// doit passer par calculerTotauxDocument et rejeter la requête si la
// validation échoue.

export interface LigneCalculee {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

export interface TotauxDocument {
  lignes: LigneCalculee[];
  tauxTVA: number;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

export type ResultatTotaux =
  | { ok: true; totaux: TotauxDocument }
  | { ok: false; erreur: string };

export const TAUX_TVA_DEFAUT = 20;

/** Arrondi au centime (2 décimales), stable face aux erreurs binaires des flottants. */
export function arrondirCentimes(montant: number): number {
  return Math.round((montant + Number.EPSILON) * 100) / 100;
}

function estNombreValide(valeur: unknown): valeur is number {
  return typeof valeur === "number" && Number.isFinite(valeur) && valeur >= 0;
}

/**
 * Valide les lignes et le taux de TVA puis recalcule tous les totaux.
 *
 * - Les lignes "placeholder" du formulaire (description vide ET montants à
 *   zéro) sont ignorées silencieusement.
 * - Une ligne avec un montant mais sans description, ou avec des nombres
 *   négatifs/non finis, rend le document incohérent → rejet.
 * - tauxTVA absent → 20 % (taux normal français). Hors [0, 100] → rejet.
 */
export function calculerTotauxDocument(
  lignesBrutes: unknown,
  tauxTVABrut?: unknown
): ResultatTotaux {
  if (!Array.isArray(lignesBrutes) || lignesBrutes.length === 0) {
    return { ok: false, erreur: "Le document doit contenir au moins une ligne." };
  }

  let tauxTVA = TAUX_TVA_DEFAUT;
  if (tauxTVABrut !== undefined && tauxTVABrut !== null) {
    const taux = typeof tauxTVABrut === "string" ? Number(tauxTVABrut) : tauxTVABrut;
    if (!estNombreValide(taux) || taux > 100) {
      return { ok: false, erreur: "Taux de TVA invalide (attendu : nombre entre 0 et 100)." };
    }
    tauxTVA = taux;
  }

  const lignes: LigneCalculee[] = [];

  for (const brut of lignesBrutes) {
    if (typeof brut !== "object" || brut === null) {
      return { ok: false, erreur: "Ligne invalide : format inattendu." };
    }

    const ligne = brut as Record<string, unknown>;
    const description = typeof ligne.description === "string" ? ligne.description.trim() : "";
    const quantite = ligne.quantite;
    const prixUnitaireHT = ligne.prixUnitaireHT;

    // Ligne placeholder du formulaire : on l'ignore.
    if (!description && (quantite === 0 || quantite === undefined) && (prixUnitaireHT === 0 || prixUnitaireHT === undefined)) {
      continue;
    }

    if (!description) {
      return { ok: false, erreur: "Ligne invalide : description manquante." };
    }
    if (!estNombreValide(quantite)) {
      return { ok: false, erreur: `Ligne "${description}" : quantité invalide.` };
    }
    if (!estNombreValide(prixUnitaireHT)) {
      return { ok: false, erreur: `Ligne "${description}" : prix unitaire HT invalide.` };
    }

    lignes.push({
      description,
      quantite,
      prixUnitaireHT,
      // Le totalHT de ligne envoyé par le client est ignoré et recalculé.
      totalHT: arrondirCentimes(quantite * prixUnitaireHT),
    });
  }

  if (lignes.length === 0) {
    return { ok: false, erreur: "Le document doit contenir au moins une ligne renseignée." };
  }

  const totalHT = arrondirCentimes(lignes.reduce((somme, l) => somme + l.totalHT, 0));
  const totalTVA = arrondirCentimes(totalHT * (tauxTVA / 100));
  const totalTTC = arrondirCentimes(totalHT + totalTVA);

  return { ok: true, totaux: { lignes, tauxTVA, totalHT, totalTVA, totalTTC } };
}
