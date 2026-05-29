import db from "./database";

const PRODUITS_DEFAUT = [
  { key: "riz_sushi", label: "Riz à Sushi", unit: "Kg", prix: 8000, tva: 0.2 },
  { key: "basmati", label: "Basmati", unit: "Kg", prix: 8000, tva: 0.2 },
  { key: "Fyvary", label: "Fy vary 32", unit: "Kg", prix: 6000, tva: 0.2 },
];

const BUDGET_DEFAUT = [
  {
    date: "2025-01-15",
    calcul: "80000 Ar - 8000 Ar = 72000 Ar",
    description: "Nanalana frais de livraison Relais des plateaux",
  },
  {
    date: "2025-02-03",
    calcul: "72000 Ar - 5000 Ar = 67000 Ar",
    description: "Nanalana frais de livraison Sahy Toliara",
  },
  {
    date: "2025-03-10",
    calcul: "67000 Ar - 12000 Ar = 55000 Ar",
    description: "Nanalana frais nandefasana 47kg Fianarantsoa",
  },
  {
    date: "2025-03-10",
    calcul: "55000 Ar + 8000 Ar = 63000 Ar",
    description: "1kg Presto",
  },
  {
    date: "2025-03-10",
    calcul: "63000 Ar + 40000 Ar = 108000 Ar",
    description: "10kg tany am tonton Njaka",
  },
  {
    date: "2025-03-10",
    calcul: "108000 Ar + 48000 Ar = 156000 Ar",
    description: "6kg Alasora",
  },
  {
    date: "2025-03-10",
    calcul: "156000 Ar + 8000 Ar = 164000 Ar",
    description: "1kg Restaurant Shizuku",
  },
  {
    date: "2025-03-10",
    calcul: "164000 Ar + 8000 Ar = 172000 Ar",
    description: "1kg Restaurant Huo cuisine",
  },
  {
    date: "2025-03-10",
    calcul: "172000 Ar + 80000 Ar = 252000 Ar",
    description: "10kg Le sohimanga",
  },
];
const CLIENTS_DEFAUT = [
  {
    nom: "Restaurant Shizuku",
    adresse: "Villa Mont vert Ambatobe",
    nif: "4004275904",
    stat: "56101 11 2020 0 11185",
  },
  {
    nom: "Huo Cuisine",
    adresse: "Ivandry ambohjatovo",
    nif: "",
    stat: "",
  },
  {
    nom: "Le Sohimanga",
    adresse: "Immeuble fitahiana By pass, Andoharanofotsy",
    nif: "",
    stat: "",
  },
];
let initialized = false;

export async function initDB() {
  if (initialized) return;
  initialized = true;

  const countProduits = await db.produits.count();
  if (countProduits === 0) {
    await db.produits.bulkAdd(PRODUITS_DEFAUT);
  }

  const countBudget = await db.budget.count();
  if (countBudget === 0) {
    await db.budget.bulkAdd(BUDGET_DEFAUT);
  }

  const countClients = await db.clients.count();
  if (countClients === 0) {
    await db.clients.bulkAdd(CLIENTS_DEFAUT);
  }
}

export async function genererNumeroFacture() {
  const annee = new Date().getFullYear();
  const toutesFactures = await db.factures.toArray();
  const facturesAnnee = toutesFactures.filter((f) =>
    f.date?.startsWith(String(annee)),
  );
  const numero = String(facturesAnnee.length + 1).padStart(4, "0");
  return `VH-${annee}-${numero}`;
}
