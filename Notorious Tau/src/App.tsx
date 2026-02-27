import "./App.css";
import { useEffect, useState, type JSX } from "react";
import { Fragment } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebase";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mtb from "./pages/mtb";
import Gallery from "./pages/Gallery";
import Login from "./components/login";
import Onlybros from "./pages/Onlybros";
import Contact from "./pages/Contact";

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

  if (loading)
    return (
      <div>
        <div />
        <div />
        <div />
      </div>
    );

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Mtb" element={<Mtb />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/Onlybros"
          element={
            <ProtectedRoute>
              <Onlybros />
            </ProtectedRoute>
          }
        />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Fragment>
  );
}

export default App;
