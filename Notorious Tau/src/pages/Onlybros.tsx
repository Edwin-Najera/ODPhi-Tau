import AdminPanel from "../components/Admin/AdminPanel";
import AssignRole from "../components/Admin/AssignRole";
import "../components/global.css";
import { useNavigate } from "react-router-dom";

function Onlybros() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-page-swap" onClick={() => navigate("/Alumni")}>
        Go To Alumni Page
      </div>
      <div className="admin-panels-container">
        <div className="col">
          <AdminPanel
            collectionName="events"
            panelTitle="Events Admin Panel"
            hasItems={true}
          />
        </div>
        <div className="col">
          <AdminPanel
            collectionName="brotherhood"
            panelTitle="Brotherhood Event Admin Panel"
            hasItems={false}
          />
        </div>
      </div>
      <AssignRole />
    </div>
  );
}

export default Onlybros;
