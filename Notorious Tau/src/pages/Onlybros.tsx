import CountdownAdmin from "../components/Admin/CountdownFolder/CountdownAdmin";
import AssignRole from "../components/Admin/AdminScreen/AssignRole";
import "../components/global.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import AdminTabs from "../components/Admin/AdminScreen/AdminTabs";

function Onlybros() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activePanel, setActivePanel] = useState(
    searchParams.get("panel") ?? "",
  );
  const editId = searchParams.get("editId") ?? null;

  const changePanel = (panel: string) => {
    if (panel !== activePanel) {
      setActivePanel(panel);
      navigate(`/Onlybros?panel=${panel}`);
    } else {
      setActivePanel("");
      navigate("/Onlybros");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-page-row">
          <button
            className="admin-page-swap"
            type="button"
            onClick={() => navigate("/Onlybros/Alumni")}
          >
            Alumni
          </button>
          <button
            className="admin-page-swap"
            type="button"
            onClick={() => navigate("/Onlybros/AllBros")}
          >
            Brotherhood Events
          </button>
        </div>
        <button
          className={`admin-show-button ${activePanel === "events" ? "active" : ""}`}
          onClick={() => changePanel("events")}
        >
          Events
        </button>
        <button
          className={`admin-show-button ${activePanel === "brotherhood" ? "active" : ""}`}
          onClick={() => changePanel("brotherhood")}
        >
          Brotherhood
        </button>
        <button
          className={`admin-show-button ${activePanel === "service" ? "active" : ""}`}
          onClick={() => changePanel("service")}
        >
          Service
        </button>
        <button
          className={`admin-show-button ${activePanel === "alumni" ? "active" : ""}`}
          onClick={() => changePanel("alumni")}
        >
          Alumni
        </button>
        <button
          className={`admin-show-button ${activePanel === "gallery" ? "active" : ""}`}
          onClick={() => changePanel("gallery")}
        >
          Gallery
        </button>
        <button
          className={`admin-show-button ${activePanel === "house" ? "active" : ""}`}
          onClick={() => changePanel("house")}
        >
          Active & Execs
        </button>
        <button
          className={`admin-show-button ${activePanel === "countdown" ? "active" : ""}`}
          onClick={() => changePanel("countdown")}
        >
          Countdown
        </button>
        <button
          className={`admin-show-button ${activePanel === "assign" ? "active" : ""}`}
          onClick={() => changePanel("assign")}
        >
          Assign Roles
        </button>
      </div>
      <div className="admin-panels-container">
        {activePanel === "events" && (
          <AdminTabs
            collectionName="events"
            tabTitle="Events"
            hasItems={true}
            editId={editId}
          />
        )}

        {activePanel === "brotherhood" && (
          <AdminTabs
            collectionName="brotherhood"
            tabTitle="Brotherhood"
            hasDate={true}
            editId={editId}
          />
        )}

        {activePanel === "alumni" && (
          <AdminTabs
            collectionName="alumni"
            tabTitle="Alumni"
            hasDate={true}
            editId={editId}
          />
        )}
        {activePanel === "gallery" && (
          <AdminTabs
            collectionName="photos"
            tabTitle="Gallery Photos"
            onlyPhotos={true}
            editId={editId}
          />
        )}

        {activePanel === "house" && (
          <AdminTabs
            collectionName="house"
            tabTitle="House & Execs"
            activeHouse={true}
            editId={editId}
          />
        )}

        {activePanel === "service" && (
          <AdminTabs collectionName="service" tabTitle="Service Events" />
        )}

        {activePanel === "countdown" && <CountdownAdmin />}

        {activePanel === "assign" && <AssignRole />}
      </div>
    </div>
  );
}

export default Onlybros;
