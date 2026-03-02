import AdminPanel from "../components/Admin/AdminPanel";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import AssignRole from "../components/Admin/AssignRole";
import "../components/global.css";

function Onlybros() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  return (
    <div className="admin-page">
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
