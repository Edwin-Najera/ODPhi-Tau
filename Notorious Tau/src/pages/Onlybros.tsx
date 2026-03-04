import AdminPanel from "../components/Admin/AdminPanel";
import AssignRole from "../components/Admin/AssignRole";
import "../components/global.css";
import { useNavigate } from "react-router-dom";

function Onlybros() {
  const navigate = useNavigate();

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
      <div className="admin-panels-container">
        <div className="col">
          <AdminPanel
            collectionName="events"
            panelTitle="Events Admin Panel"
            hasItems={true}
            hasDate={false}
            onlyPhotos={false}
          />
        </div>
        <div className="col">
          <AdminPanel
            collectionName="brotherhood"
            panelTitle="Brotherhood Event Admin Panel"
            hasItems={false}
            hasDate={false}
            onlyPhotos={false}
          />
        </div>
      </div>
      <div className="admin-panels-container">
        <div className="col-xl">
          <AdminPanel
            collectionName="alumni"
            panelTitle="Alumni Event Admin Panel"
            hasItems={false}
            hasDate={true}
            onlyPhotos={false}
          />
        </div>
        <div className="col-xl">
          <AdminPanel
            collectionName="campus"
            panelTitle="Campus Updates"
            hasItems={false}
            hasDate={false}
            onlyPhotos={false}
          />
        </div>
      </div>
      <div className="admin-panels-container">
        <div className="col-xl">
          <AdminPanel
            collectionName="photos"
            panelTitle="Gallery Photos"
            hasItems={false}
            hasDate={false}
            onlyPhotos={true}
          />
        </div>
      </div>
      <AssignRole />
    </div>
  );
}

export default Onlybros;
