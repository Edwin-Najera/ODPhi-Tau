import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mtb from "./pages/Mtb";
import Gallery from "./pages/Gallery";
import Service from "./pages/Service";
import Login from "./pages/Login";
import Onlybros from "./pages/Onlybros";
import Contact from "./pages/Contact";
import Alumni from "./components/Brotherhood/Alumni";
import AllBros from "./components/Brotherhood/AllBros";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import { useEffect } from "react";
import Mgc from "./pages/Mgc";

function App() {
  const ScrollToTop = () => {
    useEffect(() => {
      const timeout = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);

      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return null;
  };

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MTB" element={<Mtb />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/MGC" element={<Mgc />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Onlybros"
          element={
            <ProtectedRoute>
              <Onlybros />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Onlybros/Alumni"
          element={
            <ProtectedRoute>
              <Alumni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Onlybros/AllBros"
          element={
            <ProtectedRoute>
              <AllBros />
            </ProtectedRoute>
          }
        />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
