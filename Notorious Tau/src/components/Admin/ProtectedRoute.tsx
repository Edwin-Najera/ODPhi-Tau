import { useState, useEffect, type JSX } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-ball" id="loading-one" />
        <div className="loading-ball" id="loading-two" />
        <div className="loading-ball" id="loading-three" />
      </div>
    );
  }
  return user ? children : <Navigate to="/Login" />;
}

export default ProtectedRoute;
