"use client";

import {
  Document, Page, Text, View, StyleSheet, PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 52,
    paddingBottom: 52,
    paddingHorizontal: 56,
    backgroundColor: "#FBF8F3",
    color: "#0E0E0E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    paddingBottom: 22,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5DFD2",
  },
  logo: { fontSize: 22, fontFamily: "Helvetica-BoldOblique", color: "#0E0E0E" },
  docType: { fontSize: 8, letterSpacing: 2, color: "#8A8780", textTransform: "uppercase", marginBottom: 4 },
  docNumber: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0E0E0E" },
  parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  partyBlock: { width: "47%" },
  partyLabel: { fontSize: 8, letterSpacing: 1.5, color: "#8A8780", textTransform: "uppercase", marginBottom: 6 },
  partyName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0E0E0E", marginBottom: 3 },
  partyDetail: { fontSize: 9, color: "#4A4A47", lineHeight: 1.5 },
  partyMono: { fontSize: 9, color: "#8A8780", fontFamily: "Courier", marginTop: 2 },
  datesRow: { flexDirection: "row", marginBottom: 24, gap: 24 },
  dateLabel: { fontSize: 8, letterSpacing: 1.5, color: "#8A8780", textTransform: "uppercase", marginBottom: 3 },
  dateVal: { fontSize: 10, fontFamily: "Courier", color: "#0E0E0E" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F4EFE6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5DFD2",
  },
  tableLastRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  colDesc:  { flex: 1, fontSize: 8, color: "#8A8780", textTransform: "uppercase", letterSpacing: 0.8 },
  colQty:   { width: 36, textAlign: "center" as const, fontSize: 8, color: "#8A8780", textTransform: "uppercase", letterSpacing: 0.8 },
  colPrice: { width: 90, textAlign: "right" as const, fontSize: 8, color: "#8A8780", textTransform: "uppercase", letterSpacing: 0.8 },
  colTotal: { width: 90, textAlign: "right" as const, fontSize: 8, color: "#8A8780", textTransform: "uppercase", letterSpacing: 0.8 },
  cellDesc:  { flex: 1, fontSize: 10, color: "#0E0E0E", lineHeight: 1.4 },
  cellQty:   { width: 36, textAlign: "center" as const, fontSize: 10, color: "#4A4A47", fontFamily: "Courier" },
  cellPrice: { width: 90, textAlign: "right" as const, fontSize: 10, color: "#4A4A47", fontFamily: "Courier" },
  cellTotal: { width: 90, textAlign: "right" as const, fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0E0E0E" },
  totalsBlock: {
    marginTop: 20,
    backgroundColor: "#F4EFE6",
    padding: 16,
    borderRadius: 6,
    alignSelf: "flex-end" as const,
    width: 260,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  totalLabel: { fontSize: 9, color: "#4A4A47" },
  totalVal: { fontSize: 9, fontFamily: "Courier", color: "#0E0E0E" },
  totalDivider: { borderBottomWidth: 0.5, borderBottomColor: "#E5DFD2", marginVertical: 10 },
  totalTTCLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0E0E0E" },
  totalTTCVal: { fontSize: 16, fontFamily: "Helvetica-BoldOblique", color: "#0E0E0E" },
  footer: {
    marginTop: 24,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: "#E5DFD2",
  },
  footerText: { fontSize: 8, color: "#8A8780", lineHeight: 1.6 },
  signature: { fontSize: 8, color: "#8A8780", fontStyle: "italic", marginTop: 8 },
});

interface Ligne {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

interface DocumentPDFProps {
  type: "devis" | "facture";
  numero: string;
  dateEmission: string;
  dateValiditeOuEcheance?: string | null;
  emetteur: {
    nomEntreprise: string;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    siret?: string | null;
    email?: string | null;
  };
  client: {
    nom: string;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    siret?: string | null;
    email?: string | null;
  };
  lignes: Ligne[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  tauxTVA: number;
  conditions?: string | null;
  notes?: string | null;
  genereParIA?: boolean;
}

function euros(n: number): string {
  return (n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function DocumentPDF({
  type, numero, dateEmission, dateValiditeOuEcheance,
  emetteur, client, lignes, totalHT, totalTVA, totalTTC,
  tauxTVA, conditions, notes, genereParIA,
}: DocumentPDFProps) {
  const typeLabel = type === "devis" ? "DEVIS" : "FACTURE";
  const dateSuffixLabel = type === "devis" ? "Validité" : "Échéance";

  return (
    <Document title={`${typeLabel} ${numero}`} author={emetteur.nomEntreprise}>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <Text style={styles.logo}>Gestia</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.docType}>{typeLabel}</Text>
            <Text style={styles.docNumber}>{numero}</Text>
          </View>
        </View>

        <View style={styles.parties}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Émetteur</Text>
            <Text style={styles.partyName}>{emetteur.nomEntreprise}</Text>
            {emetteur.adresse && <Text style={styles.partyDetail}>{emetteur.adresse}</Text>}
            {(emetteur.codePostal || emetteur.ville) && (
              <Text style={styles.partyDetail}>{emetteur.codePostal} {emetteur.ville}</Text>
            )}
            {emetteur.siret && <Text style={styles.partyMono}>SIRET {emetteur.siret}</Text>}
            {emetteur.email && <Text style={styles.partyMono}>{emetteur.email}</Text>}
          </View>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Client</Text>
            <Text style={styles.partyName}>{client.nom}</Text>
            {client.adresse && <Text style={styles.partyDetail}>{client.adresse}</Text>}
            {(client.codePostal || client.ville) && (
              <Text style={styles.partyDetail}>{client.codePostal} {client.ville}</Text>
            )}
            {client.siret && <Text style={styles.partyMono}>SIRET {client.siret}</Text>}
            {client.email && <Text style={styles.partyMono}>{client.email}</Text>}
          </View>
        </View>

        <View style={styles.datesRow}>
          <View style={{}}>
            <Text style={styles.dateLabel}>Date d&apos;émission</Text>
            <Text style={styles.dateVal}>
              {new Date(dateEmission).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </View>
          {dateValiditeOuEcheance && (
            <View style={{}}>
              <Text style={styles.dateLabel}>{dateSuffixLabel}</Text>
              <Text style={styles.dateVal}>
                {new Date(dateValiditeOuEcheance).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qté</Text>
          <Text style={styles.colPrice}>Prix HT</Text>
          <Text style={styles.colTotal}>Total HT</Text>
        </View>

        {lignes.map((l, i) => (
          <View key={i} style={i === lignes.length - 1 ? styles.tableLastRow : styles.tableRow}>
            <Text style={styles.cellDesc}>{l.description}</Text>
            <Text style={styles.cellQty}>{l.quantite}</Text>
            <Text style={styles.cellPrice}>{euros(l.prixUnitaireHT)}</Text>
            <Text style={styles.cellTotal}>{euros(l.totalHT)}</Text>
          </View>
        ))}

        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalVal}>{euros(totalHT)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA {tauxTVA}%</Text>
            <Text style={styles.totalVal}>{euros(totalTVA)}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalTTCLabel}>Total TTC</Text>
            <Text style={styles.totalTTCVal}>{euros(totalTTC)}</Text>
          </View>
        </View>

        {(conditions || notes) && (
          <View style={styles.footer}>
            {conditions && (
              <Text style={styles.footerText}>
                Conditions de paiement : {conditions}
              </Text>
            )}
            {notes && <Text style={styles.footerText}>{notes}</Text>}
          </View>
        )}

        <View style={{ ...styles.footer, marginTop: 20 }}>
          <Text style={styles.footerText}>
            En cas de retard de paiement, des pénalités de 3× le taux légal s&apos;appliquent,
            ainsi qu&apos;une indemnité forfaitaire de recouvrement de 40€ (art. L441-10 C. com.).
          </Text>
          {genereParIA && (
            <Text style={styles.signature}>
              — Généré par Inès, votre assistante administrative Gestia
            </Text>
          )}
        </View>

      </Page>
    </Document>
  );
}

interface BoutonPDFProps extends DocumentPDFProps {
  nomFichier: string;
}

export function BoutonPDF({ nomFichier, ...props }: BoutonPDFProps) {
  return (
    <PDFDownloadLink
      document={<DocumentPDF {...props} />}
      fileName={nomFichier}
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <button
          style={{
            fontSize: "12px",
            color: loading ? "#8A8780" : "#FBF8F3",
            background: loading ? "#F4EFE6" : "#0E0E0E",
            border: "none",
            borderRadius: "999px",
            padding: "6px 16px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {loading ? "Préparation..." : "↓ Télécharger PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
