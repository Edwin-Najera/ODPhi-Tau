import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useState } from "react";
import "../global.css";

function AssignRole() {
  const [uid, setUid] = useState("");
  const [role, setRole] = useState<"admin" | "alumni" | "bro" | "active">(
    "bro",
  );

  const setUserRole = httpsCallable(functions, "setUserRole");
  const listUser = httpsCallable(functions, "listUser");

  //Assigns the roles
  const handleAssignRole = async () => {
    try {
      await setUserRole({ uid, role });
      alert("Role assigned successfully");
    } catch (error) {
      console.error(error);
      alert("Unable to assign role");
    }
  };

  const handleList = async () => {
    const result = await listUser();
    console.log(result.data);
  };

  return (
    <div className="assign-role-container">
      <h2>Assign User Role</h2>

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
        onChange={(e) =>
          setRole(e.target.value as "admin" | "alumni" | "bro" | "active")
        }
      >
        <option value="admin">Administrator Active</option>
        <option value="active">Actives Only</option>
        <option value="alumni">Alumni</option>
        <option value="bro">Inactive & Actives</option>
        <option value="">Remove Role</option>
      </select>

      <button onClick={handleAssignRole}>Assign Role</button>
      <button onClick={handleList}>List Users in console</button>
    </div>
  );
}

export default AssignRole;
