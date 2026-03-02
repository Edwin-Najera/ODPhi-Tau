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
import Brotherhood from "./components/Brotherhood/Brotherhood";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

function App() {
  return (
    <Fragment>
      <Navbar />
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
          path="/Brotherhood"
          element={
            <ProtectedRoute>
              <Brotherhood />
            </ProtectedRoute>
          }
        />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Fragment>
  );
}

export default App;
