import { useAuthRole } from "../../utils/auth";
import { handleLogout } from "../../utils/handle";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const { userRole, email: userEmail } = useAuthRole();
  const navigate = useNavigate();

  if (!userEmail) return null;

  const username = userEmail?.split("0")[0].split(".")[0].toUpperCase();

  return (
    <div className="user-info-container flex">
      {username} | {userRole?.toUpperCase()} |
      <button
        className="logout-btn flex-center"
        onClick={() => handleLogout(navigate)}
      >
        Logout
      </button>
    </div>
  );
}

export default UserInfo;
