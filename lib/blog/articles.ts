export interface Article {
  slug: string;
  titre: string;
  description: string;
  datePublication: string;
  dateModification: string;
  categorie: string;
  tempsLecture: number;
  motsCles: string[];
  contenu: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "mentions-obligatoires-facture-2026",
    titre: "Les mentions obligatoires sur une facture en France en 2026",
    description:
      "Découvrez toutes les mentions légalement obligatoires sur vos factures en France en 2026 : SIRET, TVA, numérotation, délais de paiement, pénalités. Guide complet pour artisans et TPE.",
    datePublication: "2026-01-15",
    dateModification: "2026-05-01",
    categorie: "Facturation",
    tempsLecture: 8,
    motsCles: [
      "mentions obligatoires facture",
      "facture conforme france",
      "mentions légales facture artisan",
      "que mettre sur une facture",
    ],
    contenu: `
<h2>Pourquoi les mentions obligatoires sur une facture sont-elles importantes ?</h2>
<p>En France, une facture n'est pas un simple document commercial — c'est un document légal encadré par l'article L441-9 du Code de commerce. Omettre une mention obligatoire peut entraîner des sanctions fiscales et rendre la facture non déductible pour votre client. En 2026, de nouvelles obligations s'ajoutent avec la réforme de la facturation électronique (RFE).</p>

<h2>Les mentions obligatoires sur toute facture en France</h2>

<h3>1. Identification de l'émetteur</h3>
<ul>
  <li><strong>Nom ou raison sociale</strong> de l'entreprise</li>
  <li><strong>Adresse complète</strong> du siège social</li>
  <li><strong>Numéro SIRET</strong> (14 chiffres)</li>
  <li><strong>Numéro de TVA intracommunautaire</strong> (si assujetti)</li>
  <li>Forme juridique et capital social (SARL, SAS, etc.)</li>
  <li>Numéro d'immatriculation RCS ou RM</li>
</ul>

<h3>2. Identification du client</h3>
<ul>
  <li>Nom ou raison sociale du client</li>
  <li>Adresse de facturation</li>
  <li>Numéro de TVA intracommunautaire (transactions B2B)</li>
</ul>

<h3>3. Numérotation et dates</h3>
<ul>
  <li><strong>Numéro de facture unique</strong> basé sur une séquence chronologique continue (ex: FAC-2026-0001)</li>
  <li>Date d'émission de la facture</li>
  <li>Date de la prestation ou de la livraison</li>
</ul>

<h3>4. Description des prestations</h3>
<ul>
  <li>Dénomination précise des produits ou services</li>
  <li>Quantité et prix unitaire hors taxes</li>
  <li>Taux de TVA applicable par ligne</li>
  <li>Total HT, montant de TVA, total TTC</li>
</ul>

<h3>5. Conditions de règlement</h3>
<ul>
  <li><strong>Date d'échéance</strong> ou délai de paiement</li>
  <li>Conditions d'escompte (même si "escompte : néant")</li>
  <li><strong>Pénalités de retard</strong> : taux (minimum 3× le taux légal) et indemnité forfaitaire de 40€</li>
</ul>

<h2>Mentions spécifiques selon votre statut</h2>

<h3>Auto-entrepreneur en franchise de TVA</h3>
<p>Si vous êtes auto-entrepreneur et ne facturez pas la TVA, vous devez obligatoirement ajouter la mention : <strong>"TVA non applicable, art. 293 B du CGI"</strong>. Sans cette mention, votre facture est non conforme.</p>

<h3>Artisans du bâtiment (RGE, garanties)</h3>
<p>Les artisans certifiés RGE doivent mentionner leur numéro de certification. La garantie décennale et l'assurance responsabilité civile professionnelle doivent également figurer sur les documents commerciaux.</p>

<h2>Les nouvelles obligations 2026 avec la RFE</h2>
<p>À partir du 1er septembre 2026 (grandes entreprises) et du 1er septembre 2027 (TPE/PME), deux nouvelles mentions deviennent obligatoires :</p>
<ul>
  <li><strong>Catégorie de l'opération</strong> : préciser s'il s'agit d'une livraison de biens, d'une prestation de services, ou des deux</li>
  <li><strong>Option TVA sur les débits</strong> : si vous avez opté pour cette option, la mention doit apparaître</li>
</ul>

<h2>Comment Gestia gère les mentions obligatoires automatiquement</h2>
<p>Gestia génère automatiquement toutes les mentions légales obligatoires sur vos factures. Inès, notre agent IA spécialisé en facturation, connaît la législation française et ajoute systématiquement :</p>
<ul>
  <li>La mention "TVA non applicable art. 293 B du CGI" pour les auto-entrepreneurs</li>
  <li>Les pénalités de retard (3× le taux légal + 40€ d'indemnité forfaitaire)</li>
  <li>La catégorie d'opération RFE 2026</li>
  <li>Vos mentions RGE, assurance décennale si renseignées dans vos paramètres</li>
</ul>
<p>Vos factures sont également générées au format <strong>Factur-X</strong> (PDF/A-3 + XML CII), conforme à la réforme de la facturation électronique 2026.</p>
`,
  },
  {
    slug: "facture-auto-entrepreneur-tva",
    titre: "Facturation auto-entrepreneur : TVA, mentions obligatoires et outils en 2026",
    description:
      "Guide complet pour facturer en tant qu'auto-entrepreneur en 2026 : franchise en base de TVA, mentions obligatoires, numérotation, et outils pour automatiser votre facturation.",
    datePublication: "2026-01-22",
    dateModification: "2026-05-01",
    categorie: "Auto-entrepreneur",
    tempsLecture: 7,
    motsCles: [
      "facturation auto-entrepreneur",
      "facture auto-entrepreneur tva",
      "mentions obligatoires auto-entrepreneur",
      "logiciel facturation auto-entrepreneur",
    ],
    contenu: `
<h2>Auto-entrepreneur et TVA : la franchise en base</h2>
<p>La grande majorité des auto-entrepreneurs bénéficient du régime de la <strong>franchise en base de TVA</strong> (article 293 B du CGI). Cela signifie que vous ne facturez pas la TVA à vos clients et que vous ne la récupérez pas non plus sur vos achats.</p>

<h3>Seuils de franchise en base 2026</h3>
<ul>
  <li><strong>Prestations de services</strong> : 36 800 € de CA annuel</li>
  <li><strong>Ventes de marchandises</strong> : 91 900 € de CA annuel</li>
  <li>Seuils de tolérance (1 an) : 39 100 € et 101 000 €</li>
</ul>

<h2>La mention obligatoire TVA sur vos factures</h2>
<p>Dès lors que vous êtes en franchise de TVA, <strong>chaque facture doit impérativement mentionner</strong> : <em>"TVA non applicable, art. 293 B du CGI"</em></p>
<p>Cette mention est non négociable. Son absence rend votre facture non conforme et peut exposer votre client à des difficultés fiscales.</p>

<h2>La numérotation de vos factures</h2>
<p>Même en tant qu'auto-entrepreneur, vos factures doivent suivre une <strong>numérotation chronologique continue</strong>. Vous ne pouvez pas recommencer à zéro chaque année ni laisser des trous dans la séquence.</p>
<p>Format recommandé : <code>FAC-2026-0001</code>, <code>FAC-2026-0002</code>, etc.</p>

<h2>Les autres mentions obligatoires pour l'auto-entrepreneur</h2>
<ul>
  <li>Votre nom et prénom (ou nom commercial)</li>
  <li>Votre adresse</li>
  <li>Votre numéro SIRET</li>
  <li>La date et le numéro de la facture</li>
  <li>La description précise de la prestation</li>
  <li>Le montant TTC (= HT puisque pas de TVA)</li>
  <li>Les pénalités de retard</li>
</ul>

<h2>Facturation électronique 2026 : ce qui change pour les auto-entrepreneurs</h2>
<p>À partir du <strong>1er septembre 2027</strong>, les auto-entrepreneurs devront émettre leurs factures B2B au format électronique structuré (Factur-X ou équivalent). Cette obligation concerne toutes les factures émises à destination d'autres entreprises françaises assujetties à la TVA.</p>

<h2>Automatiser votre facturation avec Gestia</h2>
<p>Gestia est conçu spécifiquement pour les auto-entrepreneurs français. Notre agent Inès génère vos factures en 30 secondes avec toutes les mentions obligatoires pré-remplies, y compris la mention 293 B du CGI et la numérotation chronologique conforme.</p>
`,
  },
  {
    slug: "factur-x-2026-guide-tpe",
    titre: "Factur-X 2026 : le guide complet pour les TPE et artisans",
    description:
      "Tout comprendre sur la réforme de la facturation électronique 2026 et le format Factur-X. Calendrier, obligations, format technique et outils pour être prêt dès septembre 2026.",
    datePublication: "2026-02-05",
    dateModification: "2026-05-01",
    categorie: "Facturation électronique",
    tempsLecture: 10,
    motsCles: [
      "factur-x 2026",
      "facturation électronique tpe",
      "réforme facturation électronique",
      "rfe 2026 artisan",
    ],
    contenu: `
<h2>Qu'est-ce que la réforme de la facturation électronique (RFE) 2026 ?</h2>
<p>La réforme de la facturation électronique (RFE) est une obligation légale qui va transformer la façon dont les entreprises françaises émettent et reçoivent leurs factures B2B. À terme, les PDF envoyés par email ne seront plus suffisants : il faudra utiliser des formats structurés comme le <strong>Factur-X</strong>.</p>

<h2>Le calendrier de la réforme</h2>
<ul>
  <li><strong>1er septembre 2026</strong> : obligation de recevoir des factures électroniques pour toutes les entreprises</li>
  <li><strong>1er septembre 2027</strong> : obligation d'émettre des factures électroniques pour les TPE, PME et micro-entreprises</li>
</ul>

<h2>Qu'est-ce que le format Factur-X ?</h2>
<p>Le Factur-X est un format hybride qui combine :</p>
<ul>
  <li>Un <strong>PDF visuel</strong> lisible par l'humain (comme vos factures actuelles)</li>
  <li>Un <strong>fichier XML structuré</strong> intégré au PDF, lisible par les logiciels de comptabilité</li>
</ul>
<p>Ce format permet à vos clients d'importer automatiquement vos factures dans leur comptabilité, sans ressaisie manuelle.</p>

<h2>Les profils Factur-X</h2>
<ul>
  <li><strong>MINIMUM</strong> : données essentielles seulement</li>
  <li><strong>BASIC WL</strong> : sans lignes de détail</li>
  <li><strong>BASIC</strong> : avec lignes de détail — recommandé pour les TPE ✅</li>
  <li><strong>EN 16931</strong> : profil complet</li>
  <li><strong>EXTENDED</strong> : pour les grandes entreprises</li>
</ul>

<h2>Ce que ça change concrètement pour un artisan</h2>
<p>En pratique, si vous utilisez un logiciel conforme comme Gestia, <strong>vous n'avez rien à faire</strong>. Le format Factur-X est généré automatiquement. Votre facture ressemble exactement à aujourd'hui pour vous et votre client, mais elle contient en plus le fichier XML qui permet l'import automatique chez votre client.</p>

<h2>Gestia et la conformité Factur-X</h2>
<p>Gestia génère nativement des factures au format Factur-X profil BASIC, validées par le validateur officiel FNFE-MPE. Chaque facture contient :</p>
<ul>
  <li>Le PDF visuel en DA ivoire premium</li>
  <li>Le fichier XML CII conforme EN 16931</li>
  <li>Tous les codes TVA corrects (S pour TVA standard, E + VATEX-EU-132 pour franchise)</li>
  <li>L'IBAN pour le règlement par virement</li>
</ul>
`,
  },
  {
    slug: "creer-devis-professionnel-artisan",
    titre: "Comment créer un devis professionnel pour artisan en 2026",
    description:
      "Modèle et guide pour créer un devis professionnel en tant qu'artisan. Mentions obligatoires, structure, délai de validité et astuces pour maximiser vos conversions.",
    datePublication: "2026-02-18",
    dateModification: "2026-05-01",
    categorie: "Devis",
    tempsLecture: 6,
    motsCles: [
      "devis professionnel artisan",
      "créer devis artisan",
      "modèle devis artisan",
      "mentions obligatoires devis",
    ],
    contenu: `
<h2>Pourquoi un devis professionnel est-il indispensable pour un artisan ?</h2>
<p>Le devis est votre premier document commercial. Un devis professionnel inspire confiance, protège juridiquement en cas de litige, et augmente votre taux de conversion. Un artisan qui envoie un devis soigné sera perçu comme plus sérieux qu'un concurrent qui envoie un SMS avec un prix approximatif.</p>

<h2>Les mentions obligatoires sur un devis</h2>
<p>Contrairement à la facture, le devis n'est pas strictement encadré par la loi pour la plupart des secteurs. Cependant, certaines professions ont des obligations spécifiques :</p>

<h3>Pour tous les artisans</h3>
<ul>
  <li>Nom, adresse et SIRET de l'entreprise</li>
  <li>Nom et adresse du client</li>
  <li>Date d'émission et numéro du devis</li>
  <li>Description détaillée des travaux ou prestations</li>
  <li>Prix unitaires HT, taux de TVA, total TTC</li>
  <li>Durée de validité du devis</li>
</ul>

<h3>Obligatoire pour les artisans du bâtiment</h3>
<p>Pour tout devis de travaux de plus de 150€, le devis est obligatoire et doit mentionner :</p>
<ul>
  <li>La mention "Devis gratuit" ou le prix du devis si payant</li>
  <li>La qualification RGE si applicable</li>
  <li>L'assurance décennale</li>
</ul>

<h2>Structure d'un devis professionnel efficace</h2>

<h3>Bloc 1 : En-tête</h3>
<p>Logo + coordonnées complètes de votre entreprise à gauche, informations du client à droite. Numéro du devis et date bien visibles.</p>

<h3>Bloc 2 : Détail des prestations</h3>
<p>Chaque ligne doit être claire : description, quantité, prix unitaire HT, total HT. Évitez les termes techniques que votre client ne comprendra pas.</p>

<h3>Bloc 3 : Totaux</h3>
<p>Total HT, TVA, total TTC. Si vous êtes auto-entrepreneur : total TTC = total HT avec la mention "TVA non applicable art. 293 B du CGI".</p>

<h3>Bloc 4 : Conditions</h3>
<p>Durée de validité (30 jours recommandés), conditions de paiement, acompte demandé, délai d'exécution.</p>

<h2>Générer un devis professionnel en 30 secondes avec Gestia</h2>
<p>Inès, l'agent IA de Gestia, génère vos devis complets à partir d'une description en langage naturel. Vous décrivez la prestation, Inès structure les lignes, calcule les totaux, ajoute les mentions légales et génère le PDF. Vos devis sont sauvegardés comme modèles pour les réutiliser avec de nouveaux clients.</p>
`,
  },
  {
    slug: "relance-facture-impayee-modele",
    titre: "Relancer une facture impayée : 3 modèles de mail efficaces",
    description:
      "Comment relancer un client qui ne paie pas ? 3 modèles d'email de relance (cordiale, ferme, mise en demeure) + conseils pratiques pour récupérer vos impayés.",
    datePublication: "2026-03-01",
    dateModification: "2026-05-01",
    categorie: "Gestion clients",
    tempsLecture: 5,
    motsCles: [
      "relance facture impayée",
      "modèle mail relance client",
      "recouvrement facture",
      "lettre relance impayé",
    ],
    contenu: `
<h2>Quand relancer un client qui ne paie pas ?</h2>
<p>En France, le délai légal de paiement entre professionnels est de <strong>30 jours après réception de la facture</strong> (60 jours maximum si accord contractuel). Au-delà, votre client est en retard de paiement et vous pouvez légalement appliquer des pénalités.</p>

<h3>Stratégie des 3 niveaux de relance</h3>
<ul>
  <li><strong>J+0 à J+15</strong> : Relance cordiale — rappel amical, le client a peut-être juste oublié</li>
  <li><strong>J+15 à J+30</strong> : Relance ferme — ton plus direct, rappel des pénalités</li>
  <li><strong>J+30 et au-delà</strong> : Mise en demeure — document formel, dernière étape avant procédure</li>
</ul>

<h2>Modèle 1 : Email de relance cordiale</h2>
<div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0;">
<p><strong>Objet :</strong> Facture n°FAC-2026-0042 — Rappel amical</p>
<p>Bonjour [Prénom],</p>
<p>J'espère que vous allez bien. Je me permets de vous contacter concernant la facture n°FAC-2026-0042 d'un montant de [montant] €, émise le [date] et dont le règlement était attendu pour le [échéance].</p>
<p>Il s'agit peut-être d'un simple oubli. Pourriez-vous régulariser cette situation dans les prochains jours ?</p>
<p>N'hésitez pas à me contacter si vous avez la moindre question.</p>
<p>Cordialement,<br>[Votre nom]</p>
</div>

<h2>Modèle 2 : Email de relance ferme</h2>
<div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0;">
<p><strong>Objet :</strong> Facture n°FAC-2026-0042 — Relance avant pénalités</p>
<p>Bonjour [Prénom],</p>
<p>Malgré mon précédent message, je constate que la facture n°FAC-2026-0042 d'un montant de [montant] € reste impayée à ce jour.</p>
<p>Je vous rappelle que conformément à la loi, des pénalités de retard au taux de 3× le taux légal sont applicables depuis le [date d'échéance], ainsi qu'une indemnité forfaitaire de recouvrement de 40€.</p>
<p>Je vous demande de bien vouloir procéder au règlement sous 8 jours ouvrés.</p>
<p>Dans l'attente, je reste à votre disposition.</p>
<p>[Votre nom]</p>
</div>

<h2>Modèle 3 : Mise en demeure</h2>
<div style="background:#fff3f3;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #dc2626;">
<p><strong>Objet :</strong> MISE EN DEMEURE — Facture n°FAC-2026-0042</p>
<p>Madame, Monsieur,</p>
<p>Par la présente, je vous mets en demeure de régler sous <strong>8 jours</strong> la somme de [montant] € correspondant à la facture n°FAC-2026-0042 du [date], augmentée des pénalités de retard ([montant pénalités] €) et de l'indemnité forfaitaire légale de 40€.</p>
<p>À défaut de règlement dans ce délai, je me verrai contraint(e) d'engager une procédure de recouvrement, dont les frais seront à votre charge.</p>
<p>[Signature + coordonnées complètes]</p>
</div>

<h2>Automatiser vos relances avec Gestia</h2>
<p>Gestia génère automatiquement vos relances à 3 niveaux via Inès. Elle adapte le ton selon le nombre de relances déjà envoyées, personnalise avec le nom du client et le montant exact, et intègre automatiquement les références légales correctes.</p>
`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesParCategorie(categorie: string): Article[] {
  return ARTICLES.filter((a) => a.categorie === categorie);
}
