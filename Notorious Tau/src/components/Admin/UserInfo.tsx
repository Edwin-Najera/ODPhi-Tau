import { useAuthRole, useLogout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const { userRole, email: userEmail } = useAuthRole();
  const navigate = useNavigate();

  let username = userEmail?.split("0")[0];
  username = username?.split(".")[0];
  if (!userEmail) {
    return null;
  }

  return (
    <div className="user-info-container">
      {username?.toUpperCase()} | {userRole?.toUpperCase()} |
      <button className="logout-btn" onClick={() => useLogout(navigate)}>
        Logout
      </button>
    </div>
  );
}

export default UserInfo;
