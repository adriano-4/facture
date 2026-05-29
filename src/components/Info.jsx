import { FaArrowAltCircleUp, FaClosedCaptioning } from "react-icons/fa";
import logo from "../assets/vary hikari.svg";
import { useEffect } from "react";
import { FaX, FaInfo } from "react-icons/fa6";
function Info({ budgetData = [], show, onClose }) {
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
              {budgetData
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
                        {row.calcul}
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
            {budgetData
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
                        {row.calcul}
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
          <span>252 000 Ar</span>
        </div>
      </div>
    </div>
  );
}

export default Info;
