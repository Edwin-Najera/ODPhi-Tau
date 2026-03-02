import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../global.css";

function Alumni() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const tokenResult = await user?.getIdTokenResult();
      setUserRole(tokenResult?.claims.role as string);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = async () => {
    if (userRole !== "admin") {
      alert("Cannot Navigate to admin page");
    } else {
      navigate("/Onlybros");
    }
  };
  return (
    <div className="alumni-page">
      <button className="return-admin" onClick={handleNavigate}>
        Admin Page
      </button>
      <h1 className="alumni-header">Welcome to The Tau Alumni Page</h1>
      <div>
        <div>
          <h3>Important Events & Dates</h3>
        </div>
      </div>
    </div>
  );
}

export default Alumni;
