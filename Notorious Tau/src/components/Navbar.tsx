import "./global.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-xl fixed-top" id="navbar">
      <div className="container" id="navbar-container">
        <a className="navbar-brand ms-4" href="#" id="nav-icon">
          Tau
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
            <div className="nav-link" id="nav-item">
              About
            </div>
            <div className="nav-link" id="nav-item">
              Brothers
            </div>
            <div className="nav-link" id="nav-item">
              Service
            </div>
            <div className="nav-link" id="nav-item">
              Brothers Only
            </div>
            <div className="nav-link" id="nav-item">
              Contact
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
