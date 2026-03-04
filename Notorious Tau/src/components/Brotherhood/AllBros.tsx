import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Admin/firebase";

function AllBros() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const tokenResult = await user?.getIdTokenResult();
      setUserRole(tokenResult?.claims.role as string);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = async () => {
    if (userRole === "admin" || userRole === "active") {
      navigate("/Onlybros");
    } else {
      alert("Cannot Navigate to admin page");
    }
  };
  return (
    <div>
      <button className="return-admin" onClick={handleNavigate}>
        Admin Page
      </button>
    </div>
  );
}

export default AllBros;
