import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/vary hikari.svg";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import Footer from "./components/Footer.jsx";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./components/InvoicePDF.jsx";
import Info from "./components/Info.jsx";
import {
  FaDoorClosed,
  FaDownload,
  FaLock,
  FaOutdent,
  FaRegNewspaper,
  FaSignOutAlt,
  FaUser,
  FaSpinner,
  FaInfo,
} from "react-icons/fa";
import FooterSimple from "./components/FooterSimple.jsx";

import db from "./db/database";
import { initDB, genererNumeroFacture } from "./db/init";

function App() {
  const invoiceRef = useRef(null);
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [showBudget, setShowBudget] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    client: "",
    adresse: "",
    ville: "",
    nif: "",
    stat: "",
    produit: "riz_sushi",
    quantite: 1,
    livraison: 0,
    numero: "",
    date: "",
  });

  const [products, setProducts] = useState({});
  const [budgetData, setBudgetData] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  useEffect(() => {
    const load = async () => {
      await initDB();

      // Charger produits
      const rows = await db.produits.toArray();
      const obj = {};
      rows.forEach((p) => {
        obj[p.key] = p;
      });
      setProducts(obj);

      // Charger budget
      const budget = await db.budget.toArray();
      setBudgetData(budget);

      const clientsDB = await db.clients.toArray();
      setClients(clientsDB);

      // Générer numéro facture automatique
      const numero = await genererNumeroFacture();

      // Date du jour
      const today = new Date().toISOString().split("T")[0];

      setFormData((prev) => ({ ...prev, date: today, numero }));
      setDbReady(true);
    };

    load();

    // Chargement logo
    const img = new Image();
    img.src = logo;
    img.onload = () => setLogoLoaded(true);
    img.onerror = () => setLogoLoaded(true);
  }, []);

  const resetForm = async () => {
    const nextNumero = await genererNumeroFacture();
    const today = new Date().toISOString().split("T")[0];
    setSelectedClientId("");
    setFormData({
      client: "",
      adresse: "",
      ville: "",
      nif: "",
      stat: "",
      produit: "riz_sushi",
      quantite: 1,
      livraison: 0,
      numero: nextNumero,
      date: today,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSelectClient = (e) => {
    const id = parseInt(e.target.value);
    setSelectedClientId(e.target.value);
    if (!id) {
      setFormData((prev) => ({
        ...prev,
        client: "",
        adresse: "",
        nif: "",
        stat: "",
      }));
      return;
    }
    const found = clients.find((c) => c.id === id);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        client: found.nom,
        adresse: found.adresse,
        nif: found.nif,
        stat: found.stat,
      }));
    }
  };
  // useEffect(() => {
  //   const today = new Date().toISOString().split("T")[0];

  //   setFormData((prev) => ({
  //     ...prev,
  //     date: today,
  //   }));

  //   const img = new Image();
  //   img.src = logo;
  //   img.onload = () => {
  //     setLogoLoaded(true);
  //     console.log("Logo chargé avec succès");
  //   };
  //   img.onerror = (e) => {
  //     console.error("Erreur chargement logo:", e);
  //     setLogoLoaded(true);
  //   };
  // }, []);

  // useEffect(() => {
  //   const today = new Date().toISOString().split("T")[0];

  //   setFormData((prev) => ({
  //     ...prev,
  //     date: today,
  //   }));
  // }, []);

  const fmt = (n) => {
    return (
      n.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " Ar"
    );
  };

  const fmtDate = (str) => {
    if (!str) return "—";

    const [y, m, d] = str.split("-");
    return `${d}.${m}.${y}`;
  };

  const doLogin = () => {
    if (loginData.username === "mparany" && loginData.password === "1231") {
      setIsLogged(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const doLogout = () => {
    setIsLogged(false);

    setLoginData({
      username: "",
      password: "",
    });

    setError(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const prod = PRODUCTS[formData.produit];
  // ✅ Utiliser products (state) au lieu de PRODUCTS (constante)
  const prod = products[formData.produit] || {
    label: "",
    unit: "",
    prix: 0,
    tva: 0,
  };
  const totalProduit = prod.prix * Number(formData.quantite);

  const total = totalProduit + Number(formData.livraison);

  // const exportPDF = async () => {
  //   setLoadingExport(true);
  //   setExportProgress(30);

  //   try {
  //     const blob = await pdf(<InvoicePDF formData={formData} />).toBlob();

  //     setExportProgress(80);

  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download =
  //       `facture_${formData.client || "client"}_${formData.date || "date"}.pdf`.replace(
  //         /\s+/g,
  //         "_",
  //       );
  //     a.click();
  //     URL.revokeObjectURL(url);

  //     setExportProgress(100);
  //     await new Promise((r) => setTimeout(r, 800));
  //   } catch (err) {
  //     console.error("Erreur export PDF:", err);
  //     alert("Erreur : " + err.message);
  //   } finally {
  //     setLoadingExport(false);
  //     setExportProgress(0);
  //   }
  // };
  const exportPDF = async () => {
    setLoadingExport(true);
    setExportProgress(30);

    try {
      const existe = clients.find(
        (c) => c.nom.toLowerCase() === formData.client.toLowerCase(),
      );
      if (!existe && formData.client) {
        const newClient = {
          nom: formData.client,
          adresse: formData.adresse,
          nif: formData.nif,
          stat: formData.stat,
        };
        await db.clients.add(newClient);
        setClients((prev) => [...prev, newClient]);
      }

      const blob = await pdf(<InvoicePDF formData={formData} />).toBlob();
      setExportProgress(70);

      // ✅ Enregistrer la facture en DB
      await db.factures.add({
        numero: formData.numero,
        client: formData.client,
        date: formData.date,
        total: totalProduit + Number(formData.livraison),
      });

      // Préparer le prochain numéro pour la facture suivante
      // const nextNumero = await genererNumeroFacture();
      // setFormData((prev) => ({ ...prev, numero: nextNumero }));
      await resetForm();
      setExportProgress(80);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        `facture_${formData.client || "client"}_${formData.date || "date"}.pdf`.replace(
          /\s+/g,
          "_",
        );
      a.click();
      URL.revokeObjectURL(url);

      setExportProgress(100);
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.error("Erreur export PDF:", err);
      alert("Erreur : " + err.message);
    } finally {
      setLoadingExport(false);
      setExportProgress(0);
    }
  };

  if (!dbReady) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <FaSpinner className="spinner" /> &nbsp; Chargement...
      </div>
    );
  }
  return (
    <>
      {!isLogged ? (
        <div id="login-page">
          <div className="login-card">
            <div className="login-logo">
              <div className="logo-icon">
                <img src={logo} alt="Vary Hikari Logo" />
              </div>

              <h1>Arigatō gozaimasu</h1>

              <p>Système de facturation Vary hikari</p>
            </div>

            {error && (
              <div className="error-msg">
                Identifiants incorrects. Réessayez.
              </div>
            )}

            <div className="form-group">
              <label>
                <FaUser /> Identifiant
              </label>

              <input
                type="text"
                placeholder="admin"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock /> Mot de passe
              </label>

              <input
                type="password"
                placeholder="••••"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <button className="btn-login" onClick={doLogin}>
              Se connecter
            </button>
          </div>
        </div>
      ) : (
        <div id="app-page">
          <header>
            <div className="header-logo">
              <img id="logo2" src={logo} alt="Vary Hikari" />
            </div>

            <div className="header-user">
              <button
                id="info_bu"
                onClick={() => {
                  (window.scrollTo({ top: 0, behavior: "smooth" }),
                    setShowBudget(true));
                }}
              >
                <p>Informations Budgetaire </p>
                <span>
                  <FaInfo />
                </span>
              </button>
              <span>
                <span>Connecté en tant que</span>
                <strong>{loginData.username}</strong>
              </span>

              <button className="btn-logout" onClick={doLogout}>
                <FaSignOutAlt />
              </button>
            </div>
          </header>

          <div className="workspace">
            {/* LEFT PANEL */}
            <div className="panel-left">
              <div className="panel-title">Nouvelle facture</div>

              <p className="section-label">
                <span>
                  <FaUser />
                </span>
                Informations client
              </p>
              <select
                className="field"
                value={selectedClientId}
                onChange={handleSelectClient}
              >
                <option value="">Sélectionner un ancien client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
              <div className="field">
                <input
                  type="text"
                  name="client"
                  placeholder="Nom du client"
                  value={formData.client}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <input
                  type="text"
                  name="adresse"
                  placeholder="Adresse du client"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>NIF</label>

                  <input
                    type="text"
                    name="nif"
                    placeholder="XXXXXXXXX"
                    value={formData.nif}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>STAT</label>

                  <input
                    type="text"
                    name="stat"
                    placeholder="XXXXXXXXX"
                    value={formData.stat}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <p className="section-label">
                <span>
                  <FaRegNewspaper />
                </span>
                Commande
              </p>

              <div className="field">
                <label>Produit</label>

                {/* <select
                  name="produit"
                  value={formData.produit}
                  onChange={handleChange}
                >
                  <option value="riz_sushi">Riz à Sushi — 8000 Ar / Kg</option>
                </select> */}
                <select
                  name="produit"
                  value={formData.produit}
                  onChange={handleChange}
                >
                  {Object.entries(products).map(([key, p]) => (
                    <option key={key} value={key}>
                      {p.label} — {p.prix.toLocaleString("fr-FR")} Ar / {p.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Quantité commandée</label>

                <input
                  type="number"
                  name="quantite"
                  min="1"
                  value={formData.quantite}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Frais de livraison (Ar)</label>

                <input
                  type="number"
                  name="livraison"
                  min="0"
                  step="0.01"
                  value={formData.livraison}
                  onChange={handleChange}
                />
              </div>

              <p className="section-label">Numéro de facture</p>

              <div className="field">
                <input
                  type="text"
                  name="numero"
                  placeholder="Numero facture"
                  value={formData.numero}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <button
                className={`btn-print ${loadingExport ? "buttondown loading" : ""}`}
                onClick={exportPDF}
                disabled={loadingExport}
              >
                {loadingExport ? (
                  <>
                    <FaSpinner className="spinner" />
                    <span>Génération PDF... {exportProgress}%</span>
                  </>
                ) : (
                  <>
                    Télécharger la facture
                    <span>
                      <FaDownload />
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT PANEL */}
            <div className="panel-right">
              <div className="invoice-wrapper">
                <p className="invoice-scale-label">Aperçu A4 — 72%</p>
                <p className="invoice-scale-label2">Apercu A4</p>

                <div className="invoice" ref={invoiceRef}>
                  <div className="invoice-top">
                    <div className="company-logo">
                      <div className="logo-badge">
                        <img
                          src={logo}
                          alt="Vary Hikari Logo"
                          crossOrigin="anonymous"
                        />
                      </div>

                      <div className="info_nay">
                        <div className="company-name">Vary Hikari</div>
                        <div className="company-tagline">DISTRIBUTION</div>
                        <div className="adrent">
                          Anosiboribory - Morarano Chrôme
                        </div>
                        <div className="nifent">
                          NIF : <span>4002074398</span>
                        </div>
                        <div className="statent">
                          STAT : <span>01118 33 2017 0 00485</span>
                        </div>
                      </div>
                    </div>

                    <div className="invoice-titleor">
                      <div className="invoice-title">FACTURE</div>
                    </div>
                  </div>

                  <div className="invoice-divider"></div>

                  <div className="invoice-meta">
                    <div className="meta-block">
                      <h4>Facturé à</h4>

                      <p>
                        <span className="highlight">
                          {formData.client || "—"}
                        </span>

                        <span>{formData.adresse || "—"}</span>
                      </p>

                      <p className="invoice-small">
                        <span>
                          NIF :<strong> {formData.nif || "XXXXXXXXX"}</strong>
                        </span>

                        <span>
                          STAT :<strong> {formData.stat || "XXXXXXXXX"}</strong>
                        </span>
                      </p>
                    </div>

                    <div className="meta-block2">
                      <h4>Détails de la facture</h4>

                      <div className="inv-info-row">
                        <span>Date :</span>

                        <span className="red">{fmtDate(formData.date)}</span>
                      </div>

                      <div className="inv-info-row">
                        <span>N° Facture :</span>

                        <span className="red">{formData.numero || "—"}</span>
                      </div>

                      <div className="inv-info-row">
                        <span>Paiement :</span>

                        <span>instantané</span>
                      </div>
                    </div>
                  </div>

                  {/* TABLE */}
                  <table className="inv-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Qté</th>
                        <th>Unité</th>
                        <th>P Unitaire</th>
                        <th>P Total produit</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>{prod.label}</td>
                        <td>{formData.quantite}</td>
                        <td>{prod.unit}</td>
                        <td>{fmt(prod.prix)}</td>
                        <td>{fmt(totalProduit)}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* TOTALS */}
                  <div className="inv-totals">
                    <div className="total-row">
                      <span>Frais de livraison</span>
                      <span>{fmt(Number(formData.livraison))}</span>
                    </div>
                    <div className="total-row">
                      <span>Prix total Produit</span>
                      <span>{fmt(totalProduit)}</span>
                    </div>
                    <div className="total-row grand">
                      <span>Total (Produit + frais)</span>
                      <span>{fmt(total)}</span>
                    </div>
                  </div>

                  <div className="signature-zone">Cachet & Signature</div>
                  <p className="merci">Vary Hikari vous remercie</p>
                </div>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
          <FooterSimple />
          <Info
            budgetData={budgetData}
            show={showBudget}
            onClose={() => setShowBudget(false)}
          />
        </div>
      )}
    </>
  );
}

export default App;
