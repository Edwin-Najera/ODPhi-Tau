import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const [userEmail, setEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setEmail(null);
        setUserRole(null);
        return;
      }

      setEmail(user.email);

      const tokenResult = await user.getIdTokenResult();
      setUserRole((tokenResult.claims.role as string) || "none");
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const username = userEmail?.split(".")[0];
  if (!userEmail) {
    return null;
  }

  return (
    <div className="user-info-container">
      {username?.toUpperCase()} | {userRole?.toUpperCase()} |
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default UserInfo;
