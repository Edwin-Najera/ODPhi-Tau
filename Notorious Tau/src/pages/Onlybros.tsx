import AdminPanel from "../components/Admin/AdminPanel";
import CountdownAdmin from "../components/Admin/CountdownFolder/CountdownAdmin";
import AssignRole from "../components/Admin/AssignRole";
import "../components/global.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Onlybros() {
  const navigate = useNavigate();
  const [activePanels, setActivePanels] = useState<string[]>([]);

  const togglePanel = (panel: string) => {
    if (activePanels.includes(panel)) {
      setActivePanels((prev) =>
        prev.includes(panel)
          ? prev.filter((p) => p !== panel)
          : [...prev, panel],
      );
    } else {
      setActivePanels([...activePanels, panel]);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-row">
        <div className="admin-page-swap" onClick={() => navigate("/Alumni")}>
          Alumni
        </div>
        <div className="admin-page-swap" onClick={() => navigate("/AllBros")}>
          Brotherhood Events
        </div>
      </div>
      <div className="admin-page-row admin-panel-buttons">
        <button
          className={`admin-show-button ${activePanels.includes("events") ? "active" : ""}`}
          onClick={() => togglePanel("events")}
        >
          Events
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("brotherhood") ? "active" : ""}`}
          onClick={() => togglePanel("brotherhood")}
        >
          Brotherhood
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("service") ? "active" : ""}`}
          onClick={() => togglePanel("service")}
        >
          Service
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("alumni") ? "active" : ""}`}
          onClick={() => togglePanel("alumni")}
        >
          Alumni
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("campus") ? "active" : ""}`}
          onClick={() => togglePanel("campus")}
        >
          Campus
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("gallery") ? "active" : ""}`}
          onClick={() => togglePanel("gallery")}
        >
          Gallery
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("house") ? "active" : ""}`}
          onClick={() => togglePanel("house")}
        >
          Active & Execs
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("countdown") ? "active" : ""}`}
          onClick={() => togglePanel("countdown")}
        >
          Countdown
        </button>
        <button
          className={`admin-show-button ${activePanels.includes("assign") ? "active" : ""}`}
          onClick={() => togglePanel("assign")}
        >
          Assign Roles
        </button>
      </div>
      <div className="admin-panels-container">
        {activePanels.includes("events") && (
          <AdminPanel
            collectionName="events"
            panelTitle="Events Admin"
            hasItems={true}
          />
        )}

        {activePanels.includes("brotherhood") && (
          <AdminPanel
            collectionName="brotherhood"
            panelTitle="Brotherhood Event Admin"
          />
        )}

        {activePanels.includes("alumni") && (
          <AdminPanel
            collectionName="alumni"
            panelTitle="Alumni Event Admin"
            hasDate={true}
          />
        )}

        {activePanels.includes("campus") && (
          <AdminPanel collectionName="campus" panelTitle="Campus Updates" />
        )}
        {activePanels.includes("gallery") && (
          <AdminPanel
            collectionName="photos"
            panelTitle="Gallery Photos"
            onlyPhotos={true}
          />
        )}

        {activePanels.includes("house") && (
          <AdminPanel
            collectionName="house"
            panelTitle="Active and Exec Photos"
            activeHouse={true}
          />
        )}

        {activePanels.includes("service") && (
          <AdminPanel collectionName="service" panelTitle="Service Admin" />
        )}

        {activePanels.includes("countdown") && <CountdownAdmin />}

        {activePanels.includes("assign") && <AssignRole />}
      </div>
    </div>
  );
}

export default Onlybros;
