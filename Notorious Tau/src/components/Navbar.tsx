import UserInfo from "./Admin/UserInfo";
import "./global.css";
import Logo from "./Photos/T.png";
import { Link } from "react-router-dom";

function Navbar() {
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
              <Link to="/Gallery" className="nav-link">
                Gallery
              </Link>
              <div className="nav-link">Service</div>
              <Link to="/Onlybros" className="nav-link">
                Brothers Only
              </Link>
              <Link to="/Contact" className="nav-link">
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
