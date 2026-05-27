import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import logo from "../assets/vary.png";

const ACCENT = "#b7a734";
const BORDER = "#e2ddd6";
const TEXT = "#1a1a18";
const MUTED = "#6b6b64";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 42,
    paddingHorizontal: 50,
    paddingBottom: 40,
    fontFamily: "Helvetica",
    color: TEXT,
  },

  /* HEADER */
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },

  companyLogo: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBadge: {
    width: 78,
    height: 78,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 78,
    height: 78,
    objectFit: "contain",
  },

  infoNay: {
    marginLeft: 22,
    justifyContent: "center",
  },

  companyName: {
    fontSize: 27,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1892",
    marginBottom: 8,
  },

  companyTagline: {
    fontSize: 10,
    color: TEXT,
    marginBottom: 4,
  },

  adrent: {
    fontSize: 10,
    color: TEXT,
    marginBottom: 4,
  },

  nifent: {
    fontSize: 10,
    color: TEXT,
    marginBottom: 4,
  },

  statent: {
    fontSize: 10,
    color: TEXT,
  },

  invoiceTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: ACCENT,
    marginBottom: 32,
  },

  /* META */
  invoiceMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },

  metaBlock: {
    width: "50%",
  },

  metaBlock2: {
    width: "35%",
    alignItems: "flex-end",
  },

  metaTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 14,
    color: TEXT,
  },

  highlight: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },

  address: {
    fontSize: 11,
    color: MUTED,
    marginBottom: 12,
  },

  invoiceSmall: {
    fontSize: 10,
    color: MUTED,
    marginBottom: 3,
  },

  invInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: "dotted",
    paddingVertical: 7,
  },

  invInfoLabel: {
    fontSize: 10,
    color: MUTED,
  },

  invInfoValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
  },

  /* TABLE */
  table: {
    width: "100%",
    marginBottom: 30,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: ACCENT,
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  th: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  td: {
    fontSize: 10,
    color: TEXT,
  },

  colDesc: {
    width: "32%",
    textAlign: "left",
  },

  colQty: {
    width: "12%",
    textAlign: "center",
  },

  colUnit: {
    width: "14%",
    textAlign: "center",
  },

  colPU: {
    width: "20%",
    textAlign: "center",
  },

  colTotal: {
    width: "22%",
    textAlign: "center",
  },

  /* TOTALS */
  totals: {
    alignItems: "flex-end",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingVertical: 8,
  },

  totalLabel: {
    fontSize: 11,
    color: TEXT,
  },

  totalValue: {
    fontSize: 11,
    color: TEXT,
  },

  grandRow: {
    marginTop: 10,
    backgroundColor: ACCENT,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 250,
  },

  grandText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },

  /* SIGN */
  signatureZone: {
    marginTop: 48,
    height: 80,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: ACCENT,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.4,
  },

  signatureText: {
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },

  merci: {
    marginTop: 28,
    fontSize: 10,
    color: "#1a1a2eb3",
  },
});

// const fmt = (n) =>
//   n.toLocaleString("fr-FR", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }) + " Ar";
const fmt = (n) => {
  return (
    Number(n)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ar"
  );
};
const fmtDate = (str) => {
  if (!str) return "—";
  const [y, m, d] = str.split("-");
  return `${d}.${m}.${y}`;
};

const PRODUCTS = {
  riz_sushi: {
    label: "Riz à Sushi",
    unit: "Kg",
    prix: 8000,
  },
};

export default function InvoicePDF({ formData }) {
  const prod = PRODUCTS[formData.produit];

  const totalProduit = prod.prix * Number(formData.quantite);

  const total = totalProduit + Number(formData.livraison);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* TOP */}
        <View style={styles.top}>
          <View style={styles.companyLogo}>
            <View style={styles.logoBadge}>
              <Image src={logo} style={styles.logo} />
            </View>

            <View style={styles.infoNay}>
              <Text style={styles.companyName}>Vary Hikari</Text>

              <Text style={styles.companyTagline}>DISTRIBUTION</Text>

              <Text style={styles.adrent}>Anosiboribory - Morarano Chrôme</Text>

              <Text style={styles.nifent}>NIF : 4002074398</Text>

              <Text style={styles.statent}>STAT : 01118 33 2017 0 00485</Text>
            </View>
          </View>

          <Text style={styles.invoiceTitle}>FACTURE</Text>
        </View>

        <View style={styles.divider} />

        {/* META */}
        <View style={styles.invoiceMeta}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaTitle}>Facturé à</Text>

            <Text style={styles.highlight}>{formData.client || "—"}</Text>

            <Text style={styles.address}>{formData.adresse || "—"}</Text>

            <Text style={styles.invoiceSmall}>
              NIF : {formData.nif || "XXXXXXXXX"}
            </Text>

            <Text style={styles.invoiceSmall}>
              STAT : {formData.stat || "XXXXXXXXX"}
            </Text>
          </View>

          <View style={styles.metaBlock2}>
            <Text style={styles.metaTitle}>Détails de la facture</Text>

            <View style={styles.invInfoRow}>
              <Text style={styles.invInfoLabel}>Date :</Text>

              <Text style={styles.invInfoValue}>{fmtDate(formData.date)}</Text>
            </View>

            <View style={styles.invInfoRow}>
              <Text style={styles.invInfoLabel}>N° Facture :</Text>

              <Text style={styles.invInfoValue}>{formData.numero || "—"}</Text>
            </View>

            <View style={styles.invInfoRow}>
              <Text style={styles.invInfoLabel}>Paiement :</Text>

              <Text style={styles.invInfoLabel}>instantané</Text>
            </View>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>

            <Text style={[styles.th, styles.colQty]}>Qté</Text>

            <Text style={[styles.th, styles.colUnit]}>Unité</Text>

            <Text style={[styles.th, styles.colPU]}>P Unitaire</Text>

            <Text style={[styles.th, styles.colTotal]}>P Total produit</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.td, styles.colDesc]}>{prod.label}</Text>

            <Text style={[styles.td, styles.colQty]}>{formData.quantite}</Text>

            <Text style={[styles.td, styles.colUnit]}>{prod.unit}</Text>

            <Text style={[styles.td, styles.colPU]}>{fmt(prod.prix)}</Text>

            <Text style={[styles.td, styles.colTotal]}>
              {fmt(totalProduit)}
            </Text>
          </View>
        </View>

        {/* TOTALS */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Frais de livraison</Text>

            <Text style={styles.totalValue}>
              {fmt(Number(formData.livraison))}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Prix total Produit</Text>

            <Text style={styles.totalValue}>{fmt(totalProduit)}</Text>
          </View>

          <View style={styles.grandRow}>
            <Text style={styles.grandText}>Total (Produit + frais)</Text>

            <Text style={styles.grandText}>{fmt(total)}</Text>
          </View>
        </View>

        {/* SIGNATURE */}
        <View style={styles.signatureZone}>
          <Text style={styles.signatureText}>Cachet & Signature</Text>
        </View>

        {/* FOOTER */}
        {/* <Text style={styles.merci}>Vary Hikari vous remercie</Text> */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
          <Text style={styles.merci}>Vary Hikari vous remercie</Text>
        </View>
      </Page>
    </Document>
  );
}
