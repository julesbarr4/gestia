# Handoff — Refonte landing Gestia (premium)

## Vue d'ensemble

Refonte de la landing page publique de **Gestia** (`app/page.tsx`) pour un design haut de gamme dans la veine **Linear / Stripe / Pennylane**, en remplacement de la version "shadcn bleu par défaut" actuelle.

**Périmètre strict :** uniquement la home `/`. Les pages annexes (`/equipe`, `/login`, `/signup`, `/cgv`, `/confidentialite`, `/contact`, dashboard) sont **inchangées** et seront retravaillées dans un second temps. Le contenu est préservé à 100% : noms d'agents, tarifs, témoignages, claims (5h/semaine, 30s/devis, etc.).

## À propos des fichiers de ce bundle

Les fichiers livrés ici sont des **références de design créées en HTML/JSX** — un prototype montrant le rendu visuel et les interactions souhaités, **pas du code de production à copier-coller**. La tâche est de **recréer ce design dans le codebase Next.js existant** (`app/page.tsx`) en utilisant les patterns établis : Tailwind, composants Radix UI déjà en place, conventions du projet.

## Fidélité

**Haute fidélité (hifi)** — Le prototype est pixel-perfect : couleurs finales, typographie, espacements, interactions. À recréer fidèlement dans Next.js + Tailwind.

## Stack cible

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 3.4** (config existante dans `tailwind.config.ts`)
- **Radix UI** + composants déjà installés
- **lucide-react** pour les icônes (à privilégier sur les SVG inline du prototype)

---

## Direction artistique

### Palette (à ajouter dans `app/globals.css`)

```css
:root {
  --ivory:    #FBF8F3;  /* fond principal — ivoire chaud */
  --ivory-2:  #F4EFE6;  /* fond secondaire (sections alternées, cartes) */
  --ink:      #0E0E0E;  /* texte principal, noir profond */
  --ink-2:    #4A4A47;  /* texte secondaire */
  --ink-3:    #8A8780;  /* texte tertiaire / labels */
  --line:     #E5DFD2;  /* bordures, séparateurs */
  --accent:   oklch(0.42 0.05 155); /* vert sapin profond — accent unique */
  --radius:   14px;
}
```

> **Note** : la couleur `--accent` est en `oklch`. Tous les navigateurs cibles (Chrome 111+, Safari 15.4+, Firefox 113+) la supportent.

### Couleurs des agents (héritées de `lib/agents/team-data.ts`, à conserver)

| Agent    | Rôle                       | Couleur   |
|----------|----------------------------|-----------|
| Inès     | Assistante administrative  | `#2563eb` |
| Léa      | Service client             | `#059669` |
| Hugo     | Directeur financier        | `#7c3aed` |
| Cyprien  | Directeur marketing        | `#ea580c` |
| Augustin | Directeur général          | `#111827` |

### Typographie

3 familles via Google Fonts :

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

| Usage                          | Famille            | Détails                                     |
|--------------------------------|--------------------|---------------------------------------------|
| Titres (H1, H2, H3)            | Instrument Serif   | weight 400, l'italique est utilisé pour mettre en valeur des bouts de phrase |
| Corps, UI, boutons             | Geist              | weights 300/400/500/600                     |
| Chiffres, codes, montants      | Geist Mono         | weights 400/500, `font-feature-settings: "tnum"` |

À ajouter dans `tailwind.config.ts` :

```ts
fontFamily: {
  sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
  serif: ["Instrument Serif", "ui-serif", "Georgia", "serif"],
  mono: ["Geist Mono", "ui-monospace", "monospace"],
}
```

### Tonalité éditoriale

- **Titres** : phrases coupées avec une partie en italique colorée accent. Ex : `Le cabinet exécutif <em>qui ne dort jamais.</em>`
- **Pas d'emoji** dans la landing.
- **Pas d'icônes Lucide imposées** dans les titres — on s'appuie sur la typographie et les visuels produit.

---

## Sections (dans l'ordre)

### 1. Navbar (fixe)

- Hauteur 72px, fond transparent au top, devient `bg-[var(--ivory)]/85 backdrop-blur-md` + bordure basse au scroll (>8px)
- Layout : `[Logo] · [Nav links centrés] · [Connexion + Démarrer]`
- Liens : L'équipe, Fonctionnalités, Tarifs, Manifeste
- CTA "Démarrer" : pilule noire `bg-[var(--ink)] text-[var(--ivory)]`, hover → fond accent vert

### 2. Hero

- `pt-[140px] pb-20`
- Halo radial subtil au-dessus (gradient accent vert à 12%)
- Surtitre fin en majuscules tracking large : `Gestia · Conforme facturation électronique 2026` entouré de lignes
- **H1** en Instrument Serif `clamp(48px, 7.4vw, 104px)`, line-height 0.96, tracking `-0.025em` :
  > Le cabinet exécutif  
  > *qui ne dort jamais.* (italique + couleur accent)
- Sous-titre 18-19px, max-width 640px : "Gestia est une équipe de cinq agents intelligents — administratif, support, finance, marketing, stratégie — qui prennent en charge la gestion de votre entreprise. Gagnez 5h par semaine dès le premier jour."
- 2 CTAs côte à côte : "Démarrer en 2 minutes" (pilule noire) + "Rencontrer l'équipe" (texte ghost)
- Microcopie : "14 jours d'essai · sans carte bancaire · résiliable en un clic"
- **Mockup dashboard** sous le hero (voir section dédiée)

### 3. Mockup dashboard (cœur du hero)

- Frame externe : `rounded-[18px] bg-[var(--ink)] p-2`, ombre profonde
- Frame interne : `rounded-[12px] bg-[var(--ivory)]`
- Top chrome : 3 dots gris + URL `app.gestia.fr/cockpit` en mono
- Layout interne : `[Sidebar 200px] [Main 1fr]`
- **Sidebar** : logo, nav (Cockpit actif, Clients, Devis & factures, Trésorerie, Marketing, Boîte de réception, Rapports), bloc "L'équipe" avec 5 avatars empilés (Inès bleu, Léa émeraude, Hugo violet, Cyprien orange, Augustin gris)
- **Main** :
  - Date "Mercredi 29 avril 2026" + titre serif "Bonjour Jules — voici votre semaine"
  - Badge "5 agents actifs" avec point pulsant vert
  - 3 cartes stats : Trésorerie 84 320,50 € (+12,4%), À encaisser 23 400,00 € (5 factures), Marge nette 31,8 % (+2,1 pts)
  - Sparkline trésorerie 90 jours (SVG path avec area fill accent)
  - Feed activité de l'équipe (3 dernières actions)
- **2 callouts flottants** absolus de chaque côté (devis Atelier Mira / email Mme Lefèvre)

### 4. Logo strip

- Bordures haut/bas, fond ivoire
- Surtitre : "1 200+ dirigeants, freelances et PME utilisent Gestia"
- 6 noms placeholder en typo mixte (alternance serif italique / sans medium)

### 5. L'équipe Gestia

- Eyebrow "L'équipe Gestia" + titre "Cinq spécialistes. *Un seul abonnement.*"
- Intro : "5 experts IA qui travaillent 24/7 pour gérer votre administratif, vos finances, vos clients et votre stratégie. L'équivalent d'un cabinet complet, pour 99€/mois."
- Layout 2 colonnes (1.1fr / 1fr) :
  - **Gauche** : liste verticale des 5 agents avec hover. Chaque ligne = avatar circulaire (initiale en serif, fond couleur agent) + nom serif + rôle italique gris + description 1 ligne + flèche
  - **Droite** : carte détail sticky `bg-[var(--ink)] text-[var(--ivory)]` avec :
    - Halo flou de la couleur agent en haut à droite
    - Avatar XL + nom + rôle
    - Description complète
    - Liste compétences clés (`✓` en couleur agent)
    - 3 stats hebdo en mono : Tâches 47 / Temps 5h12 / Économies 1 240€
- **Données** : utiliser `lib/agents/team-data.ts` existant (`prenom`, `role`, `description`, `missions`, `style.accentBg`)

### 6. Fonctionnalités

- Eyebrow "Le produit" + titre serif sur 2 lignes
- Grille **lg:grid-cols-12** asymétrique :
  - Carte 1 : `col-span-7 row-span-2` (devis & factures, mockup document)
  - Carte 2 : `col-span-5` (boîte de réception)
  - Carte 3 : `col-span-5` (rapport financier)
  - Carte 4 : `col-span-6` (marketing)
  - Carte 5 : `col-span-6` (stratégie)
- Chaque carte : `bg-white border border-[var(--line)] rounded-2xl`, padding 28px, eyebrow accent + titre serif 26-30px + body + visuel produit
- **5 visuels custom** (SVG/HTML) à reproduire :
  - **Devis** : barre de prompt avec avatar Inès + chrono "28s", document de devis avec lignes simulées et total
  - **Email** : liste 3 emails avec point coloré (Sarah/Léa répond en pulsé)
  - **Rapport** : 7 barres verticales Lun→Dim, avec gradient d'opacité montant
  - **Marketing** : carte brouillon LinkedIn (avatar Cyprien) + carte stat "+184% portée organique"
  - **Stratégie** : 3 priorités numérotées avec badge "Élevé" / "Moyen"

### 7. Comment ça marche

- 3 étapes en grille avec séparateurs `gap-px bg-[var(--line)]` (effet de bloc unique)
- Numéro 01/02/03 en mono petit + titre serif + description
- Steps : "Vous décrivez votre entreprise" / "L'équipe se met au travail (Inès, Hugo, Léa…)" / "Vous validez. Ils exécutent."

### 8. Témoignages

- **Fond `bg-[var(--ink)]` texte ivoire** + halo radial accent en bas
- 3 cartes en grille `bg-white/[0.03] backdrop-blur-sm border-white/10`
- Quote en serif italique 16px, attribution en bas avec avatar coloré
- Témoignages **inchangés** : Sophie M. (graphiste), Thomas R. (consultant marketing), Amina B. (boutique en ligne)

### 9. Tarifs

- Eyebrow + titre "Le prix d'un stagiaire. *Le travail d'un cabinet.*"
- 2 cartes côte à côte (max-w 820px) :
  - **Starter 49€/mois** — Freelances & micro-entrepreneurs
  - **Pro 99€/mois** — PME 1 à 10 salariés (mis en avant : `bg-[var(--ink)] text-[var(--ivory)]`, badge "Recommandé" en haut)
- Prix en mono 44px, features avec checkmark vert accent, CTA pilule large
- **Pas de toggle annuel/mensuel** (était inventé, retiré)

### 10. Manifeste

- Fond ivoire-2, padding vertical 112px
- Bloc texte centré max-w 920px, serif clamp(28px, 3.8vw, 44px) :
  > Diriger une entreprise ne devrait pas être un combat administratif.
  > 
  > *Gestia rend le pilotage à ceux qui pilotent* — pour qu'on ne perde plus une heure à faire ce qu'une équipe entraînée fait en une minute.

### 11. FAQ

- Accordéon avec 6 questions, première ouverte par défaut
- Chaque entrée : titre serif 18px + bouton rond `+`/`−` à droite
- Animation `max-height` + `opacity` 300ms

### 12. CTA final

- Titre énorme serif clamp(44px, 6vw, 80px) : "Votre cabinet vous attend. *Faites les présentations.*"
- 2 CTAs : "Démarrer maintenant" + "Réserver une démo"

### 13. Footer (simple, comme l'original)

- Bordure haute, padding 48px
- 1 ligne flex : `[Logo] · [© 2026 Gestia — JMB TRADING] · [CGV / Confidentialité / Contact]`
- **Pas de colonnes Produit/Société/Ressources** — on conserve la simplicité du footer existant

---

## Système de tokens & utilitaires

### Bordures & rayons

- Bordures fines : `1px solid var(--line)`
- Rayons standards : `rounded-lg` (cartes inline), `rounded-2xl` (cartes principales), `rounded-full` (boutons CTA)

### Ombres

- Hero device : `shadow-[0_30px_80px_-20px_rgba(14,14,14,0.35),0_8px_24px_-8px_rgba(14,14,14,0.18)]`
- Callouts flottants : `shadow-[0_12px_32px_-12px_rgba(14,14,14,0.18)]`
- Cartes hover features : `hover:shadow-md` simple suffit

### Animations

- Points "live" : `animate-pulse` Tailwind
- Hover liens nav : `transition-colors`
- Accordéons FAQ : transition `max-height` + `opacity` 300ms
- Pas d'animations lourdes — design sobre

---

## Comportements interactifs

1. **Navbar scroll** : ajout `bg/85 + backdrop-blur + border` au-delà de 8px de scroll
2. **Liste équipe** : hover/focus → opacity 100% sur la ligne survolée, 60% sur les autres ; carte droite met à jour son contenu
3. **FAQ** : click sur question → toggle ouvert/fermé (un seul à la fois)
4. **CTAs** : hover → fond accent vert (`var(--accent)`)

---

## Composants existants à réutiliser

Le projet a déjà :
- `@radix-ui/react-tabs`, `react-dropdown-menu`, `react-dialog`, `react-toast` — non requis pour la landing
- `clsx`, `tailwind-merge`, `class-variance-authority` — utiliser pour le `cx` helper
- `lucide-react` — préférer aux SVG inline du prototype quand des icônes simples sont nécessaires

---

## Implémentation suggérée dans Next.js

Découper `app/page.tsx` en components co-localisés :

```
app/
  page.tsx                    ← compose les sections
  _components/
    landing/
      Navbar.tsx
      Hero.tsx
      DashboardMockup.tsx
      LogoStrip.tsx
      TeamSection.tsx
      Features.tsx
      HowItWorks.tsx
      Testimonials.tsx
      Pricing.tsx
      Manifesto.tsx
      FAQ.tsx
      FinalCTA.tsx
      Footer.tsx
```

Le fichier `components.jsx` du prototype contient déjà cette structure — chaque fonction = un composant à porter.

---

## Fichiers de référence dans ce bundle

- `Gestia Landing.html` — prototype complet, à ouvrir dans un navigateur pour voir le rendu interactif
- `components.jsx` — code source de tous les composants (à porter en TSX, supprimer le code Tweaks)
- `tweaks-panel.jsx` — panneau de tweaks utilisé pendant le prototypage (**à ne pas porter** — c'est uniquement un outil de design exploration)

---

## À ne pas faire

- ❌ Ne pas modifier les pages annexes (`/equipe`, `/login`, `/signup`, dashboard, CGV, etc.)
- ❌ Ne pas inventer du contenu (toggle annuel, plan Holding, colonnes footer Produit/Société…)
- ❌ Ne pas changer les noms d'agents, les tarifs, ou les témoignages — ils viennent du repo existant
- ❌ Ne pas porter le panneau de Tweaks — c'est un outil de design uniquement
