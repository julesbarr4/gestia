# Rapport d'intervention — Gestia

Branche : `claude/exciting-sagan-0q464d`
Date : 2026-06-09

Ce rapport couvre les quatre volets demandés : (1) audit de sécurité des routes
API, (2) refactorisation du système de génération de contenu par secteur,
(3) tests unitaires sur les composants critiques, (4) synthèse.

---

## 1. Audit de sécurité des routes API

> Note de périmètre : la demande mentionnait un « système de génération de
> lettres de motivation ». Cette codebase (facturation/devis pour TPE) n'en
> contient pas. Après clarification, le volet 2 a porté sur le **système de
> génération de contenu marketing par secteur** (agent CMO), qui était le
> candidat le plus proche.

### Failles corrigées dans cette intervention

| # | Sévérité | Route / fichier | Faille | Correctif |
|---|----------|-----------------|--------|-----------|
| 1 | **Élevée** | `app/api/stripe/checkout/route.ts` | **Contournement de facturation.** Le `plan` était lu depuis le corps de la requête puis écrit dans `profiles.plan`. Un utilisateur pouvait envoyer le `priceId` le moins cher avec `plan: "pro"` et obtenir un accès Pro en payant le tarif Starter. | Le plan est désormais **dérivé du `priceId` côté serveur** via `planFromPriceId()`. Le champ `plan` du client est ignoré. Prix inconnu → 400. |
| 2 | **Élevée** | `app/auth/callback/route.ts` | **Redirection ouverte.** Le paramètre `next` était passé tel quel à `NextResponse.redirect`. `?next=https://evil.com` redirigeait hors du site après authentification (phishing). | Validation via `chemininInterneSur()` : seuls les chemins internes (`/...`, hors `//` et schémas) sont acceptés, sinon repli sur `/dashboard`. |
| 3 | **Moyenne** | `lib/plans/check-plan.ts` | **Race condition (TOCTOU) sur le quota gratuit.** `incrementerGenerations` faisait un read-modify-write non atomique. Des requêtes concurrentes lisaient toutes `nb_generations_ia = 0` et dépassaient le quota de 5 générations (abus de coût API Claude). | Incrément atomique en base via la fonction SQL `increment_generations_ia` (migration `0001`), avec repli défensif si la RPC n'est pas déployée. |

### Failles identifiées et documentées (non corrigées — à arbitrer)

| # | Sévérité | Route / fichier | Constat | Recommandation |
|---|----------|-----------------|---------|----------------|
| 4 | **Moyenne** | `app/api/devis/route.ts`, `app/api/factures/route.ts` | Les totaux (`totalHT`, `totalTVA`, `totalTTC`, `tauxTVA`) proviennent du client et sont insérés **sans recalcul serveur**. Un client peut créer une facture dont les totaux ne correspondent pas aux lignes — problème d'intégrité et de conformité Factur-X (document légal). | Recalculer les totaux côté serveur à partir des `lignes` et du taux de TVA. |
| 5 | **Moyenne** | `app/api/compte/supprimer/route.ts` | Suppression RGPD **incomplète et non transactionnelle** : `emails_entrants`, `rapports_financiers` et `modeles_devis` ne sont pas purgés (données résiduelles). Une erreur en cours laisse un état incohérent. | Inclure toutes les tables liées (ou s'appuyer sur `on delete cascade`), idéalement via une RPC transactionnelle. |
| 6 | **Moyenne** | Agents IA (`app/api/agents/*`) | **Injection de prompt.** Du contenu utilisateur non maîtrisé (corps d'e-mail entrant dans `support`, descriptions de projet) est injecté dans les prompts LLM. Un e-mail malveillant peut tenter de détourner la réponse de l'agent. | Délimiter clairement les données utilisateur dans le prompt, instruire le modèle de les traiter comme des données, et filtrer la sortie. |
| 7 | **Moyenne** | `app/api/compte/password/route.ts` | Le changement de mot de passe ne requiert **pas le mot de passe actuel** ni de ré-authentification. Une session détournée permet un verrouillage de compte. Politique faible (longueur ≥ 8 uniquement). | Exiger une ré-authentification récente ; renforcer la politique (complexité / vérification de fuite). |
| 8 | **Faible/Moyenne** | Agents IA | Au-delà du quota Starter, les plans Essentiel/Pro sont **illimités sans rate limiting** → exposition à l'abus de coût (API Claude). | Ajouter un rate limit par utilisateur/IP (ex. middleware ou quota glissant). |
| 9 | **Faible** | `app/api/stripe/webhook/route.ts` | `customer.subscription.updated`/`deleted` reposent sur `metadata.supabase_user_id` ; absent → l'événement est **ignoré silencieusement** (désynchronisation possible). Pas de déduplication d'événements (idempotence). | Repli sur lookup par `stripe_customer_id` ; journaliser les événements ignorés ; stocker les `event.id` traités. |
| 10 | **Faible** | `next.config.ts` | Aucun **en-tête de sécurité** (CSP, `X-Frame-Options`, HSTS, `X-Content-Type-Options`). `serverActions.allowedOrigins` limité à `localhost:3000` (risque de configuration en production). | Ajouter les en-têtes de sécurité ; corriger les origines autorisées pour la prod. |
| 11 | **Faible** | `supabase/schema.sql` | Schéma **obsolète/incohérent** avec le code : `plan check (... in ('starter','pro'))` alors que le code utilise `essentiel` ; colonnes manquantes (`nb_generations_ia`, `secteur`, `stripe_price_id`, `iban`, `type_operation`, etc.). | Réaligner le schéma de référence avec la base de production (migrations versionnées). |

### Points conformes (vérifiés)

- Toutes les routes protégées vérifient `supabase.auth.getUser()` et renvoient 401 sinon.
- Les accès aux ressources sont **systématiquement filtrés par `user_id`/`id`** (`.eq("user_id", user.id)`), et les tables ont des politiques RLS actives — pas d'IDOR constaté sur les routes CRUD.
- Les routes `PATCH` `devis`/`factures` utilisent une **liste blanche de champs** (`champsAutorisés`), bloquant le mass-assignment.
- Le webhook Stripe **vérifie la signature** (`constructEvent`) avant tout traitement.
- Pas d'injection SQL : requêtes paramétrées via le client Supabase.
- Les cookies de session sont `httpOnly`, `sameSite: lax`, `secure` en production.

---

## 2. Refactorisation — génération de contenu par secteur (5 nouveaux secteurs)

**Problème initial.** L'agent marketing (CMO « Cyprien ») recevait un secteur
**codé en dur à `"services"`** (`app/api/agents/marketing/route.ts`), et la
fonction `genererContenuSocial` se contentait d'interpoler la chaîne brute dans
le prompt. Impossible d'adapter le contenu au métier réel du client.

**Solution.** Mise en place d'un référentiel de secteurs centralisé et typé,
injecté dans les prompts des agents.

### Fichiers créés / modifiés

- **`lib/agents/secteurs.ts`** (nouveau) — référentiel `SECTEURS` typé. Chaque
  secteur porte : `label`, `description`, `vocabulaire`, `leviers` marketing et
  `tonaliteConseillee`. Fonctions utilitaires : `resoudreSecteur()` (résolution
  tolérante qui ne lève jamais), `contexteSecteurPourPrompt()` (bloc de prompt),
  `SECTEURS_LISTE` (pour l'UI).
  - Secteur existant : **Services**.
  - **5 nouveaux secteurs** : **Artisanat & BTP**, **Restauration & métiers de
    bouche**, **Santé & bien-être**, **E-commerce**, **Conseil & professions
    intellectuelles**.
- **`lib/agents/cmo-agent.ts`** — `genererContenuSocial` et
  `genererEmailNewsletter` injectent désormais le contexte secteur et utilisent
  la tonalité conseillée par défaut. Parsing JSON factorisé via `parseJsonLLM`.
- **`app/api/agents/marketing/route.ts`** — le secteur n'est plus codé en dur :
  priorité au secteur de la requête, sinon `profiles.secteur`, sinon défaut.
- **`app/(dashboard)/marketing/page.tsx`** — ajout d'un sélecteur de secteur
  (« Détecté automatiquement » + les 6 secteurs).
- **`lib/claude.ts`** — extraction de `nettoyerJsonLLM` / `parseJsonLLM`
  (parsing robuste des sorties LLM encapsulées en blocs markdown).
- **`supabase/migrations/0001_add_secteur_and_atomic_generations.sql`** (nouveau)
  — colonne `profiles.secteur` (contrainte CHECK sur les 6 valeurs) + fonction
  `increment_generations_ia` (cf. faille #3).

L'architecture est extensible : ajouter un secteur = ajouter une entrée dans
`SECTEURS` (et la valeur à la contrainte CHECK), sans toucher aux agents.

---

## 3. Tests unitaires

Aucun framework de test n'était présent. Mise en place de **Vitest** (`vitest run`,
alias `@/` configuré) ciblant les composants critiques — logique de sécurité,
parsing LLM et logique métier pure.

| Fichier | Couvre | Pourquoi critique |
|---------|--------|-------------------|
| `tests/plan-mapping.test.ts` | `planFromPriceId` | Cœur de l'anti-contournement de facturation (faille #1). |
| `tests/safe-redirect.test.ts` | `chemininInterneSur` | Protection contre la redirection ouverte (faille #2), incl. cas `//evil.com`, schémas, backslash. |
| `tests/secteurs.test.ts` | référentiel secteurs | Garantit les 6 secteurs, la résolution tolérante et l'injection du contexte. |
| `tests/claude-json.test.ts` | `nettoyerJsonLLM` / `parseJsonLLM` | Le parsing des sorties LLM est un point de défaillance fréquent en prod. |
| `tests/utils.test.ts` | `formatEuros`, `formatDate`, `genererNumeroDocument` | Formatage monétaire/numérotation de documents légaux. |

**Résultat : 29 tests, 5 fichiers, 100 % au vert.** `npx tsc --noEmit` passe sans
erreur.

```
 Test Files  5 passed (5)
      Tests  29 passed (29)
```

Commandes : `npm test` (CI) / `npm run test:watch` (dev).

---

## 4. Synthèse

- **Sécurité** : 3 failles corrigées (1 élevée billing-bypass, 1 élevée
  redirection ouverte, 1 moyenne race condition de quota) ; 8 failles
  supplémentaires documentées avec recommandations. Les routes CRUD se sont
  révélées correctement protégées (auth + filtrage `user_id` + RLS).
- **Secteurs** : système de secteurs centralisé et extensible, 5 nouveaux
  secteurs ajoutés, secteur câblé de bout en bout (UI → route → agent → prompt).
- **Tests** : socle Vitest, 29 tests verts sur les composants critiques.
- **Migration BDD requise** : exécuter
  `supabase/migrations/0001_add_secteur_and_atomic_generations.sql` (colonne
  `secteur` + RPC atomique). Sans elle, le repli applicatif reste fonctionnel.

### Priorités de suivi recommandées
1. Recalcul serveur des totaux devis/factures (faille #4 — conformité légale).
2. Suppression de compte RGPD complète et transactionnelle (faille #5).
3. Durcissement de l'injection de prompt sur l'agent support (faille #6).
4. Réalignement du `schema.sql` de référence (faille #11).
