import UserInfo from "./Admin/UserInfo";
import "./global.css";
import Logo from "./Photos/T.png";
import { Link } from "react-router-dom";

function Navbar() {
  const closeNavbar = () => {
    const navbar = document.getElementById("navbar-nav");
    if (navbar?.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-xl fixed-top">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={Logo} alt="Tau" className="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target=".navbar-open"
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
          <div className="collapse navbar-collapse navbar-open" id="navbar-nav">
            <div className="d-flex navbar-nav justify-contents-center ms-auto nav-items">
              <Link to="/Mtb" className="nav-link" onClick={closeNavbar}>
                About
              </Link>
              <Link to="/Gallery" className="nav-link" onClick={closeNavbar}>
                Gallery
              </Link>
              <Link to="/Service" className="nav-link" onClick={closeNavbar}>
                Service
              </Link>
              <Link
                to="/Onlybros/AllBros"
                className="nav-link"
                onClick={closeNavbar}
              >
                Brothers Only
              </Link>
              <Link
                to="/Onlybros/Contact"
                className="nav-link"
                onClick={closeNavbar}
              >
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
