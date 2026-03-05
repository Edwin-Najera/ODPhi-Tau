import UserInfo from "./Admin/UserInfo";
import "./global.css";
import Logo from "./Photos/T.png";
import { Link } from "react-router-dom";

function Navbar() {
  const closeNavbar = () => {
    const navbar = document.getElementById("navbar-open");
    if (navbar?.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-xl fixed-top" id="navbar">
      <div className="container" id="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={Logo} alt="Tau" id="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-open"
          aria-controls="navbar-open"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-col">
          <div className="ms-auto d-flex">
            <UserInfo />
          </div>
          <div className="collapse navbar-collapse" id="navbar-open">
            <div
              className="d-flex navbar-nav justify-contents-center ms-auto"
              id="nav-items"
            >
              <div className="nav-link">About</div>
              <Link to="/Gallery" className="nav-link" onClick={closeNavbar}>
                Gallery
              </Link>
              <div className="nav-link">Service</div>
              <Link to="/AllBros" className="nav-link" onClick={closeNavbar}>
                Brothers Only
              </Link>
              <Link to="/Contact" className="nav-link" onClick={closeNavbar}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
