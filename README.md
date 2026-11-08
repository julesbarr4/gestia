# Gestia

Assistant administratif IA pour TPE et indépendants : devis, factures (Factur-X), relances, support client, rapports financiers et contenu marketing, pris en charge par une équipe d'agents IA basée sur Claude.

## Fonctionnalités

| Agent | Rôle | Fonctions | Plan minimum |
|-------|------|-----------|--------------|
| Inès | Assistante administrative | Devis, factures, relances de paiement | Starter |
| Léa | Responsable service client | Analyse et réponse aux e-mails entrants | Essentiel |
| Hugo | Directeur financier | Rapports financiers | Essentiel |
| Cyprien | Directeur marketing | Contenu marketing adapté au secteur | Pro |
| Augustin | Directeur général | Stratégie | Pro |

Également inclus :
- gestion des clients, devis et factures avec numérotation séquentielle ;
- export de factures au format **Factur-X** (EN 16931) ;
- modèles de devis réutilisables ;
- abonnements Stripe (Starter, Essentiel, Pro) ; le plan Starter est limité à 5 générations IA ;
- suppression de compte conforme au RGPD ;
- mode démo avec données fictives (`DEMO_MODE=true`).

## Stack technique

- **Framework** : Next.js 15 (App Router), React 19, TypeScript
- **UI** : Tailwind CSS, Radix UI, lucide-react
- **Base de données et authentification** : Supabase (PostgreSQL avec RLS)
- **IA** : Anthropic Claude (`@anthropic-ai/sdk`)
- **Paiement** : Stripe
- **PDF et XML** : `@react-pdf/renderer`, `xmlbuilder2`
- **Tests** : Vitest

## Démarrage

### Prérequis

- Node.js 20 ou supérieur
- Un projet Supabase, une clé API Anthropic et un compte Stripe

### Installation

```bash
npm install
cp .env.example .env.local
```

Renseignez ensuite les variables dans `.env.local`.

### Base de données

Dans l'éditeur SQL de Supabase, exécutez `supabase/schema.sql`, puis les migrations de `supabase/migrations/` dans l'ordre (`0001` → `0003`).

### Lancement

```bash
npm run dev
```

L'application est disponible sur http://localhost:3000.

## Variables d'environnement

| Variable | Usage |
|----------|-------|
| `ANTHROPIC_API_KEY` | Appels à l'API Claude |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé serveur Supabase (opérations privilégiées) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Vérification de signature des webhooks Stripe |
| `STRIPE_PRICE_ESSENTIEL` | Price ID Stripe du plan Essentiel |
| `STRIPE_PRICE_PRO` | Price ID Stripe du plan Pro |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'application |
| `DEMO_MODE` | `true` pour activer le mode démo |

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrage du build de production |
| `npm run lint` | Lint |
| `npm test` | Tests unitaires (Vitest) |

## Structure du projet

```
app/
  (auth)/          Connexion et inscription
  (dashboard)/     Espace client : clients, devis, factures, agents, paramètres
  api/             Routes API : agents IA, CRUD, Stripe, Factur-X, compte
  blog/, cgv/, …   Pages publiques
lib/
  agents/          Prompts et logique des agents IA
  documents/       Numérotation et calcul des totaux
  facturx/         Génération XML Factur-X
  plans/           Plans, quotas et correspondance avec les prix Stripe
  supabase/        Clients Supabase (navigateur et serveur)
  demo/            Données et clients fictifs du mode démo
supabase/          Schéma SQL et migrations
tests/             Tests unitaires
```

## Documentation complémentaire

- [`RAPPORT.md`](RAPPORT.md) : audit de sécurité et interventions réalisées
- [`DIAGNOSTIC.md`](DIAGNOSTIC.md) : inventaire des routes et dépendances
- [`maquette.html`](maquette.html) : maquette de la landing page (ouvrir dans un navigateur)

## License

This project is licensed under the MIT License — see the LICENSE file.
