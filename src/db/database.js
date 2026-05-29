import Dexie from "dexie";

export const db = new Dexie("VaryHikariDB");

db.version(1).stores({
  produits: "++id, key, label, unit, prix, tva",
  budget: "++id, date, calcul, description",
  factures: "++id, numero, client, date, total",
});

db.version(2).stores({
  produits: "++id, key, label, unit, prix, tva",
  budget: "++id, date, calcul, description",
  factures: "++id, numero, client, date, total",
  clients: "++id, nom, adresse, nif, stat",
});

export default db;
