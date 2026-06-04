import { FaArrowAltCircleUp, FaClosedCaptioning } from "react-icons/fa";
import logo from "../assets/vary hikari.svg";
import { useEffect } from "react";
import { FaX, FaInfo } from "react-icons/fa6";
function Info({ budgetData = [], show, onClose }) {
  // ===== DONNÉES LOCALES =====
  const budgetDataLocal = [
    {
      date: "2026-05-04",
      calcul: "80000 Ar - 8000 Ar = 72000 Ar",
      description: "Nanalana frais de livraison Relais des plateaux",
    },
    {
      date: "2026-05-04",
      calcul: "72000 Ar - 5000 Ar = 67000 Ar",
      description: "Nanalana frais de livraison Sahy Toliara",
    },
    {
      date: "2026-05-04",
      calcul: "67000 Ar - 12000 Ar = 55000 Ar",
      description: "Nanalana frais nandefasana 47kg Fianarantsoa",
    },
    {
      date: "2026-05-08",
      calcul: "55000 Ar + 8000 Ar = 63000 Ar",
      description: "1kg Presto",
    },
    {
      date: "2026-05-11",
      calcul: "63000 Ar + 40000 Ar = 103000 Ar",
      description: "10kg tany am tonton Njaka",
    },
    {
      date: "2026-05-16",
      calcul: "103000 Ar + 48000 Ar = 151000 Ar",
      description: "6kg Alasora",
    },
    {
      date: "2026-05-26",
      calcul: "151000 Ar + 8000 Ar = 159000 Ar",
      description: "1kg Restaurant Shizuku",
    },
    {
      date: "2026-05-27",
      calcul: "159000 Ar + 8000 Ar = 167000 Ar",
      description: "1kg Restaurant Huo cuisine",
    },
    {
      date: "2026-05-27",
      calcul: "167000 Ar + 80000 Ar = 247000 Ar",
      description: "10kg Le sohimanga",
    },
    {
      date: "2026-05-29",
      calcul: "247000 Ar - 12500 Ar = 234500 Ar",
      description: "Nividy balance",
    },
    {
      date: "2026-05-30",
      calcul: "234500 Ar + 8000 Ar = 242500 Ar",
      description: "1kg ambodimita",
    },
    {
      date: "2026-06-04",
      calcul: "242500 Ar + 32000 Ar = 274500 Ar",
      description: "4kg Ambohimanarina",
    },
  ];

  const data = budgetDataLocal;

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  const fmtDate = (str) => {
    if (!str) return "—";
    const [y, m, d] = str.split("-");
    return `${d}/${m}/${y}`;
  };
  const formatCalcul = (calcul) => {
    return calcul.replace(/\d+/g, (nombre) =>
      Number(nombre).toLocaleString("fr-FR").replace(/\s/g, "."),
    );
  };
  return (
    <div className="flou" onClick={onClose}>
      <div className="centre" onClick={(e) => e.stopPropagation()}>
        <div className="entete_centre">
          <h5>
            {/* <FaInfo
              style={{
                color: "#bba608",
              }}
            />{" "} */}
            Informations Budgétaires
          </h5>
          <button className="budget-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="entete__">
          <p>
            Découvrez ici les différentes opérations budgétaires effectuées.
          </p>
          <p className="recent">
            Dépense récent :{" "}
            <FaArrowAltCircleUp
              style={{
                color: "#000000",
                fontSize: "0.7rem",
              }}
            />
          </p>
        </div>
        <div className="entete_milieu">
          <table className="entete_milieu_table">
            {/* <thead>
            <tr>
              <th>Date</th>
              <th>Calcul</th>
              <th>Description</th>
            </tr>
          </thead> */}
            <tbody>
              {data
                .slice()
                .reverse()
                .map((row, i) => {
                  const isPlus = row.calcul.split("=")[0].includes("+");
                  const isMinus = !isPlus;
                  return (
                    <tr key={i}>
                      <td
                        style={{
                          color: row.calcul.split("=")[0].includes("+")
                            ? "#22c55e"
                            : "#ef4444",
                        }}
                      >
                        {/* {row.calcul} */}
                        {formatCalcul(row.calcul)}
                      </td>
                      <td
                        style={{
                          color: row.calcul.split("=")[0].includes("+")
                            ? "#22c55e"
                            : "#ef4444",
                        }}
                      >
                        {row.description}
                      </td>
                      <td
                      // style={{
                      //   color: row.calcul.split("=")[0].includes("+")
                      //     ? "#22c55e"
                      //     : "#ef4444",
                      // }}
                      >
                        {fmtDate(row.date)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="resp_mil">
            {data
              .slice()
              .reverse()
              .map((row, i) => {
                const isPlus = row.calcul.split("=")[0].includes("+");
                const isMinus = !isPlus;
                return (
                  <div className="contenu">
                    <div className="contenu_h">
                      <p>{fmtDate(row.date)}</p>
                      <span
                        style={{
                          color: row.calcul.split("=")[0].includes("+")
                            ? "#22c55e"
                            : "#ef4444",
                        }}
                      >
                        {/* {row.calcul} */}
                        {formatCalcul(row.calcul)}
                      </span>
                    </div>
                    <p>{row.description}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="entete_bas">
          <p>Total accumulé actuelement</p>
          <span>287 000 Ar</span>
        </div>
      </div>
    </div>
  );
}

export default Info;
