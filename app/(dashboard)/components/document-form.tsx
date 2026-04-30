"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientSelector } from "./client-selector";
import { formatEuros } from "@/lib/utils";

interface Client {
  id: string;
  nom: string;
  email?: string | null;
  ville?: string | null;
  siret?: string | null;
  telephone?: string | null;
}

interface Ligne {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

interface DocumentResult {
  titre: string;
  lignes: Ligne[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes: string;
  conditions: string;
}

interface Props {
  type: "devis" | "facture";
  clients: Client[];
  agentEndpoint: string;
  sauvegardeEndpoint: string;
  retourHref: string;
  titreIA: string;
}

export function DocumentForm({ type, clients, agentEndpoint, sauvegardeEndpoint, retourHref }: Props) {
  const router = useRouter();

  const [nomClient, setNomClient] = useState("");
  const [clientId, setClientId] = useState<string | undefined>();
  const [clientSiret, setClientSiret] = useState("");
  const [clientTva, setClientTva] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientTelephone, setClientTelephone] = useState("");
  const [clientAdresse, setClientAdresse] = useState("");
  const [clientCodePostal, setClientCodePostal] = useState("");
  const [clientVille, setClientVille] = useState("");
  const [nouveauClientDetecte, setNouveauClientDetecte] = useState(false);
  const [enregistrementClient, setEnregistrementClient] = useState(false);
  const [clientEnregistre, setClientEnregistre] = useState(false);

  const [lignes, setLignes] = useState<Ligne[]>([
    { description: "", quantite: 1, prixUnitaireHT: 0, totalHT: 0 },
  ]);

  const [tauxTVA, setTauxTVA] = useState(20);
  const [tauxAcompte, setTauxAcompte] = useState(0);
  const [tauxEscompte, setTauxEscompte] = useState(0);
  const [conditionsPaiement, setConditionsPaiement] = useState("30 jours fin de mois");
  const [dateEcheance, setDateEcheance] = useState("");
  const [reference, setReference] = useState("");
  const [validite, setValidite] = useState(type === "devis" ? "30" : "");

  const [notes, setNotes] = useState("");
  const [loadingIA, setLoadingIA] = useState(false);
  const [loadingSauvegarde, setLoadingSauvegarde] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);

  const totalHT = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaireHT, 0);
  const montantTVA = totalHT * (tauxTVA / 100);
  const totalTTC = totalHT + montantTVA;
  const montantEscompte = totalTTC * (tauxEscompte / 100);
  const montantAcompte = (totalTTC - montantEscompte) * (tauxAcompte / 100);
  const resteAPayer = totalTTC - montantEscompte - montantAcompte;

  function handleClientChange(nom: string, id?: string, client?: Client) {
    setNomClient(nom);
    setClientId(id);
    setNouveauClientDetecte(!id && nom.trim().length > 0);
    setClientEnregistre(false);
    if (client) {
      setClientSiret(client.siret || "");
      setClientEmail(client.email || "");
      setClientTelephone(client.telephone || "");
    } else if (!id) {
      setClientSiret("");
      setClientTva("");
    }
  }

  function updateLigne(index: number, field: keyof Ligne, value: string | number) {
    setLignes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "quantite" || field === "prixUnitaireHT") {
        updated[index].totalHT = Number(updated[index].quantite) * Number(updated[index].prixUnitaireHT);
      }
      return updated;
    });
  }

  function ajouterLigne() {
    setLignes((prev) => [...prev, { description: "", quantite: 1, prixUnitaireHT: 0, totalHT: 0 }]);
  }

  function supprimerLigne(index: number) {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  }

  async function genererAvecIA() {
    if (!nomClient.trim()) { setErreur("Renseignez d'abord un client."); return; }
    setLoadingIA(true);
    setErreur("");

    const bodyKey = type === "devis" ? "descriptionProjet" : "descriptionPrestations";
    const res = await fetch(agentEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [bodyKey]: notes || `Prestation pour ${nomClient}`,
        nomClient,
        clientId,
        lignesExistantes: lignes.filter(l => l.description.trim()),
      }),
    });

    const data = await res.json();
    if (!res.ok) { setErreur(data.erreur || "Erreur IA"); setLoadingIA(false); return; }

    const doc: DocumentResult = data.document;
    setLignes(doc.lignes.map(l => ({ ...l, totalHT: l.quantite * l.prixUnitaireHT })));
    if (doc.notes && !notes) setNotes(doc.notes);
    setLoadingIA(false);
  }

  async function enregistrerNouveauClient() {
    setEnregistrementClient(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: nomClient,
        siret: clientSiret || undefined,
        email: clientEmail || undefined,
        telephone: clientTelephone || undefined,
        adresse: clientAdresse || undefined,
        code_postal: clientCodePostal || undefined,
        ville: clientVille || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setClientId(data.client.id);
      setClientEnregistre(true);
      setNouveauClientDetecte(false);
    }
    setEnregistrementClient(false);
  }

  async function sauvegarder(e: React.FormEvent) {
    e.preventDefault();
    if (!nomClient.trim()) { setErreur("Client requis"); return; }
    if (lignes.every(l => !l.description.trim())) { setErreur("Ajoutez au moins une prestation"); return; }
    setLoadingSauvegarde(true);
    setErreur("");

    const payload = {
      clientId: clientId || null,
      nomClient,
      clientEmail: clientEmail || null,
      clientTelephone: clientTelephone || null,
      clientAdresse: clientAdresse || null,
      clientCodePostal: clientCodePostal || null,
      clientVille: clientVille || null,
      clientSiret: clientSiret || null,
      clientTva: clientTva || null,
      lignes,
      totalHT,
      totalTVA: montantTVA,
      totalTTC,
      tauxTVA,
      tauxAcompte,
      tauxEscompte,
      conditionsPaiement,
      dateEcheance: dateEcheance || null,
      reference,
      notes,
      ...(type === "devis" ? { validite: Number(validite) } : {}),
    };

    const res = await fetch(sauvegardeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSucces(true);
      setTimeout(() => router.push(retourHref), 1200);
    } else {
      const data = await res.json();
      setErreur(data.erreur || "Erreur lors de la sauvegarde");
    }
    setLoadingSauvegarde(false);
  }

  const L = type === "devis"
    ? { titre: "Générer un devis", agent: "avec Inès.", eyebrow: "NOUVEAU DEVIS", prestLabel: "PRESTATIONS DU DEVIS" }
    : { titre: "Générer une facture", agent: "avec Inès.", eyebrow: "NOUVELLE FACTURE", prestLabel: "DÉTAIL DES PRESTATIONS" };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px", border: "1px solid var(--line)",
    borderRadius: "12px", fontSize: "14px", background: "white",
    color: "var(--ink)", outline: "none", boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = { ...inputStyle };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em",
    color: "var(--ink-3)", display: "block", marginBottom: "6px",
    fontFamily: "Geist Mono, monospace",
  };

  const blocStyle: React.CSSProperties = {
    background: "white", border: "1px solid var(--line)",
    borderRadius: "16px", padding: "24px", marginBottom: "16px",
  };

  const blocHeaderStyle: React.CSSProperties = {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "18px",
  };

  const eyebrowStyle: React.CSSProperties = {
    fontSize: "10.5px", textTransform: "uppercase",
    letterSpacing: "0.16em", color: "var(--ink-3)",
    fontFamily: "Geist Mono, monospace",
  };

  if (succes) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "28px", color: "var(--ink)", marginBottom: "8px" }}>
          {type === "devis" ? "Devis enregistré ✓" : "Facture enregistrée ✓"}
        </p>
        <p style={{ fontSize: "14px", color: "var(--ink-3)" }}>Redirection en cours...</p>
      </div>
    );
  }

  return (
    <form onSubmit={sauvegarder} style={{ maxWidth: "720px" }}>

      <div style={{ marginBottom: "28px" }}>
        <p style={eyebrowStyle}>{L.eyebrow}</p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(28px, 3vw, 38px)", lineHeight: 1.06, color: "var(--ink)", marginTop: "6px" }}>
          {L.titre} <em>{L.agent}</em>
        </h1>
      </div>

      {erreur && (
        <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "12px", border: "1px solid #FECACA", marginBottom: "16px" }}>
          {erreur}
        </div>
      )}

      {/* BLOC 01 — CLIENT */}
      <div style={blocStyle}>
        <div style={blocHeaderStyle}>
          <span style={eyebrowStyle}>01 — Client</span>
          {clientEnregistre && (
            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", background: "color-mix(in oklch, var(--accent) 12%, transparent)", color: "var(--accent)", padding: "3px 10px", borderRadius: "999px" }}>
              Client enregistré ✓
            </span>
          )}
        </div>

        <ClientSelector clients={clients} value={nomClient} clientId={clientId} onChange={handleClientChange} />

        {nouveauClientDetecte && !clientEnregistre && nomClient.trim().length > 1 && (
          <div style={{ marginTop: "12px", padding: "12px 14px", background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "12.5px", color: "var(--ink)", fontWeight: 500 }}>
                &ldquo;{nomClient}&rdquo; n&rsquo;est pas encore dans vos clients.
              </p>
              <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "2px" }}>
                Voulez-vous l&rsquo;enregistrer pour le retrouver facilement&nbsp;?
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button type="button" onClick={() => setNouveauClientDetecte(false)} style={{ fontSize: "12px", color: "var(--ink-3)", background: "none", border: "1px solid var(--line)", borderRadius: "999px", padding: "5px 12px", cursor: "pointer" }}>
                Ignorer
              </button>
              <button type="button" onClick={enregistrerNouveauClient} disabled={enregistrementClient} style={{ fontSize: "12px", color: "var(--ivory)", background: "var(--ink)", border: "none", borderRadius: "999px", padding: "5px 14px", cursor: "pointer" }}>
                {enregistrementClient ? "..." : "Enregistrer →"}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "14px" }}>
          <div>
            <label style={labelStyle}>SIRET client</label>
            <input style={inputStyle} value={clientSiret} onChange={(e) => setClientSiret(e.target.value)} placeholder="123 456 789 00012" />
          </div>
          <div>
            <label style={labelStyle}>N° TVA intracommunautaire</label>
            <input style={inputStyle} value={clientTva} onChange={(e) => setClientTva(e.target.value)} placeholder="FR 12 345678901" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
          <div>
            <label style={labelStyle}>EMAIL CLIENT</label>
            <input
              style={inputStyle}
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="contact@exemple.fr"
            />
          </div>
          <div>
            <label style={labelStyle}>TÉLÉPHONE CLIENT</label>
            <input
              style={inputStyle}
              value={clientTelephone}
              onChange={(e) => setClientTelephone(e.target.value)}
              placeholder="06 12 34 56 78"
            />
          </div>
          <div>
            <label style={labelStyle}>ADRESSE CLIENT</label>
            <input
              style={inputStyle}
              value={clientAdresse}
              onChange={(e) => setClientAdresse(e.target.value)}
              placeholder="10 rue de la Paix"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "8px" }}>
            <div>
              <label style={labelStyle}>CODE POSTAL</label>
              <input
                style={inputStyle}
                value={clientCodePostal}
                onChange={(e) => setClientCodePostal(e.target.value)}
                placeholder="75001"
              />
            </div>
            <div>
              <label style={labelStyle}>VILLE</label>
              <input
                style={inputStyle}
                value={clientVille}
                onChange={(e) => setClientVille(e.target.value)}
                placeholder="Paris"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BLOC 02 — PRESTATIONS */}
      <div style={blocStyle}>
        <div style={blocHeaderStyle}>
          <span style={eyebrowStyle}>02 — {L.prestLabel}</span>
          <button type="button" onClick={genererAvecIA} disabled={loadingIA}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--ivory)", background: loadingIA ? "var(--ink-3)" : "var(--ink)", border: "none", borderRadius: "999px", padding: "6px 14px", cursor: loadingIA ? "not-allowed" : "pointer" }}
          >
            {loadingIA ? (
              <><span style={{ width: "10px", height: "10px", border: "1.5px solid rgba(251,248,243,0.4)", borderTopColor: "var(--ivory)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Inès génère...</>
            ) : "✦ Générer avec Inès"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 60px 100px 100px 28px", gap: "6px", marginBottom: "6px" }}>
          {["DESCRIPTION", "QTÉ", "PRIX HT", "TOTAL HT", ""].map((h) => (
            <span key={h} style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>{h}</span>
          ))}
        </div>

        {lignes.map((ligne, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 60px 100px 100px 28px", gap: "6px", marginBottom: "6px", alignItems: "center" }}>
            <input style={{ ...inputStyle, padding: "8px 10px" }} value={ligne.description} onChange={(e) => updateLigne(i, "description", e.target.value)} placeholder="Description de la prestation" />
            <input style={{ ...inputStyle, padding: "8px 6px", textAlign: "center" }} type="number" min="0" step="0.5" value={ligne.quantite} onChange={(e) => updateLigne(i, "quantite", parseFloat(e.target.value) || 0)} />
            <input style={{ ...inputStyle, padding: "8px 10px", textAlign: "right" }} type="number" min="0" step="0.01" value={ligne.prixUnitaireHT} onChange={(e) => updateLigne(i, "prixUnitaireHT", parseFloat(e.target.value) || 0)} placeholder="0" />
            <div style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", textAlign: "right", padding: "0 4px" }}>
              {formatEuros(ligne.totalHT)}
            </div>
            {lignes.length > 1 && (
              <button type="button" onClick={() => supprimerLigne(i)} style={{ background: "none", border: "none", color: "var(--ink-3)", cursor: "pointer", fontSize: "18px", padding: "0", textAlign: "center" as const, lineHeight: 1 }}>×</button>
            )}
          </div>
        ))}

        <button type="button" onClick={ajouterLigne} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--ink-3)", border: "1px dashed var(--line)", borderRadius: "10px", padding: "7px 12px", cursor: "pointer", background: "none", marginTop: "4px" }}>
          + Ajouter une ligne
        </button>
      </div>

      {/* BLOC 03 — PARAMÈTRES FINANCIERS */}
      <div style={blocStyle}>
        <div style={blocHeaderStyle}>
          <span style={eyebrowStyle}>03 — Paramètres financiers</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={labelStyle}>TVA</label>
            <select style={selectStyle} value={tauxTVA} onChange={(e) => setTauxTVA(Number(e.target.value))}>
              <option value={20}>20% (standard)</option>
              <option value={10}>10% (réduit)</option>
              <option value={5.5}>5,5% (super-réduit)</option>
              <option value={2.1}>2,1% (particulier)</option>
              <option value={0}>0% (auto-entrepreneur)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Acompte</label>
            <select style={selectStyle} value={tauxAcompte} onChange={(e) => setTauxAcompte(Number(e.target.value))}>
              <option value={0}>Aucun acompte</option>
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Escompte</label>
            <select style={selectStyle} value={tauxEscompte} onChange={(e) => setTauxEscompte(Number(e.target.value))}>
              <option value={0}>Aucun escompte</option>
              <option value={1}>1%</option>
              <option value={2}>2%</option>
              <option value={3}>3%</option>
              <option value={5}>5%</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={labelStyle}>Conditions de paiement</label>
            <select style={selectStyle} value={conditionsPaiement} onChange={(e) => setConditionsPaiement(e.target.value)}>
              <option>À réception</option>
              <option>30 jours fin de mois</option>
              <option>30 jours</option>
              <option>45 jours</option>
              <option>60 jours</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{type === "devis" ? "Validité du devis" : "Date d'échéance"}</label>
            {type === "devis" ? (
              <select style={selectStyle} value={validite} onChange={(e) => setValidite(e.target.value)}>
                <option value="15">15 jours</option>
                <option value="30">30 jours</option>
                <option value="45">45 jours</option>
                <option value="60">60 jours</option>
              </select>
            ) : (
              <input type="date" style={inputStyle} value={dateEcheance} onChange={(e) => setDateEcheance(e.target.value)} />
            )}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Référence interne</label>
          <input style={{ ...inputStyle, width: "50%" }} value={reference} onChange={(e) => setReference(e.target.value)} placeholder={type === "devis" ? "DEV-2026-001" : "FAC-2026-001"} />
        </div>

        <div style={{ marginTop: "20px", padding: "16px", background: "var(--ivory-2)", borderRadius: "12px" }}>
          {[
            { label: "Total HT", valeur: formatEuros(totalHT) },
            { label: `TVA ${tauxTVA}%`, valeur: formatEuros(montantTVA) },
            ...(tauxEscompte > 0 ? [{ label: `Escompte ${tauxEscompte}%`, valeur: `− ${formatEuros(montantEscompte)}`, rouge: true }] : []),
            ...(tauxAcompte > 0 ? [{ label: `Acompte ${tauxAcompte}%`, valeur: `− ${formatEuros(montantAcompte)}`, rouge: true }] : []),
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "13px" }}>
              <span style={{ color: "var(--ink-2)" }}>{row.label}</span>
              <span style={{ fontFamily: "Geist Mono, monospace", color: row.rouge ? "var(--accent)" : "var(--ink)" }}>{row.valeur}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "var(--line)", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
              {tauxAcompte > 0 ? "Reste à payer" : "Total TTC"}
            </span>
            <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)" }}>
              {formatEuros(tauxAcompte > 0 ? resteAPayer : totalTTC)}
            </span>
          </div>
        </div>
      </div>

      {/* BLOC 04 — NOTES LIBRES */}
      <div style={blocStyle}>
        <div style={blocHeaderStyle}>
          <span style={eyebrowStyle}>04 — Notes &amp; contexte
            <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "10px", color: "var(--ink-3)", marginLeft: "6px" }}>
              (optionnel — aide Inès à affiner)
            </span>
          </span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Budget serré, délai court, préférences particulières, contexte du projet..."
          style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--line)", borderRadius: "12px", fontSize: "14px", background: "white", color: "var(--ink)", outline: "none", resize: "none" as const, boxSizing: "border-box" as const, fontFamily: "Geist, sans-serif" }}
        />
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
        <a href={retourHref} style={{ fontSize: "13px", color: "var(--ink-3)", textDecoration: "none" }}>← Retour</a>
        <button type="submit" disabled={loadingSauvegarde} style={{ padding: "11px 26px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13.5px", fontWeight: 500, cursor: loadingSauvegarde ? "not-allowed" : "pointer", opacity: loadingSauvegarde ? 0.6 : 1 }}>
          {loadingSauvegarde ? "Enregistrement..." : type === "devis" ? "Enregistrer le devis →" : "Enregistrer la facture →"}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
