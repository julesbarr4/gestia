import { create } from "xmlbuilder2";

interface FacturXData {
  numero: string;
  dateEmission: string;
  dateEcheance?: string | null;
  typeOperation: "biens" | "prestations" | "mixte";
  mentionTvaDebits?: boolean;

  emetteurNom: string;
  emetteurSiret: string;
  emetteurNumeroTva?: string | null;
  emetteurAdresse?: string | null;
  emetteurCodePostal?: string | null;
  emetteurVille?: string | null;
  emetteurPays?: string;

  clientNom: string;
  clientSiret?: string | null;
  clientNumeroTva?: string | null;
  clientAdresse?: string | null;
  clientCodePostal?: string | null;
  clientVille?: string | null;
  clientPays?: string;

  lignes: Array<{
    description: string;
    quantite: number;
    prixUnitaireHT: number;
    totalHT: number;
    tauxTVA: number;
  }>;

  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  tauxTVA: number;

  conditions?: string | null;
  iban?: string | null;
  bic?: string | null;
}

function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

function getTVACategory(taux: number): { code: string; exemptionCode?: string; exemptionReason?: string } {
  if (taux === 20 || taux === 10 || taux === 5.5 || taux === 2.1) {
    return { code: "S" };
  }
  if (taux === 0) {
    return {
      code: "E",
      exemptionCode: "VATEX-EU-132",
      exemptionReason: "TVA non applicable, art. 293 B du CGI",
    };
  }
  return { code: "S" };
}

export function generateFacturXML(data: FacturXData): string {
  const doc = create({ version: "1.0", encoding: "UTF-8" })
    .ele("rsm:CrossIndustryInvoice", {
      "xmlns:rsm": "urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100",
      "xmlns:qdt": "urn:un:unece:uncefact:data:standard:QualifiedDataType:100",
      "xmlns:ram": "urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100",
      "xmlns:xs": "http://www.w3.org/2001/XMLSchema",
      "xmlns:udt": "urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100",
    });

  const ctx = doc.ele("rsm:ExchangedDocumentContext");
  ctx.ele("ram:GuidelineSpecifiedDocumentContextParameter")
    .ele("ram:ID")
    .txt("urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic");

  const header = doc.ele("rsm:ExchangedDocument");
  header.ele("ram:ID").txt(data.numero);
  header.ele("ram:TypeCode").txt("380");
  header.ele("ram:IssueDateTime")
    .ele("udt:DateTimeString", { format: "102" })
    .txt(formatDate(data.dateEmission));

  const tx = doc.ele("rsm:SupplyChainTradeTransaction");

  data.lignes.forEach((ligne, i) => {
    const lineItem = tx.ele("ram:IncludedSupplyChainTradeLineItem");
    lineItem.ele("ram:AssociatedDocumentLineDocument")
      .ele("ram:LineID").txt(String(i + 1));
    lineItem.ele("ram:SpecifiedTradeProduct")
      .ele("ram:Name").txt(ligne.description);
    const lineAgreement = lineItem.ele("ram:SpecifiedLineTradeAgreement");
    lineAgreement.ele("ram:GrossPriceProductTradePrice")
      .ele("ram:ChargeAmount").txt(ligne.prixUnitaireHT.toFixed(2));
    lineAgreement.ele("ram:NetPriceProductTradePrice")
      .ele("ram:ChargeAmount").txt(ligne.prixUnitaireHT.toFixed(2));
    lineItem.ele("ram:SpecifiedLineTradeDelivery")
      .ele("ram:BilledQuantity", { unitCode: "C62" })
      .txt(ligne.quantite.toFixed(2));
    const lineTax = lineItem.ele("ram:SpecifiedLineTradeSettlement");
    const ligneTVA = getTVACategory(ligne.tauxTVA);
    const lineTaxDetails = lineTax.ele("ram:ApplicableTradeTax");
    lineTaxDetails.ele("ram:TypeCode").txt("VAT");
    if (ligneTVA.exemptionReason) {
      lineTaxDetails.ele("ram:ExemptionReason").txt(ligneTVA.exemptionReason);
    }
    lineTaxDetails.ele("ram:CategoryCode").txt(ligneTVA.code);
    lineTaxDetails.ele("ram:RateApplicablePercent").txt(ligne.tauxTVA.toFixed(2));
    lineTax.ele("ram:SpecifiedTradeSettlementLineMonetarySummation")
      .ele("ram:LineTotalAmount").txt(ligne.totalHT.toFixed(2));
  });

  const agreement = tx.ele("ram:ApplicableHeaderTradeAgreement");

  const seller = agreement.ele("ram:SellerTradeParty");
  if (data.emetteurSiret) {
    seller.ele("ram:GlobalID", { schemeID: "0002" }).txt(data.emetteurSiret);
  }
  seller.ele("ram:Name").txt(data.emetteurNom);
  if (data.emetteurAdresse || data.emetteurCodePostal || data.emetteurVille) {
    const sellerAddr = seller.ele("ram:PostalTradeAddress");
    sellerAddr.ele("ram:PostcodeCode").txt(data.emetteurCodePostal || "");
    sellerAddr.ele("ram:LineOne").txt(data.emetteurAdresse || "");
    sellerAddr.ele("ram:CityName").txt(data.emetteurVille || "");
    sellerAddr.ele("ram:CountryID").txt(data.emetteurPays || "FR");
  }
  if (data.emetteurNumeroTva) {
    seller.ele("ram:SpecifiedTaxRegistration")
      .ele("ram:ID", { schemeID: "VA" }).txt(data.emetteurNumeroTva);
  }

  const buyer = agreement.ele("ram:BuyerTradeParty");
  if (data.clientSiret) {
    buyer.ele("ram:GlobalID", { schemeID: "0002" }).txt(data.clientSiret);
  }
  buyer.ele("ram:Name").txt(data.clientNom);
  if (data.clientAdresse || data.clientCodePostal || data.clientVille) {
    const buyerAddr = buyer.ele("ram:PostalTradeAddress");
    buyerAddr.ele("ram:PostcodeCode").txt(data.clientCodePostal || "");
    buyerAddr.ele("ram:LineOne").txt(data.clientAdresse || "");
    buyerAddr.ele("ram:CityName").txt(data.clientVille || "");
    buyerAddr.ele("ram:CountryID").txt(data.clientPays || "FR");
  }
  if (data.clientNumeroTva) {
    buyer.ele("ram:SpecifiedTaxRegistration")
      .ele("ram:ID", { schemeID: "VA" }).txt(data.clientNumeroTva);
  }

  const delivery = tx.ele("ram:ApplicableHeaderTradeDelivery");
  delivery.ele("ram:ActualDeliverySupplyChainEvent")
    .ele("ram:OccurrenceDateTime")
    .ele("udt:DateTimeString", { format: "102" })
    .txt(formatDate(data.dateEmission));

  const settlement = tx.ele("ram:ApplicableHeaderTradeSettlement");

  settlement.ele("ram:InvoiceCurrencyCode").txt("EUR");

  if (data.iban) {
    const payMeans = settlement.ele("ram:SpecifiedTradeSettlementPaymentMeans");
    payMeans.ele("ram:TypeCode").txt("58");
    payMeans.ele("ram:PayeePartyCreditorFinancialAccount")
      .ele("ram:IBANID").txt(data.iban.replace(/\s/g, ""));
  }

  const tvaInfo = getTVACategory(data.tauxTVA);
  const tax = settlement.ele("ram:ApplicableTradeTax");
  tax.ele("ram:CalculatedAmount").txt(data.totalTVA.toFixed(2));
  tax.ele("ram:TypeCode").txt("VAT");
  if (tvaInfo.exemptionReason) {
    tax.ele("ram:ExemptionReason").txt(tvaInfo.exemptionReason);
  }
  tax.ele("ram:BasisAmount").txt(data.totalHT.toFixed(2));
  tax.ele("ram:CategoryCode").txt(tvaInfo.code);
  if (tvaInfo.code === "S" && data.mentionTvaDebits) {
    tax.ele("ram:DueDateTypeCode").txt("72");
  }
  tax.ele("ram:RateApplicablePercent").txt(data.tauxTVA.toFixed(2));

  const paymentTerms = settlement.ele("ram:SpecifiedTradePaymentTerms");
  if (data.dateEcheance) {
    paymentTerms.ele("ram:DueDateDateTime")
      .ele("udt:DateTimeString", { format: "102" })
      .txt(formatDate(data.dateEcheance));
  } else {
    paymentTerms.ele("ram:Description")
      .txt(data.conditions || "Paiement à réception de facture");
  }

  const summary = settlement.ele("ram:SpecifiedTradeSettlementHeaderMonetarySummation");
  summary.ele("ram:LineTotalAmount").txt(data.totalHT.toFixed(2));
  summary.ele("ram:TaxBasisTotalAmount").txt(data.totalHT.toFixed(2));
  summary.ele("ram:TaxTotalAmount", { currencyID: "EUR" }).txt(data.totalTVA.toFixed(2));
  summary.ele("ram:GrandTotalAmount").txt(data.totalTTC.toFixed(2));
  summary.ele("ram:DuePayableAmount").txt(data.totalTTC.toFixed(2));

  return doc.end({ prettyPrint: true });
}
