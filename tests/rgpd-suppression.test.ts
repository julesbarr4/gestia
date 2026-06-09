import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Vérifie que la suppression de compte RGPD couvre TOUTES les tables liées
// à un utilisateur. Si une nouvelle table portant un user_id est ajoutée au
// schéma ou utilisée dans le code sans être purgée par la RPC
// supprimer_compte_utilisateur, ce test échoue.

const RACINE = join(__dirname, "..");
const MIGRATION_RGPD = readFileSync(
  join(RACINE, "supabase/migrations/0002_rgpd_suppression_compte.sql"),
  "utf8"
);
const SCHEMA = readFileSync(join(RACINE, "supabase/schema.sql"), "utf8");

/** Tables purgées par la RPC (delete from public.X). */
function tablesPurgees(): Set<string> {
  const purgees = new Set<string>();
  for (const m of MIGRATION_RGPD.matchAll(/delete\s+from\s+public\.([a-z_]+)/gi)) {
    purgees.add(m[1]);
  }
  return purgees;
}

/** Tables du schéma de référence contenant une colonne user_id (+ profiles). */
function tablesUtilisateurDuSchema(): Set<string> {
  const tables = new Set<string>();
  for (const m of SCHEMA.matchAll(
    /create\s+table\s+public\.([a-z_]+)\s*\(([\s\S]+?)\);/gi
  )) {
    const [, nom, corps] = m;
    if (nom === "profiles" || /\buser_id\s+uuid\b/i.test(corps)) {
      tables.add(nom);
    }
  }
  return tables;
}

/** Tables référencées par le code applicatif via supabase.from("..."). */
function tablesUtiliseesDansLeCode(): Set<string> {
  const tables = new Set<string>();
  const fichiers: string[] = [];

  function collecter(dossier: string) {
    for (const entree of readdirSync(dossier)) {
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) {
        collecter(chemin);
      } else if (/\.(ts|tsx)$/.test(entree)) {
        fichiers.push(chemin);
      }
    }
  }
  collecter(join(RACINE, "app"));
  collecter(join(RACINE, "lib"));

  for (const fichier of fichiers) {
    const contenu = readFileSync(fichier, "utf8");
    for (const m of contenu.matchAll(/\.from\("([a-z_]+)"\)/g)) {
      tables.add(m[1]);
    }
  }
  return tables;
}

describe("suppression de compte RGPD", () => {
  it("purge toutes les tables du schéma liées à un utilisateur", () => {
    const purgees = tablesPurgees();
    const attendues = tablesUtilisateurDuSchema();

    expect(attendues.size).toBeGreaterThanOrEqual(8);
    for (const table of attendues) {
      expect(purgees, `table "${table}" absente de la purge RGPD`).toContain(table);
    }
  });

  it("purge toutes les tables utilisées par le code applicatif", () => {
    const purgees = tablesPurgees();
    const utilisees = tablesUtiliseesDansLeCode();

    // Garde-fou : les tables connues doivent bien être détectées.
    for (const connue of [
      "profiles",
      "clients",
      "devis",
      "factures",
      "emails_entrants",
      "agents_logs",
      "rapports_financiers",
      "modeles_devis",
    ]) {
      expect(utilisees, `table connue "${connue}" non détectée dans le code`).toContain(connue);
    }

    for (const table of utilisees) {
      expect(purgees, `table "${table}" utilisée dans le code mais absente de la purge RGPD`).toContain(table);
    }
  });

  it("la RPC est transactionnelle, sécurisée et limitée à l'appelant", () => {
    // plpgsql = transaction unique implicite pour tout le corps.
    expect(MIGRATION_RGPD).toMatch(/language\s+plpgsql/i);
    // L'identité vient de la session, pas d'un paramètre falsifiable.
    expect(MIGRATION_RGPD).toMatch(/auth\.uid\(\)/);
    // SECURITY DEFINER avec search_path verrouillé.
    expect(MIGRATION_RGPD).toMatch(/security\s+definer/i);
    expect(MIGRATION_RGPD).toMatch(/set\s+search_path\s*=\s*public/i);
    // Exécution réservée aux utilisateurs authentifiés.
    expect(MIGRATION_RGPD).toMatch(/grant\s+execute[^;]+to\s+authenticated/i);
  });

  it("la route de suppression passe par la RPC transactionnelle et révoque l'auth", () => {
    const route = readFileSync(
      join(RACINE, "app/api/compte/supprimer/route.ts"),
      "utf8"
    );
    expect(route).toContain('rpc("supprimer_compte_utilisateur")');
    expect(route).toContain("auth.admin.deleteUser");
    // Plus aucune suppression table par table non transactionnelle.
    expect(route).not.toMatch(/\.from\("[a-z_]+"\)\s*\.delete\(\)/);
  });
});
