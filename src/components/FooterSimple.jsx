import logo from "../assets/vary hikari.svg";

const FooterSimple = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer2">
      <img src={logo} alt="Vary Hikari Logo" />
      <h3>Vary Hikari</h3>
      <p>
        &copy;{currentYear} Randrianambinina Toky Adriano. Reservé à Mr Mparany
      </p>
    </footer>
  );
};

export default FooterSimple;
