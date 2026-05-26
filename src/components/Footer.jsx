// components/Footer.jsx
import {
  FaHeart,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import logo from "../assets/vary hikari.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Vary Hikari Logo" />
            <h3>Vary Hikari</h3>
          </div>
          <p className="footer-description">
            Distribution de riz à sushi de qualité supérieure pour les
            professionnels de la restauration japonaise.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="#" className="social-link" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul className="footer-links">
            <li>
              <a href="#">Accueil</a>
            </li>
            <li>
              <a href="#">Produits</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">À propos</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <FaMapMarkerAlt />
              <span>Anosiboribory - Morarano Chrôme, Madagascar</span>
            </li>
            <li>
              <FaPhone />
              <span>+261 34 00 000 00</span>
            </li>
            <li>
              <FaEnvelope />
              <span>contact@varyhikari.mg</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Horaires d'ouverture</h4>
          <ul className="footer-hours">
            <li>Lundi - Vendredi: 8h00 - 17h00</li>
            <li>Samedi: 8h00 - 12h00</li>
            <li>Dimanche: Fermé</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Vary Hikari. Tous droits réservés.</p>
          <div className="footer-legal">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">CGV</a>
          </div>
          <p className="footer-credit">
            Fait avec <FaHeart className="heart-icon" /> par Vary Hikari Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
