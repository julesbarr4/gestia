# DIAGNOSTIC — business-ia

## Routes existantes

### Pages (`/app`)
- `/` — Landing page publique
- `/(auth)/login` — Connexion utilisateur
- `/(auth)/signup` — Inscription + métadonnée nom entreprise
- `/(dashboard)/dashboard` — Métriques globales (clients, devis, factures, montants)
- `/(dashboard)/clients` — Liste des clients
- `/(dashboard)/devis` — Liste des devis
- `/(dashboard)/devis/nouveau` — Création d'un devis
- `/(dashboard)/factures` — Liste des factures
- `/(dashboard)/factures/nouvelle` — Création d'une facture
- `/(dashboard)/emails` — Agent support email
- `/(dashboard)/rapports` — Agent CFO / rapports financiers
- `/(dashboard)/marketing` — Agent CMO / contenu marketing
- `/(dashboard)/parametres` — Profil et paramètres entreprise

### Routes API (`/app/api`)
- `POST /api/agents/rapport` — Génération rapport financier via Claude
- `POST /api/agents/marketing` — Génération contenu marketing via Claude
- `POST /api/agents/factures` — Génération facture via Claude
- `POST /api/agents/relances` — Génération relance paiement via Claude
- `POST /api/agents/devis` — Génération devis via Claude
- `POST /api/agents/support` — Analyse email support via Claude
- `POST /api/auth/signout` — Déconnexion Supabase

---

## Dépendances du projet

- `next` 15.3.1
- `react` ^19.0.0
- `@supabase/supabase-js` ^2.49.4
- `@supabase/ssr` ^0.6.1
- `@anthropic-ai/sdk` ^0.39.0
- `stripe` ^17.7.0 _(présent dans package.json, non utilisé dans le code)_
- `@radix-ui/*` — composants UI (avatar, dialog, dropdown, label, select, separator, slot, tabs, toast)
- `lucide-react` ^0.487.0
- `tailwindcss-animate` ^1.0.7
- `class-variance-authority`, `clsx`, `tailwind-merge`

---

## Points de contact avec services externes

### Supabase
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/clients/page.tsx`
- `app/(dashboard)/devis/page.tsx`
- `app/(dashboard)/factures/page.tsx`
- `app/(dashboard)/parametres/page.tsx`
- `app/api/auth/signout/route.ts`
- `app/api/agents/rapport/route.ts`
- `app/api/agents/marketing/route.ts`
- `app/api/agents/factures/route.ts`
- `app/api/agents/relances/route.ts`
- `app/api/agents/devis/route.ts`
- `app/api/agents/support/route.ts`

### Anthropic (Claude)
- `lib/claude.ts`
- `app/api/agents/rapport/route.ts`
- `app/api/agents/marketing/route.ts`
- `app/api/agents/factures/route.ts`
- `app/api/agents/relances/route.ts`
- `app/api/agents/devis/route.ts`
- `app/api/agents/support/route.ts`

### Stripe
- _(aucun fichier de code — seulement dans `.env.example` et `package.json`)_

### Brevo
- _(aucun fichier de code — seulement dans `.env.example`)_

---

## Erreurs probables au démarrage

- **`NEXT_PUBLIC_SUPABASE_URL` manquant** — crash au build/runtime sur tous les composants utilisant le client Supabase (toutes les pages dashboard, login, signup)
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY` manquant** — même conséquence : impossible d'initialiser `@supabase/ssr`
- **`ANTHROPIC_API_KEY` manquant** — toutes les routes `/api/agents/*` retournent une erreur 500 à l'appel
- **`SUPABASE_SERVICE_ROLE_KEY` manquant** — les routes API server-side ne peuvent pas authentifier les requêtes Supabase avec privilèges élevés
- **Absence de `.env.local`** — aucune variable d'environnement n'est définie ; Next.js ne charge pas `.env.example` automatiquement
