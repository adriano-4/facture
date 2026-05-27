import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/vary hikari.svg";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import Footer from "./components/Footer.jsx";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./components/InvoicePDF.jsx";
import {
  FaDoorClosed,
  FaDownload,
  FaLock,
  FaOutdent,
  FaRegNewspaper,
  FaSignOutAlt,
  FaUser,
  FaSpinner,
} from "react-icons/fa";
import FooterSimple from "./components/FooterSimple.jsx";

const PRODUCTS = {
  riz_sushi: {
    label: "Riz à Sushi",
    unit: "Kg",
    prix: 8000,
    tva: 0.2,
  },
};

function App() {
  const invoiceRef = useRef(null);
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [logoLoaded, setLogoLoaded] = useState(false);

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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      date: today,
    }));

    const img = new Image();
    img.src = logo;
    img.onload = () => {
      setLogoLoaded(true);
      console.log("Logo chargé avec succès");
    };
    img.onerror = (e) => {
      console.error("Erreur chargement logo:", e);
      setLogoLoaded(true);
    };
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      date: today,
    }));
  }, []);

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

  const prod = PRODUCTS[formData.produit];

  const totalProduit = prod.prix * Number(formData.quantite);

  const total = totalProduit + Number(formData.livraison);

  // const exportPDF = async () => {
  //   if (!logoLoaded) {
  //     alert("Chargement du logo en cours, veuillez réessayer...");
  //     return;
  //   }

  //   setLoadingExport(true);
  //   setExportProgress(10);

  //   try {
  //     // Étape 1 : Attendre le rendu complet
  //     setExportProgress(20);
  //     await new Promise((r) => setTimeout(r, 500));

  //     // Étape 2 : Créer un clone temporaire de l'élément pour éviter les problèmes CORS
  //     const originalElement = invoiceRef.current;
  //     if (!originalElement) throw new Error("Élément non trouvé");

  //     setExportProgress(40);

  //     // Solution: Convertir le logo SVG en dataURL pour éviter les problèmes CORS
  //     const svgElements = originalElement.querySelectorAll('img[src*=".svg"]');
  //     const tempReplacements = [];

  //     // Remplacer temporairement les SVG par des canvas pour la capture
  //     for (const svgImg of svgElements) {
  //       try {
  //         const canvas = document.createElement("canvas");
  //         const ctx = canvas.getContext("2d");
  //         const img = new Image();

  //         // Attendre le chargement de l'image
  //         await new Promise((resolve, reject) => {
  //           img.onload = resolve;
  //           img.onerror = reject;
  //           img.src = svgImg.src;
  //         });

  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         ctx.drawImage(img, 0, 0);

  //         // Remplacer l'img par le canvas temporairement
  //         const tempCanvas = document.createElement("img");
  //         tempCanvas.src = canvas.toDataURL();
  //         tempCanvas.style.width = svgImg.style.width;
  //         tempCanvas.style.height = svgImg.style.height;
  //         tempCanvas.className = svgImg.className;

  //         tempReplacements.push({
  //           original: svgImg,
  //           temp: tempCanvas,
  //           parent: svgImg.parentNode,
  //           next: svgImg.nextSibling,
  //         });

  //         svgImg.parentNode.replaceChild(tempCanvas, svgImg);
  //       } catch (err) {
  //         console.error("Erreur conversion SVG:", err);
  //       }
  //     }

  //     setExportProgress(60);

  //     // Capture avec html2canvas optimisée
  //     const canvas = await html2canvas(originalElement, {
  //       scale: 3,
  //       useCORS: true,
  //       allowTaint: false,
  //       backgroundColor: "#ffffff",
  //       logging: false,
  //       imageTimeout: 0,
  //       onclone: (clonedDoc, element) => {
  //         // Forcer l'affichage du logo dans le clone
  //         const clonedLogos = clonedDoc.querySelectorAll(
  //           ".company-logo img, .logo-badge img, #logo2",
  //         );
  //         clonedLogos.forEach((logo) => {
  //           if (logo) {
  //             logo.style.opacity = "1";
  //             logo.style.visibility = "visible";
  //             logo.style.display = "block";
  //           }
  //         });
  //       },
  //     });

  //     // Restaurer les éléments originaux
  //     for (const replacement of tempReplacements) {
  //       replacement.parent.replaceChild(replacement.original, replacement.temp);
  //     }

  //     setExportProgress(80);

  //     const imgData = canvas.toDataURL("image/png", 1.0);

  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //       compress: true,
  //     });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     pdf.addImage(
  //       imgData,
  //       "PNG",
  //       0,
  //       0,
  //       pdfWidth,
  //       pdfHeight,
  //       undefined,
  //       "FAST",
  //     );

  //     const fileName =
  //       `facture_${formData.client || "client"}_${formData.date || "date"}`.replace(
  //         /\s+/g,
  //         "_",
  //       );

  //     pdf.save(fileName + ".pdf");

  //     setExportProgress(100);

  //     await new Promise((r) => setTimeout(r, 1000));
  //   } catch (error) {
  //     console.error("Erreur lors de l'export PDF:", error);
  //     alert(
  //       "Une erreur est survenue lors de la génération du PDF: " +
  //         error.message,
  //     );
  //   } finally {
  //     setLoadingExport(false);
  //     setExportProgress(0);
  //   }
  // };
  const exportPDF = async () => {
    setLoadingExport(true);
    setExportProgress(30);

    try {
      const blob = await pdf(<InvoicePDF formData={formData} />).toBlob();

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

                <select
                  name="produit"
                  value={formData.produit}
                  onChange={handleChange}
                >
                  <option value="riz_sushi">Riz à Sushi — 8000 Ar / Kg</option>
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
        </div>
      )}
    </>
  );
}

export default App;
