import { useNavigate } from "react-router-dom";
import "../components/global.css";

function PreLogin() {
  const navigate = useNavigate();

  return (
    <div className="prelogin-container">
      <button
        className="active-alumni-btn"
        onClick={() => {
          navigate("/login", { state: { role: "active" } });
        }}
      >
        Actives
      </button>
      <div
        className="active-alumni-btn"
        onClick={() => {
          navigate("/login", { state: { role: "alumni" } });
        }}
      >
        Active & Alumni
      </div>
    </div>
  );
}

export default PreLogin;
