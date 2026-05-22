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
  const actionId = searchParams.get("actionId") ?? null;

  const panels = [
    { id: "events", label: "Events" },
    { id: "brotherhood", label: "Brotherhood" },
    { id: "service", label: "Service" },
    { id: "alumni", label: "Alumni" },
    { id: "gallery", label: "Gallery" },
    { id: "house", label: "Active & Execs" },
    { id: "countdown", label: "Countdown" },
    { id: "assign", label: "Assign Roles" },
  ];

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
    <div className="page admin-page">
      <div className="admin-sidebar">
        <div className="admin-page-row page-btn">
          <button
            className="page-btn"
            type="button"
            onClick={() => navigate("/Onlybros/Alumni")}
          >
            Alumni
          </button>
          <button
            className="page-btn"
            type="button"
            onClick={() => navigate("/Onlybros/AllBros")}
          >
            All Brothers
          </button>
        </div>
        {panels.map(({ id, label }) => (
          <button
            key={id}
            className={`admin-show-button ${activePanel === id ? "active" : ""}`}
            onClick={() => changePanel(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="admin-panels-container">
        {activePanel === "events" && (
          <AdminTabs
            collectionName="events"
            tabTitle="Events"
            hasItems={true}
            documentId={actionId}
          />
        )}

        {activePanel === "brotherhood" && (
          <AdminTabs
            collectionName="brotherhood"
            tabTitle="Brotherhood"
            hasDate={true}
            documentId={actionId}
          />
        )}

        {activePanel === "alumni" && (
          <AdminTabs
            collectionName="alumni"
            tabTitle="Alumni"
            hasDate={true}
            documentId={actionId}
          />
        )}
        {activePanel === "gallery" && (
          <AdminTabs
            collectionName="photos"
            tabTitle="Gallery Photos"
            onlyPhotos={true}
            documentId={actionId}
          />
        )}

        {activePanel === "house" && (
          <AdminTabs
            collectionName="house"
            tabTitle="House & Execs"
            activeHouse={true}
            documentId={actionId}
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
