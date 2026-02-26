import "./global.css";
import Logo from "./Photos/T.png";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-xl fixed-top" id="navbar">
      <div className="container" id="navbar-container">
        <a className="navbar-brand" href="#">
          <img src={Logo} alt="Tau" id="logo" />
        </a>
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
        <div className="collapse navbar-collapse" id="navbar-open">
          <div
            className="d-flex navbar-nav justify-contents-center ms-auto"
            id="nav-items"
          >
            <div className="nav-link">About</div>
            <div className="nav-link">Brothers</div>
            <div className="nav-link">Service</div>
            <div className="nav-link">Brothers Only</div>
            <div className="nav-link">Contact</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
