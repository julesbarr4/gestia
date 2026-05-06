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
    .txt("urn:factur-x.eu:1p0:basic");

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
    lineTax.ele("ram:ApplicableTradeTax")
      .ele("ram:TypeCode").txt("VAT")
      .up()
      .ele("ram:CategoryCode").txt(ligne.tauxTVA === 0 ? "AE" : "S")
      .up()
      .ele("ram:RateApplicablePercent").txt(ligne.tauxTVA.toFixed(2));
    lineTax.ele("ram:SpecifiedTradeSettlementLineMonetarySummation")
      .ele("ram:LineTotalAmount").txt(ligne.totalHT.toFixed(2));
  });

  const agreement = tx.ele("ram:ApplicableHeaderTradeAgreement");

  const seller = agreement.ele("ram:SellerTradeParty");
  seller.ele("ram:Name").txt(data.emetteurNom);
  if (data.emetteurNumeroTva) {
    seller.ele("ram:SpecifiedTaxRegistration")
      .ele("ram:ID", { schemeID: "VA" }).txt(data.emetteurNumeroTva);
  }
  if (data.emetteurSiret) {
    seller.ele("ram:SpecifiedTaxRegistration")
      .ele("ram:ID", { schemeID: "FC" }).txt(data.emetteurSiret);
  }
  if (data.emetteurAdresse) {
    const sellerAddr = seller.ele("ram:PostalTradeAddress");
    if (data.emetteurCodePostal) sellerAddr.ele("ram:PostcodeCode").txt(data.emetteurCodePostal);
    if (data.emetteurAdresse) sellerAddr.ele("ram:LineOne").txt(data.emetteurAdresse);
    if (data.emetteurVille) sellerAddr.ele("ram:CityName").txt(data.emetteurVille);
    sellerAddr.ele("ram:CountryID").txt(data.emetteurPays || "FR");
  }

  const buyer = agreement.ele("ram:BuyerTradeParty");
  buyer.ele("ram:Name").txt(data.clientNom);
  if (data.clientNumeroTva) {
    buyer.ele("ram:SpecifiedTaxRegistration")
      .ele("ram:ID", { schemeID: "VA" }).txt(data.clientNumeroTva);
  }
  if (data.clientSiret) {
    buyer.ele("ram:SpecifiedTaxRegistration")
      .ele("ram:ID", { schemeID: "FC" }).txt(data.clientSiret);
  }
  if (data.clientAdresse) {
    const buyerAddr = buyer.ele("ram:PostalTradeAddress");
    if (data.clientCodePostal) buyerAddr.ele("ram:PostcodeCode").txt(data.clientCodePostal);
    buyerAddr.ele("ram:LineOne").txt(data.clientAdresse);
    if (data.clientVille) buyerAddr.ele("ram:CityName").txt(data.clientVille);
    buyerAddr.ele("ram:CountryID").txt(data.clientPays || "FR");
  }

  tx.ele("ram:ApplicableHeaderTradeDelivery");

  const settlement = tx.ele("ram:ApplicableHeaderTradeSettlement");
  if (data.emetteurNumeroTva) {
    settlement.ele("ram:CreditorReferenceID").txt(data.emetteurNumeroTva);
  }
  settlement.ele("ram:InvoiceCurrencyCode").txt("EUR");

  const tax = settlement.ele("ram:ApplicableTradeTax");
  tax.ele("ram:CalculatedAmount").txt(data.totalTVA.toFixed(2));
  tax.ele("ram:TypeCode").txt("VAT");
  if (data.mentionTvaDebits) {
    tax.ele("ram:DueDateTypeCode").txt("72");
  }
  tax.ele("ram:BasisAmount").txt(data.totalHT.toFixed(2));
  tax.ele("ram:CategoryCode").txt(data.tauxTVA === 0 ? "AE" : "S");
  tax.ele("ram:RateApplicablePercent").txt(data.tauxTVA.toFixed(2));

  if (data.dateEcheance) {
    settlement.ele("ram:SpecifiedTradePaymentTerms")
      .ele("ram:DueDateDateTime")
      .ele("udt:DateTimeString", { format: "102" })
      .txt(formatDate(data.dateEcheance));
  }

  if (data.iban) {
    const payMeans = settlement.ele("ram:SpecifiedTradeSettlementPaymentMeans");
    payMeans.ele("ram:TypeCode").txt("58");
    payMeans.ele("ram:PayeePartyCreditorFinancialAccount")
      .ele("ram:IBANID").txt(data.iban.replace(/\s/g, ""));
    if (data.bic) {
      payMeans.ele("ram:PayeeSpecifiedCreditorFinancialInstitution")
        .ele("ram:BICID").txt(data.bic);
    }
  }

  const summary = settlement.ele("ram:SpecifiedTradeSettlementHeaderMonetarySummation");
  summary.ele("ram:LineTotalAmount").txt(data.totalHT.toFixed(2));
  summary.ele("ram:TaxBasisTotalAmount").txt(data.totalHT.toFixed(2));
  summary.ele("ram:TaxTotalAmount", { currencyID: "EUR" }).txt(data.totalTVA.toFixed(2));
  summary.ele("ram:GrandTotalAmount").txt(data.totalTTC.toFixed(2));
  summary.ele("ram:DuePayableAmount").txt(data.totalTTC.toFixed(2));

  return doc.end({ prettyPrint: true });
}
