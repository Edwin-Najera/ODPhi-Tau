import "./App.css";
import { Fragment } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mtb from "./pages/Mtb";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Onlybros from "./pages/Onlybros";
import Contact from "./pages/Contact";
import Alumni from "./components/Brotherhood/Alumni";
import AllBros from "./components/Brotherhood/AllBros";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import { useEffect } from "react";

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
    <Fragment>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Mtb" element={<Mtb />} />
        <Route path="/Gallery" element={<Gallery />} />
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
          path="/Alumni"
          element={
            <ProtectedRoute>
              <Alumni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AllBros"
          element={
            <ProtectedRoute>
              <AllBros />
            </ProtectedRoute>
          }
        />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Fragment>
  );
}

export default App;
