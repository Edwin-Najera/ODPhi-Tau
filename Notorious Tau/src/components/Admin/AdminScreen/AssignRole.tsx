import { httpsCallable } from "firebase/functions";
import { functions } from "../../../firebase";
import { useState } from "react";
import { showMessage } from "../../../utils/handle";
import Popup from "../PopupFolder/Popup";
import "../../global.css";

const setUserRole = httpsCallable(functions, "setUserRole");
const listUser = httpsCallable(functions, "listUser");

type Role = "admin" | "alumni" | "bro" | "active";

function AssignRole() {
  const [uid, setUid] = useState("");
  const [role, setRole] = useState<Role>("bro");
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });

  //Assigns the roles
  const handleAssignRole = async () => {
    try {
      await setUserRole({ uid, role });
      showMessage("Role assigned successfully", "save", setPopup);
    } catch (error) {
      console.error(error);
      showMessage("Unable to assign role", "save", setPopup);
    }
  };

  const handleList = async () => {
    const result = await listUser();

    console.log(result);
  };

  return (
    <div className="assign-role-container flex-col gap-2 w-75 align-self-center">
      <h2 className="text-center">Assign User Role</h2>

      <input
        className="uid-input"
        type="text"
        placeholder="User ID"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
      />

      <select
        className="role-input"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
      >
        <option value="admin">Administrator Active</option>
        <option value="active">Actives Only</option>
        <option value="alumni">Alumni</option>
        <option value="bro">Inactive & Actives</option>
        <option value="">Remove Role</option>
      </select>

      <button onClick={handleAssignRole}>Assign Role</button>
      <button onClick={handleList}>List Users in console</button>
      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", type: null })}
        />
      )}
    </div>
  );
}

export default AssignRole;
