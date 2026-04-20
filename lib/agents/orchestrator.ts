// Orchestrateur central — route les tâches vers le bon agent IA
import { genererDevis, genererFacture, genererRelance } from "./admin-agent";
import { analyserEtRepondreEmail } from "./support-agent";
import { genererRapportHebdomadaire, analyserTresorerie } from "./cfo-agent";
import { analyserStrategieEntreprise } from "./ceo-agent";
import { genererContenuSocial, genererEmailNewsletter } from "./cmo-agent";

export type TypeTache =
  | "devis"
  | "facture"
  | "relance"
  | "email_support"
  | "rapport_financier"
  | "tresorerie"
  | "strategie"
  | "contenu_social"
  | "newsletter";

export interface TacheOrchestree {
  type: TypeTache;
  params: Record<string, unknown>;
  userId: string;
}

export async function orchestrer(tache: TacheOrchestree) {
  switch (tache.type) {
    case "devis":
      return genererDevis(
        tache.params as Parameters<typeof genererDevis>[0]
      );

    case "facture":
      return genererFacture(
        tache.params as Parameters<typeof genererFacture>[0]
      );

    case "relance":
      return genererRelance(
        tache.params as Parameters<typeof genererRelance>[0]
      );

    case "email_support":
      return analyserEtRepondreEmail(
        tache.params as Parameters<typeof analyserEtRepondreEmail>[0]
      );

    case "rapport_financier":
      return genererRapportHebdomadaire(
        tache.params as Parameters<typeof genererRapportHebdomadaire>[0]
      );

    case "tresorerie":
      return analyserTresorerie(
        tache.params as Parameters<typeof analyserTresorerie>[0]
      );

    case "strategie":
      return analyserStrategieEntreprise(
        tache.params as Parameters<typeof analyserStrategieEntreprise>[0]
      );

    case "contenu_social":
      return genererContenuSocial(
        tache.params as Parameters<typeof genererContenuSocial>[0]
      );

    case "newsletter":
      return genererEmailNewsletter(
        tache.params as Parameters<typeof genererEmailNewsletter>[0]
      );

    default:
      throw new Error(`Type de tâche inconnu : ${tache.type}`);
  }
}
